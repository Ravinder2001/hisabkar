const client = require("../configuration/db");
const { generateOTP } = require("../utils/common/common");
const generateTimestamp = require("../utils/common/generateTimestamp");
const Messages = require("../utils/constant/messages");

module.exports = {
  createGroup: async (values) => {
    try {
      await client.query("BEGIN");
      let code;
      let isUnique = false;

      // Loop to ensure the generated code is unique
      do {
        code = generateOTP();
        const result = await client.query(`SELECT COUNT(*) AS count FROM tbl_groups WHERE code = $1`, [code]);
        if (result.rows[0].count === "0") {
          isUnique = true;
        }
      } while (!isUnique);

      // Insert the group with the unique code
      const groupId = await client.query(
        `
        INSERT INTO tbl_groups(group_type_id, admin_user, code, group_name) 
        VALUES($1, $2, $3, $4)
        RETURNING group_id
        `,
        [values.groupTypeId, values.userId, code, values.groupName]
      );

      await client.query(
        `
        INSERT INTO tbl_group_members(group_id,user_id) VALUES($1,$2)`,
        [groupId.rows[0].group_id, values.userId]
      );

      const query = `
        SELECT
          g.group_id,
          g.group_name,
          g.group_type_id,
          g.total_amount,
          g.is_settled,
          (
            SELECT COUNT(*) 
            FROM tbl_group_members gm_count 
            WHERE gm_count.group_id = g.group_id
          ) AS total_members_count,
          CASE 
            WHEN g.admin_user = $1 THEN true
            ELSE false
          END AS is_you_admin,
          ARRAY(
            SELECT u.avatar
            FROM tbl_users u
            JOIN tbl_group_members gm2 ON gm2.user_id = u.user_id
            WHERE gm2.group_id = g.group_id
          ) AS members
        FROM tbl_groups g
        WHERE g.group_id IN (SELECT gm.group_id FROM tbl_group_members gm WHERE gm.user_id = $1) AND group_id = $2 AND g.is_active = TRUE
      `;

      // Execute the query with the provided userId
      const groupQuery = await client.query(query, [values.userId, groupId.rows[0].group_id]);

      await client.query("COMMIT");
      return { code, group_data: groupQuery.rows[0] };
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error in creating group:", error.message);
      throw error;
    }
  },
  joinGroup: async (values) => {
    try {
      await client.query("BEGIN");
      const groupIdQuery = await client.query(
        `
        SELECT * FROM tbl_groups WHERE code = $1
        `,
        [values.groupCode]
      );
      // Insert the group with the unique code
      let GroupID = groupIdQuery.rows[0].group_id;
      await client.query(
        `
          INSERT INTO tbl_group_members(group_id, user_id) 
          VALUES($1, $2)
          ON CONFLICT ON CONSTRAINT unique_group_user
          DO UPDATE SET 
            is_active = TRUE,
            created_at = CURRENT_TIMESTAMP
          WHERE tbl_group_members.group_id = $1 
            AND tbl_group_members.user_id = $2
        `,
        [GroupID, values.userId]
      );
      const groupMembers = await client.query(`SELECT user_id FROM tbl_group_members WHERE group_id = $1`, [GroupID]);
      await client.query("COMMIT");
      return {
        group_id: GroupID,
        groupMembers: groupMembers.rows.map((item) => item.user_id),
        group_name: groupIdQuery.rows[0].group_name,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error in creating group:", error.message);
      throw error;
    }
  },
  leaveGroup: async (values) => {
    try {
      const groupData = await client.query(`SELECT admin_user FROM tbl_groups WHERE group_id = $1`, [values.groupId]);

      if (groupData.rows[0].admin_user == values.userId) {
        throw new Error(Messages.ADMIN_NOT_LEFT);
      }

      await client.query(
        `
          UPDATE tbl_group_members 
          SET is_active = FALSE
          WHERE group_id = $1 AND user_id = $2
        `,
        [values.groupId, values.userId]
      );
      return;
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error in creating group:", error.message);
      throw error;
    }
  },
  findGroupByCode: async (groupCode) => {
    try {
      // Insert the group with the unique code
      let groupQuery = await client.query(`SELECT * FROM tbl_groups WHERE code = $1 AND is_active = TRUE`, [groupCode]);

      return groupQuery.rows[0];
    } catch (error) {
      console.error("Error in creating group:", error.message);
      throw error;
    }
  },
  getAllGroupMemebersByCode: async (groupCode) => {
    try {
      const GroupId = await client.query(`SELECT * FROM tbl_groups WHERE code = $1`, [groupCode]);

      // Insert the group with the unique code
      let groupQuery = await client.query(`SELECT * FROM tbl_group_members WHERE group_id = $1`, [GroupId.rows[0].group_id]);

      return groupQuery.rows;
    } catch (error) {
      console.error("Error in creating group:", error.message);
      throw error;
    }
  },
  getAllGroupMemebers: async (groupId) => {
    try {
      let groupQuery = await client.query(`SELECT * FROM tbl_group_members WHERE group_id = $1`, [groupId]);
      return groupQuery.rows;
    } catch (error) {
      console.error("Error in fetching group members:", error.message);
      throw error;
    }
  },
  getGroupIdsByUser: async (userId) => {
    try {
      const { rows } = await client.query(`SELECT group_id FROM tbl_group_members WHERE user_id = $1 AND is_active = TRUE`, [userId]);
      return rows.map((row) => row.group_id);
    } catch (error) {
      console.error("Error in fetching group ids by user:", error.message);
      throw error;
    }
  },
  getAllGroups: async (userId) => {
    try {
      // SQL query to get all the required information
      const query = `
              SELECT
            g.group_id,
            g.group_name,
            g.group_type_id,
            g.total_amount,
            g.code,
            g.is_settled,
            (
                SELECT COUNT(*) 
                FROM tbl_group_members gm_count 
                WHERE gm_count.group_id = g.group_id
            ) AS total_members_count,
            CASE
                WHEN g.admin_user = $1 THEN true
                ELSE false
            END AS is_you_admin,
            ARRAY(
                SELECT u.avatar
                FROM tbl_users u
                JOIN tbl_group_members gm2 ON gm2.user_id = u.user_id
                WHERE gm2.group_id = g.group_id
            ) AS members_avatars,
            (
                SELECT COALESCE(SUM(
                    CASE
                        WHEN e.paid_by = $1 AND em.user_id != $1 THEN em.amount
                        WHEN em.user_id = $1 AND e.paid_by != $1 THEN -em.amount
                        ELSE 0
                    END
                ), 0)
                FROM tbl_expenses e
                JOIN tbl_expense_members em ON em.expense_id = e.expense_id
                WHERE e.group_id = g.group_id AND e.is_active = TRUE
            ) AS net_balance
        FROM tbl_groups g
        WHERE g.group_id IN (
        SELECT gm.group_id 
        FROM tbl_group_members gm 
        WHERE gm.user_id = $1 AND gm.is_active = TRUE
        ) 
        AND g.is_active = TRUE
        ORDER BY g.created_at DESC;
      `;

      // Execute the query with the provided userId
      const groupQuery = await client.query(query, [userId]);

      // Process the result
      const groups = groupQuery.rows.map((group) => {
        const avatars = group.members_avatars || [];
        return {
          ...group,
          members: avatars.slice(0, 2), // Only first 5 avatars
          remaining_members: avatars.length > 2 ? avatars.length - 2 : undefined, // Remaining count
          members_avatars: undefined, // Removing the raw avatars array
          net_balance: parseFloat(group.net_balance) || 0, // positive = owed to you, negative = you owe
        };
      });

      return groups;
    } catch (error) {
      console.error("Error in fetching groups:", error.message);
      throw error;
    }
  },
  getGroupDataById: async (values) => {
    try {
      const query = `
       SELECT
  g.group_name,
  g.group_type_id,
  g.total_amount,
  g.is_settled,
  COUNT(DISTINCT gm.member_id) AS total_members_count,
  COUNT(DISTINCT e.expense_id) AS total_expenses_count,
  CASE 
    WHEN g.admin_user = $2 THEN true
    ELSE false
  END AS is_you_admin

FROM tbl_groups g
LEFT JOIN tbl_group_members gm ON gm.group_id = g.group_id
LEFT JOIN tbl_expenses e ON e.group_id = g.group_id
WHERE g.group_id = $1 AND g.is_active = TRUE
GROUP BY g.group_id;

      `;

      const groupQuery = await client.query(query, [values.groupId, values.userId]);

      if (groupQuery.rows.length === 0) {
        throw new Error("Group not found");
      }

      const groupData = groupQuery.rows[0];
      return {
        ...groupData,
        total_amount: parseFloat(groupData.total_amount), // Convert to number
      };
    } catch (error) {
      console.error("Error in fetching group data:", error.message);
      throw error;
    }
  },
  getGroupMembers: async (groupId) => {
    try {
      const query = `
        SELECT 
          u.user_id AS id, 
          u.name, 
          u.avatar,
          u.email, 
          COALESCE(SUM(e.amount), 0) AS total_spent,
          COALESCE(uo.availibilty_status, false) AS is_available,
          gm2.is_active AS is_current_user
        FROM tbl_users u
        JOIN tbl_group_members gm2 ON gm2.user_id = u.user_id
        LEFT JOIN tbl_expenses e ON e.paid_by = u.user_id AND e.group_id = $1
        LEFT JOIN tbl_user_options uo ON uo.user_id = u.user_id
        WHERE gm2.group_id = $1
        GROUP BY u.user_id, uo.availibilty_status, gm2.is_active
        ORDER BY COALESCE(SUM(e.amount), 0) DESC
      `;
      const membersQuery = await client.query(query, [groupId]);
      return membersQuery.rows.map((member) => ({
        ...member,
        total_spent: parseFloat(member.total_spent),
      }));
    } catch (error) {
      console.error("Error in fetching group data:", error.message);
      throw error;
    }
  },
  getGroupTypeList: async () => {
    try {
      // SQL query to get all the required information
      const query = `
        SELECT
          group_type_id as id,
          type_name as name,
          icon
        FROM tbl_group_types
      `;

      // Execute the query with the provided groupId
      const groupQuery = await client.query(query);

      return groupQuery.rows;
    } catch (error) {
      console.error("Error in fetching group data:", error.message);
      throw error;
    }
  },
  getMyPairs: async ({ group_id, user_id }) => {
    try {
      // Step 1: Fetch group members (excluding the requesting user) to initialize pairs
      const membersQuery = await client.query(
        `
        SELECT gm.user_id, u.name
        FROM tbl_group_members gm
        JOIN tbl_users u ON gm.user_id = u.user_id
        WHERE gm.group_id = $1 AND gm.user_id != $2
        `,
        [group_id, user_id]
      );

      const otherUsers = membersQuery.rows;

      // Initialize send and receive pairs
      const sendPairs = new Map();
      const receivePairs = new Map();

      otherUsers.forEach(({ user_id, name }) => {
        sendPairs.set(user_id, { user_name: name, amount: 0 });
        receivePairs.set(user_id, { user_name: name, amount: 0 });
      });

      // Step 2: Fetch all expenses and their participants
      const expenseQuery = await client.query(
        `
        SELECT e.expense_id, e.amount AS total_amount, e.paid_by, em.user_id AS participant, em.amount AS share,
               u.name AS participant_name, up.name AS payer_name
        FROM tbl_expenses e
        JOIN tbl_expense_members em ON e.expense_id = em.expense_id
        JOIN tbl_users u ON em.user_id = u.user_id
        JOIN tbl_users up ON e.paid_by = up.user_id
        WHERE e.group_id = $1 AND e.is_active = TRUE
        `,
        [group_id]
      );

      const transactions = expenseQuery.rows;

      // Step 3: Process transactions to update pairs
      transactions.forEach(({ paid_by, participant, share }) => {
        if (paid_by === participant) return; // Ignore self-payments

        const shareAmount = parseFloat(share);

        // If the requesting user paid, others owe them (increase receivePairs)
        if (paid_by === user_id) {
          if (receivePairs.has(participant)) {
            const current = receivePairs.get(participant);
            receivePairs.set(participant, { ...current, amount: current.amount + shareAmount });
          }
        }

        // If the requesting user is a participant, they owe the payer (increase sendPairs)
        if (participant === user_id) {
          if (sendPairs.has(paid_by)) {
            const current = sendPairs.get(paid_by);
            sendPairs.set(paid_by, { ...current, amount: current.amount + shareAmount });
          }
        }
      });

      // Step 4: Prepare final send and receive arrays
      const send = [];
      const receive = [];
      let totalSend = 0;
      let totalReceive = 0;

      // Process sendPairs and receivePairs
      for (const [otherUserId, sendData] of sendPairs) {
        const receiveData = receivePairs.get(otherUserId);

        // Net the amounts for this user pair
        const netAmount = sendData.amount - receiveData.amount;

        if (netAmount > 0) {
          // User owes more than they are owed, so they need to send
          // send.push({ user_name: sendData.user_name, amount: netAmount });
          send.push({ user_id: otherUserId, amount: netAmount });
          totalSend += netAmount;
        } else if (netAmount < 0) {
          // User is owed more than they owe, so they need to receive
          // receive.push({ user_name: receiveData.user_name, amount: Math.abs(netAmount) });
          receive.push({ user_id: otherUserId, amount: Math.abs(netAmount) });
          totalReceive += Math.abs(netAmount);
        }
        // If netAmount === 0, no entry in send or receive (they cancel out)
      }

      // const result = { send, receive, totalSend, totalReceive, pairs: { sendPairs: Object.values(Object.fromEntries(sendPairs)), receivePairs: Object.values(Object.fromEntries(receivePairs)) } };
      const result = { send, receive, totalSend, totalReceive };

      return result;
    } catch (error) {
      console.error("Error in fetching expense data:", error.message);
      throw error;
    }
  },
  // getMyPairs: async ({ group_id, user_id }) => {
  //   try {
  //     // Fetch all expenses related to the group
  //     const expenseQuery = await client.query(
  //       `
  //       SELECT e.expense_id, e.amount AS total_amount, e.paid_by,
  //              em.user_id AS participant, em.amount AS share,
  //              u.name AS participant_name, up.name AS payer_name
  //       FROM tbl_expenses e
  //       JOIN tbl_expense_members em ON e.expense_id = em.expense_id
  //       JOIN tbl_users u ON em.user_id = u.user_id
  //       JOIN tbl_users up ON e.paid_by = up.user_id
  //       WHERE e.group_id = $1 AND e.is_active = TRUE
  //       `,
  //       [group_id]
  //     );

  //     const transactions = expenseQuery.rows;
  //     const balances = new Map(); // Key: user_id, Value: { amount: number, name: string }

  //     transactions.forEach(({ paid_by, participant, share, participant_name, payer_name }) => {
  //       if (paid_by === participant) return;

  //       // User is the payer; others owe them
  //       if (paid_by === user_id) {
  //         const current = balances.get(participant) || { amount: 0, name: participant_name };
  //         balances.set(participant, {
  //           amount: current.amount + parseFloat(share),
  //           name: participant_name,
  //         });
  //       }

  //       // User is a participant; they owe the payer
  //       if (participant === user_id) {
  //         const current = balances.get(paid_by) || { amount: 0, name: payer_name };
  //         balances.set(paid_by, {
  //           amount: current.amount - parseFloat(share),
  //           name: payer_name,
  //         });
  //       }
  //     });

  //     const send = [];
  //     const receive = [];

  //     balances.forEach((value) => {
  //       if (value.amount > 0) {
  //         receive.push({ user_name: value.name, amount: value.amount });
  //       } else if (value.amount < 0) {
  //         send.push({ user_name: value.name, amount: Math.abs(value.amount) });
  //       }
  //     });

  //     return { send, receive };
  //   } catch (error) {
  //     console.error("Error in fetching expense data:", error.message);
  //     throw error;
  //   }
  // },
  toggleGroupSettlement: async ({ group_id, user_id }) => {
    try {
      const result = await client.query(
        `
        UPDATE tbl_groups 
        SET is_settled = NOT is_settled 
        WHERE group_id = $1 AND admin_user = $2
        RETURNING is_settled;
        `,
        [group_id, user_id]
      );

      return result.rows[0]; // Returning the updated value
    } catch (error) {
      console.error("Error in toggling group settlement:", error.message);
      throw error;
    }
  },
  toggleGroupVisibilty: async ({ group_id, user_id }) => {
    try {
      await client.query("BEGIN");
      const result = await client.query(
        `
        UPDATE tbl_groups 
        SET 
        is_active = NOT is_active,
        deleted_on = $2
        WHERE group_id = $1 AND admin_user = $3
        RETURNING is_active;
        `,
        [group_id, generateTimestamp(), user_id]
      );
      await client.query("COMMIT");
      return result.rows[0]; // Returning the updated value
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error in toggling group settlement:", error.message);
      throw error;
    }
  },
  downloadGroupData: async ({ group_id }) => {
    try {
      // Fetch group details
      const groupQuery = `
    SELECT g.group_name, gt.type_name AS group_type, g.total_amount
    FROM tbl_groups g
    JOIN tbl_group_types gt ON g.group_type_id = gt.group_type_id
    WHERE g.group_id = $1;
  `;
      const groupResult = await client.query(groupQuery, [group_id]);

      const group = groupResult.rows[0];

      // Fetch group members
      const membersQuery = `
    SELECT u.user_id, u.name
    FROM tbl_group_members gm
    JOIN tbl_users u ON gm.user_id = u.user_id
    WHERE gm.group_id = $1 AND gm.is_active = TRUE;
  `;
      const membersResult = await client.query(membersQuery, [group_id]);
      const members = membersResult.rows;

      // Fetch expenses with breakdown
      const expensesQuery = `
    SELECT e.expense_id, e.expense_name, e.expense_type, e.amount AS expense_amount, e.created_at, u.name AS paid_by
    FROM tbl_expenses e
    JOIN tbl_users u ON e.paid_by = u.user_id
    WHERE e.group_id = $1;
  `;
      const expensesResult = await client.query(expensesQuery, [group_id]);
      const expenses = expensesResult.rows;

      // Fetch expense splits
      const expenseMembersQuery = `
    SELECT em.expense_id, u.name, em.amount
    FROM tbl_expense_members em
    JOIN tbl_users u ON em.user_id = u.user_id
    WHERE em.expense_id IN (SELECT expense_id FROM tbl_expenses WHERE group_id = $1);
  `;
      const expenseMembersResult = await client.query(expenseMembersQuery, [group_id]);
      const expenseMembers = expenseMembersResult.rows;
      return { group, members, expenses, expenseMembers };
    } catch (error) {
      console.error("Error in toggling group settlement:", error.message);
      throw error;
    }
  },
  getGroupLogs: async ({ group_id }) => {
    try {
      // Base query for fetching group logs with the join to get the expense name if action type involves expenses
      let query = `
SELECT DISTINCT
  gl.log_id,
  u.name,
  gl.action_type,
  gl.old_amount,
  gl.new_amount,
  gl.created_at,
  e.expense_id,
  e.expense_name,
  CASE 
    WHEN gl.details IS NOT NULL AND jsonb_typeof(gl.details) = 'object' THEN 
      jsonb_build_object(
        'amount', (gl.details->'expense'->>'amount')::NUMERIC,
        'expense_name', gl.details->'expense'->>'expense_name',
        'members', (
          SELECT jsonb_agg(
            jsonb_build_object(
              'amount', m->'amount',
              'name', (SELECT name FROM tbl_users WHERE user_id = (m->>'user_id')::integer)
            )
          )
          FROM jsonb_array_elements(gl.details->'members') AS m
        ),
        'added_by', (SELECT name FROM tbl_users u2 WHERE u2.user_id = (gl.details->>'added_by')::INTEGER),
        'removed_user', (SELECT name FROM tbl_users u2 WHERE u2.user_id = (gl.details->>'removed_user')::INTEGER),
        'old_group_name', gl.details->'old_group_name',
        'new_group_name', gl.details->'new_group_name',
        'old_group_type', (SELECT type_name FROM tbl_group_types gt WHERE gt.group_type_id = (gl.details->>'old_group_type')::integer),
        'new_group_type', (SELECT type_name FROM tbl_group_types gt WHERE gt.group_type_id = (gl.details->>'new_group_type')::integer)
      )
    ELSE NULL
  END AS details
FROM tbl_group_logs gl
LEFT JOIN tbl_users u 
  ON gl.user_id = u.user_id
LEFT JOIN tbl_expenses e
  ON e.group_id = gl.group_id
  AND e.expense_id = CASE 
    WHEN gl.action_type IN ('EDIT', 'DELETE') THEN gl.expense_id
    ELSE NULL
  END
WHERE gl.group_id = $1
ORDER BY gl.created_at DESC;

`;

      const queryParams = [group_id];

      // Execute the query
      const result = await client.query(query, queryParams);

      // Return the logs with expense names if available
      return result.rows;
    } catch (error) {
      console.error("Error in fetching group logs:", error.message);
      throw error;
    }
  },
  getGrpupSpendAnalysis: async ({ group_id, user_id }) => {
    try {
      // Base query for fetching group logs with the join to get the expense name if action type involves expenses
      let query = `
          SELECT 
              cat.label AS expense_type,
              COALESCE(SUM(e.amount), 0) AS total_amount_spent
          FROM (
              VALUES ('Food'), ('Grocery'), ('Bills'), ('Entertainment'), ('Travel'), ('Shopping'), ('Others')
          ) AS cat(label)
          LEFT JOIN 
              tbl_expenses e ON e.expense_type = cat.label 
              AND e.group_id = $1
              AND e.is_active = TRUE
              AND ($2::INTEGER IS NULL OR e.paid_by = $2::INTEGER)
          GROUP BY 
              cat.label
          ORDER BY 
              CASE cat.label 
                  WHEN 'Food' THEN 1
                  WHEN 'Grocery' THEN 2
                  WHEN 'Bills' THEN 3
                  WHEN 'Entertainment' THEN 4
                  WHEN 'Travel' THEN 5
                  WHEN 'Shopping' THEN 6
                  WHEN 'Others' THEN 7
              END;`;

      const queryParams = [group_id, user_id];

      // Execute the query
      const result = await client.query(query, queryParams);

      // Return the logs with expense names if available
      return result.rows;
    } catch (error) {
      console.error("Error in fetching group logs:", error.message);
      throw error;
    }
  },
  deleteExpiredGroup: async () => {
    try {
      await client.query("BEGIN");

      // Find groups eligible for deletion
      const findGroupsQuery = `
      SELECT group_id FROM tbl_groups 
      WHERE is_active = FALSE 
        AND deleted_on IS NOT NULL 
        AND deleted_on < NOW() - INTERVAL '30 days';
`;

      const groupsToDelete = await client.query(findGroupsQuery);

      const groupIds = groupsToDelete.rows.map((row) => row.group_id);

      // Delete related expense members
      await client.query(
        `DELETE FROM tbl_expense_members 
        WHERE expense_id IN (SELECT expense_id FROM tbl_expenses WHERE group_id = ANY($1));`,
        [groupIds]
      );

      // Delete related expenses
      await client.query(`DELETE FROM tbl_expenses WHERE group_id = ANY($1);`, [groupIds]);

      // Delete related group members
      await client.query(`DELETE FROM tbl_group_members WHERE group_id = ANY($1);`, [groupIds]);

      // Delete related change log
      await client.query(`DELETE FROM tbl_group_logs WHERE group_id = ANY($1);`, [groupIds]);

      // Delete the expired groups
      await client.query(`DELETE FROM tbl_groups WHERE group_id = ANY($1);`, [groupIds]);

      await client.query("COMMIT");
      return;
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error in fetching group logs:", error.message);
      throw error;
    }
  },
  getFriendsList: async (user_id, group_id, search) => {
    try {
      let query;
      let queryParams;

      if (search && search.trim() !== "") {
        // Search directly in tbl_users if search parameter is provided
        query = `
          SELECT u.user_id, u.name, u.avatar, u.email
          FROM tbl_users u
          WHERE u.is_active = TRUE
          AND u.email ILIKE $1
          AND u.user_id != $2
          AND NOT EXISTS (
            SELECT 1
            FROM tbl_group_members gm
            WHERE gm.group_id = $3
            AND gm.user_id = u.user_id
            AND gm.is_active = TRUE
          )
        `;
        queryParams = [`%${search}%`, user_id, group_id];
      } else {
        // Fetch friends who share common groups but are not in the specified group
        query = `
          SELECT DISTINCT u.user_id, u.name, u.avatar, u.email
          FROM tbl_users u
          INNER JOIN tbl_group_members gm1 ON u.user_id = gm1.user_id
          INNER JOIN tbl_group_members gm2 ON gm1.group_id = gm2.group_id
          WHERE gm2.user_id = $1
          AND u.user_id != $1
          AND u.is_active = TRUE
          AND gm1.is_active = TRUE
          AND NOT EXISTS (
            SELECT 1
            FROM tbl_group_members gm3
            WHERE gm3.group_id = $2
            AND gm3.user_id = u.user_id
            AND gm3.is_active = TRUE
          )
        `;
        queryParams = [user_id, group_id];
      }

      const result = await client.query(query, queryParams);
      return result.rows;
    } catch (error) {
      console.error("Error in fetching friends list:", error.message);
      throw error;
    }
  },
  addGroupMember: async (values) => {
    try {
      await client.query("BEGIN");

      // Step 1: Insert new members into tbl_group_members
      const placeholders = values.userIds.map((_, index) => `($1, $${index + 2})`).join(", ");
      const insertMembersQuery = `
        INSERT INTO tbl_group_members (group_id, user_id)
        VALUES ${placeholders}
        ON CONFLICT ON CONSTRAINT unique_group_user
        DO UPDATE SET 
          is_active = TRUE,
          created_at = CURRENT_TIMESTAMP
        RETURNING member_id, group_id, user_id, is_active, created_at
      `;
      const queryParams = [values.groupId, ...values.userIds];
      const result = await client.query(insertMembersQuery, queryParams);

      // Step 2: Log each added member in tbl_group_logs
      const addedMembers = result.rows;
      const numUsers = addedMembers.length;
      const logPlaceholders = addedMembers.map((_, index) => `($1, $${index + 2}, 'ADDED', $${numUsers + 2}::jsonb)`).join(", ");
      const logQuery = `
        INSERT INTO tbl_group_logs (group_id, user_id, action_type, details)
        VALUES ${logPlaceholders}
        RETURNING log_id, group_id, user_id, action_type, created_at
      `;
      const logParams = [values.groupId, ...addedMembers.map((member) => member.user_id), JSON.stringify({ added_by: values.userId || null })];

      await client.query(logQuery, logParams);

      // Step 3: Commit the transaction
      await client.query("COMMIT");

      return addedMembers;
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error in adding group members:", error.message);
      throw error;
    }
  },
  getSimplifiedPairs: async ({ group_id }) => {
    try {
      // Step 2: Fetch all expenses and their participants
      const expenseQuery = await client.query(
        `
        SELECT e.expense_id, e.amount AS total_amount, e.paid_by, em.user_id AS participant, em.amount AS share
        FROM tbl_expenses e
        JOIN tbl_expense_members em ON e.expense_id = em.expense_id
        WHERE e.group_id = $1 AND e.is_active = TRUE
        `,
        [group_id]
      );

      const transactions = expenseQuery.rows;

      // Step 3: Calculate net balances
      const balances = new Map();

      transactions.forEach(({ paid_by, participant, share }) => {
        if (!balances.has(paid_by)) balances.set(paid_by, 0);
        if (!balances.has(participant)) balances.set(participant, 0);

        balances.set(paid_by, balances.get(paid_by) + parseFloat(share)); // Creditor
        balances.set(participant, balances.get(participant) - parseFloat(share)); // Debtor
      });

      // Step 4: Separate payers and receivers
      let payers = [],
        receivers = [];

      balances.forEach((balance, user_id) => {
        if (balance < 0) payers.push({ user_id, amount: Math.abs(balance) });
        if (balance > 0) receivers.push({ user_id, amount: balance });
      });

      // Step 5: Sort payers and receivers
      payers.sort((a, b) => a.amount - b.amount);
      receivers.sort((a, b) => b.amount - a.amount);

      // Step 6: Simplify transactions
      let simplifiedTransactions = [];

      let i = 0,
        j = 0;
      while (i < payers.length && j < receivers.length) {
        let payer = payers[i];
        let receiver = receivers[j];

        let transferAmount = Math.min(payer.amount, receiver.amount);

        // Direct transaction from payer to receiver
        simplifiedTransactions.push({
          from: payer.user_id,
          to: receiver.user_id,
          amount: transferAmount,
        });

        // Update balances
        payer.amount -= transferAmount;
        receiver.amount -= transferAmount;

        // Move to the next payer/receiver if their balance is settled
        if (payer.amount === 0) i++;
        if (receiver.amount === 0) j++;
      }

      return simplifiedTransactions;
    } catch (error) {
      console.error("Error in fetching expense data:", error.message);
      throw error;
    }
  },
  editGroupDetails: async (values) => {
    const { groupId, groupName, groupTypeId, removedMembers, userId } = values;

    try {
      // Start transaction
      await client.query("BEGIN");

      // Get group details including admin_user
      const groupDetails = await client.query(
        `SELECT group_name, group_type_id, admin_user 
         FROM tbl_groups 
         WHERE group_id = $1`,
        [groupId]
      );

      // Check if group exists
      if (groupDetails.rows.length === 0) {
        throw new Error("Group not found");
      }

      const adminUserId = groupDetails.rows[0].admin_user;

      // Check if admin is in removedMembers
      if (removedMembers && removedMembers.length > 0 && removedMembers.includes(adminUserId)) {
        await client.query("ROLLBACK");
        throw new Error("Admin cannot be removed from the group");
      }

      // Step 1: Update group details in tbl_groups
      if (groupDetails.rows[0].group_name != groupName) {
        await client.query(
          `
        UPDATE tbl_groups
        SET group_name = $1, group_type_id = $2
        WHERE group_id = $3
        `,
          [groupName, groupTypeId, groupId]
        );

        // Log the group details update
        await client.query(
          `
        INSERT INTO tbl_group_logs (group_id, user_id, action_type, details)
        VALUES ($1, $2, $3, $4)
        `,
          [
            groupId,
            userId,
            "EDIT_GROUP",
            JSON.stringify({
              old_group_name: groupDetails.rows[0].group_name,
              new_group_name: groupName,
              old_group_type: groupDetails.rows[0].group_type_id,
              new_group_type: groupTypeId,
            }),
          ]
        );
      }

      // Step 2: Physically remove members if removedMembers array is provided
      if (removedMembers && removedMembers.length > 0) {
        await client.query(
          `
            UPDATE tbl_group_members
            SET is_active = FALSE
            WHERE group_id = $1 AND user_id = ANY($2::int[])
          `,
          [groupId, removedMembers]
        );

        // Log each member removal
        for (const removedMemberId of removedMembers) {
          await client.query(
            `
            INSERT INTO tbl_group_logs (group_id, user_id, action_type, details)
            VALUES ($1, $2, $3, $4)
            `,
            [
              groupId,
              userId,
              "REMOVED",
              JSON.stringify({
                removed_user: removedMemberId,
              }),
            ]
          );
        }
      }

      // Commit transaction
      await client.query("COMMIT");

      return { success: true, message: "Group details updated and logged successfully." };
    } catch (error) {
      // Rollback transaction on error
      await client.query("ROLLBACK");
      console.error("Error in updating group details:", error.message);
      throw error;
    }
  },
  toggleMemberStatus: async (values) => {
    try {
      await client.query(
        `
        UPDATE tbl_group_members SET is_active = TRUE 
        WHERE group_id = $1 AND user_id = $2
        `,
        [values.groupId, values.memberId]
      );
      return;
    } catch (error) {
      console.error("Error in updating group details:", error.message);
      throw error;
    }
  },
  setGroupBudget: async (values) => {
    try {
      await client.query(
        `
        UPDATE tbl_group_members SET budget = $1 
        WHERE group_id = $2 AND user_id = $3
        `,
        [values.budget, values.groupId, values.userId]
      );
      return;
    } catch (error) {
      console.error("Error in setting group budget:", error.message);
      throw error;
    }
  },
  getBudgetDetails: async (values) => {
    try {
      const query = `
        SELECT 
          COALESCE(gm.budget, 0) as budget,
          (
            SELECT COALESCE(SUM(em.amount), 0)
            FROM tbl_expense_members em
            JOIN tbl_expenses e ON em.expense_id = e.expense_id
            WHERE em.user_id = $1 
              AND e.group_id = $2 
              AND e.is_active = TRUE
          ) as total_spent
        FROM tbl_group_members gm
        WHERE gm.user_id = $1 AND gm.group_id = $2 AND gm.is_active = TRUE;
      `;
      const result = await client.query(query, [values.userId, values.groupId]);
      return result.rows[0] || { budget: 0, total_spent: 0 };
    } catch (error) {
      console.error("Error in getBudgetDetails model:", error.message);
      throw error;
    }
  },
};
