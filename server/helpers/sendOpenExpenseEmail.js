const sendEmail = require("./sendEmail");

/**
 * Formats currency in Indian format (₹)
 */
const formatMoney = (val) => {
  const num = typeof val === "number" ? val : parseFloat(val) || 0;
  return `₹${num.toFixed(2)}`;
};

/**
 * Generates the HTML string for the Open Expense Settlement Email
 */
const generateEmailHtml = ({ groupName, totalExpenses = 0, totalAdvances = 0, members = [], expenses = [], settlements = [] }) => {
  const isAllSettled = settlements.length === 0;

  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Settlement Report: ${groupName}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f3f4f6; }
    .container { max-width: 620px; margin: 0 auto; padding: 24px 16px; }
    .card { background-color: #151c2c; border: 1px solid #28334e; border-radius: 14px; padding: 20px; margin-bottom: 20px; }
    .header-title { font-size: 22px; font-weight: 800; color: #f59e0b; margin: 0 0 6px; }
    .header-sub { font-size: 14px; color: #94a3b8; margin: 0; }
    .badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; margin-top: 12px; }
    .badge-settled { background-color: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); }
    .badge-pending { background-color: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); }
    
    .stats-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    .stat-cell { background-color: #1c263c; padding: 12px 14px; border-radius: 10px; border: 1px solid #28334e; text-align: center; }
    .stat-val { font-size: 18px; font-weight: 800; color: #f3f4f6; margin-top: 4px; }
    .stat-lbl { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; }
    
    .section-title { font-size: 15px; font-weight: 700; color: #f59e0b; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    
    .data-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
    .data-table th { background-color: #1c263c; color: #94a3b8; padding: 10px 12px; font-weight: 600; border-bottom: 1px solid #28334e; }
    .data-table td { padding: 10px 12px; border-bottom: 1px solid #1e293b; color: #cbd5e1; }
    .data-table tr:last-child td { border-bottom: none; }
    
    .tag-expense { background-color: rgba(59, 130, 246, 0.15); color: #60a5fa; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; }
    .tag-advance { background-color: rgba(168, 85, 247, 0.15); color: #c084fc; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; }
    
    .positive { color: #10b981; font-weight: 700; }
    .negative { color: #f43f5e; font-weight: 700; }
    .neutral { color: #94a3b8; }
    
    .footer { text-align: center; font-size: 12px; color: #64748b; padding-top: 10px; }
    .footer a { color: #f59e0b; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header Card -->
    <div class="card" style="border-top: 4px solid #f59e0b;">
      <div style="text-align: center;">
        <h1 class="header-title">📊 ${groupName}</h1>
        <p class="header-sub">Group Expense & Settlement Summary</p>
        <span class="badge ${isAllSettled ? "badge-settled" : "badge-pending"}">
          ${isAllSettled ? "✓ All Balances Settled Up" : "⚡ Pending Settlements"}
        </span>
      </div>

      <!-- Quick Stats -->
      <table class="stats-table" style="margin-top: 20px;">
        <tr>
          <td class="stat-cell" style="width: 33%;">
            <div class="stat-lbl">Total Expenses</div>
            <div class="stat-val" style="color: #60a5fa;">${formatMoney(totalExpenses)}</div>
          </td>
          <td style="width: 8px;"></td>
          <td class="stat-cell" style="width: 33%;">
            <div class="stat-lbl">Total Advances</div>
            <div class="stat-val" style="color: #c084fc;">${formatMoney(totalAdvances)}</div>
          </td>
          <td style="width: 8px;"></td>
          <td class="stat-cell" style="width: 33%;">
            <div class="stat-lbl">Members</div>
            <div class="stat-val">${members.length}</div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Settlement Details -->
    <div class="card">
      <h2 class="section-title">🤝 Settlement Status</h2>
      ${
        isAllSettled
          ? `<div style="text-align: center; padding: 14px 0; color: #10b981;">
              <p style="font-size: 15px; font-weight: 700; margin: 0;">All settled up!</p>
              <p style="font-size: 13px; color: #94a3b8; margin: 4px 0 0;">No pending payments needed between group members.</p>
            </div>`
          : `<table class="data-table">
              <thead>
                <tr>
                  <th>From (Debtor)</th>
                  <th>To (Creditor)</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${settlements
                  .map(
                    (s) => `
                  <tr>
                    <td><strong>${s.from}</strong></td>
                    <td><strong>${s.to}</strong></td>
                    <td style="text-align: right; color: #10b981; font-weight: 700;">${formatMoney(s.amount)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>`
      }
    </div>

    <!-- Members & Net Balances -->
    ${
      members.length > 0
        ? `
    <div class="card">
      <h2 class="section-title">👥 Member Net Balances</h2>
      <table class="data-table">
        <thead>
          <tr>
            <th>Member Name</th>
            <th style="text-align: right;">Net Balance</th>
            <th style="text-align: right;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${members
            .map((m) => {
              const bal = typeof m.netBalance === "number" ? m.netBalance : 0;
              const isPositive = bal > 0.01;
              const isNegative = bal < -0.01;
              const statusClass = isPositive ? "positive" : isNegative ? "negative" : "neutral";
              const statusText = isPositive ? "Gets back" : isNegative ? "Owes" : "Settled";
              const balanceFormatted = isPositive ? `+${formatMoney(bal)}` : isNegative ? `-${formatMoney(Math.abs(bal))}` : `${formatMoney(0)}`;

              return `
              <tr>
                <td><strong>${m.name}</strong></td>
                <td style="text-align: right;" class="${statusClass}">${balanceFormatted}</td>
                <td style="text-align: right;" class="${statusClass}">${statusText}</td>
              </tr>
            `;
            })
            .join("")}
        </tbody>
      </table>
    </div>
    `
        : ""
    }

    <!-- All Transactions Breakdown -->
    ${
      expenses.length > 0
        ? `
    <div class="card">
      <h2 class="section-title">📝 Activity & Expense Breakdown (${expenses.length})</h2>
      <table class="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Type</th>
            <th>Paid / Given By</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${expenses
            .map((exp) => {
              const isAdvance = exp.type === "advance";
              const dateStr = exp.date ? new Date(exp.date).toLocaleDateString() : "-";
              const paidInfo = isAdvance && exp.receiverName ? `${exp.paidByName} → ${exp.receiverName}` : exp.paidByName;

              return `
              <tr>
                <td style="white-space: nowrap; color: #94a3b8; font-size: 12px;">${dateStr}</td>
                <td>
                  <strong>${exp.description}</strong>
                  ${
                    exp.shares && exp.shares.length > 0 && !isAdvance
                      ? `<div style="font-size: 11px; color: #94a3b8; margin-top: 3px;">
                          Split: ${exp.shares.map((s) => `${s.memberName} (${formatMoney(s.amount)})`).join(", ")}
                        </div>`
                      : ""
                  }
                </td>
                <td><span class="${isAdvance ? "tag-advance" : "tag-expense"}">${isAdvance ? "Advance" : "Expense"}</span></td>
                <td>${paidInfo}</td>
                <td style="text-align: right; font-weight: 700; color: #f3f4f6;">${formatMoney(exp.amount)}</td>
              </tr>
            `;
            })
            .join("")}
        </tbody>
      </table>
    </div>
    `
        : ""
    }

    <!-- Footer -->
    <div class="footer">
      <p>This settlement summary was generated by <strong>Hisabkar</strong>.</p>
      <p style="font-size: 11px; margin-top: 4px; color: #475569;">Keep this email for your permanent records.</p>
    </div>
  </div>
</body>
</html>
`;

  return html;
};

/**
 * Sends the settlement and expense breakdown to the requested email
 */
async function sendOpenExpenseEmail({ email, groupName, totalExpenses = 0, totalAdvances = 0, members = [], expenses = [], settlements = [] }) {
  const isAllSettled = settlements.length === 0;
  const subject = `💰 ${groupName} — ${isAllSettled ? "Settled Summary" : "Expense Report"} | Hisabkar`;

  const plainText = `
${groupName} — Expense & Settlement Summary
-------------------------------------------
Status: ${isAllSettled ? "All Balances Settled Up" : "Pending Settlements"}
Total Expenses: ${formatMoney(totalExpenses)}
Total Advances: ${formatMoney(totalAdvances)}
Total Activity: ${expenses.length} records
Members: ${members.map((m) => m.name).join(", ")}

Settlements:
${isAllSettled ? "All balances are settled up!" : settlements.map((s) => `• ${s.from} owes ${s.to}: ${formatMoney(s.amount)}`).join("\n")}

Detailed Expenses:
${expenses.map((e) => `• ${e.description} - ${formatMoney(e.amount)} (Paid by ${e.paidByName})`).join("\n")}

Generated by Hisabkar.
`;

  const html = generateEmailHtml({
    groupName,
    totalExpenses,
    totalAdvances,
    members,
    expenses,
    settlements,
  });

  await sendEmail(email, {
    subject,
    text: plainText,
    html,
  });
}

module.exports = sendOpenExpenseEmail;
