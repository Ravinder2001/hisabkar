const { Queue, Worker } = require("bullmq");
const nodemailer = require("nodemailer");
const groupModel = require("../model/group.model");
const config = require("../configuration/config");

// Setup Redis connection options
const connection = {
  url: config.REDIS_URL,
};

// Create the Queue
const settlementReportQueue = new Queue("SettlementReportQueue", { connection });

// Helper to generate the email HTML for a user
const generateEmailHTML = (member, group, expenses, expenseMembers, simplifiedPairs, chartUrl, allMembers) => {
  const userId = member.user_id;

  // Find simplified pairs involving the user (simplifiedPairs use user_id in from/to)
  const userOwes = simplifiedPairs.filter((p) => p.from === userId);
  const userIsOwed = simplifiedPairs.filter((p) => p.to === userId);

  // Helper to get name from user_id
  const getUserName = (id) => {
    const found = allMembers.find((m) => m.id === id || m.user_id === id);
    return found ? found.name : `User ${id}`;
  };

  // Find expenses where the user was involved
  const userExpenses = expenseMembers
    .filter((em) => em.name === member.name)
    .map((em) => {
      const exp = expenses.find((e) => e.expense_id === em.expense_id);
      return { ...exp, userAmount: em.amount };
    });

  let html = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">`;
  html += `<h1 style="color: #4f46e5; text-align: center;">Settlement Report</h1>`;
  html += `<p style="font-size: 16px;">Hi <strong>${member.name}</strong>,</p>`;
  html += `<p style="font-size: 16px;">The group <strong>${group.group_name}</strong> has just been marked as settled. Here is your final summary report!</p>`;

  html += `<h2 style="border-bottom: 2px solid #f3f4f6; padding-bottom: 5px;">Group Spends Overview</h2>`;
  html += `<div style="text-align: center;"><img src="${chartUrl}" alt="Spend Chart" style="max-width: 100%; border-radius: 8px;" /></div>`;

  html += `<h2 style="border-bottom: 2px solid #f3f4f6; padding-bottom: 5px; margin-top: 30px;">Your Settlement Details</h2>`;

  if (userOwes.length === 0 && userIsOwed.length === 0) {
    html += `<p style="color: #10b981; font-weight: bold;">You are all settled up! You don't owe anyone, and no one owes you.</p>`;
  } else {
    if (userOwes.length > 0) {
      html += `<h3 style="color: #ef4444;">You need to pay:</h3><ul style="line-height: 1.6;">`;
      userOwes.forEach((p) => {
        html += `<li><strong>₹${parseFloat(p.amount).toFixed(2)}</strong> to ${getUserName(p.to)}</li>`;
      });
      html += `</ul>`;
    }
    if (userIsOwed.length > 0) {
      html += `<h3 style="color: #10b981;">You need to receive:</h3><ul style="line-height: 1.6;">`;
      userIsOwed.forEach((p) => {
        html += `<li><strong>₹${parseFloat(p.amount).toFixed(2)}</strong> from ${getUserName(p.from)}</li>`;
      });
      html += `</ul>`;
    }
  }

  html += `<h2 style="border-bottom: 2px solid #f3f4f6; padding-bottom: 5px; margin-top: 30px;">Your Expense Breakdown</h2>`;
  if (userExpenses.length > 0) {
    html += `<table style="width: 100%; border-collapse: collapse; text-align: left; margin-top: 10px;">`;
    html += `<tr style="background-color: #f9fafb; border-bottom: 1px solid #ddd;">
              <th style="padding: 10px;">Date</th>
              <th style="padding: 10px;">Expense Name</th>
              <th style="padding: 10px;">Total</th>
              <th style="padding: 10px;">Your Share</th>
            </tr>`;
    userExpenses.forEach((ue) => {
      const dateStr = ue.created_at ? new Date(ue.created_at).toLocaleDateString() : "N/A";
      html += `<tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px;">${dateStr}</td>
        <td style="padding: 10px;">${ue.expense_name}</td>
        <td style="padding: 10px; color: #6b7280;">₹${ue.expense_amount}</td>
        <td style="padding: 10px; font-weight: bold;">₹${ue.userAmount}</td>
      </tr>`;
    });
    html += `</table>`;
  } else {
    html += `<p>You were not involved in any expenses in this group.</p>`;
  }

  html += `<p style="margin-top: 30px; font-size: 14px; color: #9ca3af; text-align: center;">Powered by Hisabkar</p>`;
  html += `</div>`;

  return html;
};

// Create the Worker
const settlementReportWorker = new Worker(
  "SettlementReportQueue",
  async (job) => {
    const { groupId } = job.data;
    console.log(`[BullMQ Worker] Generating settlement reports for group ${groupId}...`);

    try {
      // 1. Fetch all necessary data
      const groupData = await groupModel.downloadGroupData({ group_id: groupId });
      const { group, members, expenses, expenseMembers } = groupData;
      const simplifiedPairs = await groupModel.getSimplifiedPairs({ group_id: groupId });

      // 2. Calculate data for the chart (Total spent by each member)
      const spentMap = {};
      members.forEach((m) => (spentMap[m.name] = 0));
      expenses.forEach((e) => {
        if (spentMap[e.paid_by] !== undefined) {
          spentMap[e.paid_by] += parseFloat(e.expense_amount);
        }
      });

      const chartLabels = Object.keys(spentMap);
      const chartData = Object.values(spentMap);

      // QuickChart API URL for a simple bar chart
      const chartConfig = {
        type: "bar",
        data: {
          labels: chartLabels,
          datasets: [{ label: "Total Spent (₹)", data: chartData, backgroundColor: "#4f46e5" }],
        },
        options: {
          title: { display: true, text: "Total Spent by Member" },
        },
      };
      const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}`;

      // 3. Setup Nodemailer Transporter using Gmail
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: config.NODEMAILER.EMAIL,
          pass: config.NODEMAILER.PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      // Fetch the actual member list from the database to get real emails!
      const realMembers = await groupModel.getGroupMembers(groupId);

      // 4. Generate and send email to each member
      for (const member of members) {
        // Find the member's real email from the getGroupMembers query
        const realMemberData = realMembers.find((m) => m.id === member.user_id);

        const targetEmail = realMemberData ? realMemberData.email : null;

        if (!targetEmail) {
          console.log(`[BullMQ Worker] Skipping ${member.name} because they have no email address.`);
          continue;
        }

        const emailHtml = generateEmailHTML(member, group, expenses, expenseMembers, simplifiedPairs, chartUrl, realMembers);

        await transporter.sendMail({
          from: '"Hisabkar System" <noreply@hisabkar.com>',
          to: targetEmail,
          subject: `Settlement Report: ${group.group_name}`,
          html: emailHtml,
        });

        console.log(`📧 [SUCCESS] Settlement email sent to ${member.name} (${targetEmail})`);
      }

      console.log(`✅ [BullMQ Worker] Finished sending all settlement reports for group ${groupId}`);
    } catch (error) {
      console.error(`❌ [BullMQ Worker] Error generating reports for group ${groupId}:`, error);
    }
  },
  { connection }
);

// Handle worker errors
settlementReportWorker.on("failed", (job, err) => {
  console.error(`❌ [BullMQ Worker] Job ${job.id} failed with error ${err.message}`);
});

module.exports = {
  settlementReportQueue,
};
