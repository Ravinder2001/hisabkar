-- ================= USERS =================
CREATE TABLE IF NOT EXISTS tbl_users (
  user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  avatar TEXT,
  role VARCHAR(10) NOT NULL DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  ai_message_count INT DEFAULT 0,
  last_ai_usage_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================= USER OPTIONS =================
CREATE TABLE IF NOT EXISTS tbl_user_options (
  option_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INT NOT NULL REFERENCES tbl_users(user_id) ON DELETE CASCADE,
  availibilty_status BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================= UPI =================
CREATE TABLE IF NOT EXISTS tbl_upi_address (
  upi_address_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INT NOT NULL REFERENCES tbl_users(user_id) ON DELETE CASCADE,
  upi_address VARCHAR(100) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================= GROUP TYPES =================
CREATE TABLE IF NOT EXISTS tbl_group_types (
  group_type_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  type_name VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================= GROUPS =================
CREATE TABLE IF NOT EXISTS tbl_groups (
  group_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  group_type_id INT NOT NULL REFERENCES tbl_group_types(group_type_id),
  admin_user INT NOT NULL REFERENCES tbl_users(user_id),
  code INT UNIQUE NOT NULL,
  group_name VARCHAR(255) NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  is_settled BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  deleted_on TIMESTAMP DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================= GROUP MEMBERS =================
CREATE TABLE IF NOT EXISTS tbl_group_members (
  member_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  group_id INT NOT NULL REFERENCES tbl_groups(group_id),
  user_id INT NOT NULL REFERENCES tbl_users(user_id),
  budget NUMERIC(10, 2) DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_group_user UNIQUE (group_id, user_id)
);

-- ================= EXPENSES =================
CREATE TABLE IF NOT EXISTS tbl_expenses (
  expense_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  group_id INT NOT NULL REFERENCES tbl_groups(group_id),
  expense_name VARCHAR(255) NOT NULL,
  description TEXT,
  amount NUMERIC(10, 2) NOT NULL,
  paid_by INT NOT NULL REFERENCES tbl_users(user_id),
  split_type VARCHAR(20) NOT NULL CHECK (split_type IN ('EQUAL', 'CUSTOM', 'PERCENTAGE')),
  expense_type VARCHAR(50) DEFAULT 'Others',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================= EXPENSE MEMBERS =================
CREATE TABLE IF NOT EXISTS tbl_expense_members (
  expense_member_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  expense_id INT NOT NULL REFERENCES tbl_expenses(expense_id),
  user_id INT NOT NULL REFERENCES tbl_users(user_id),
  amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================= CHATS (NEW) =================
CREATE TABLE IF NOT EXISTS tbl_chats (
  chat_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  group_id INT NOT NULL REFERENCES tbl_groups(group_id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES tbl_users(user_id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  expense_id INT REFERENCES tbl_expenses(expense_id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================= CHAT READ STATUS (NEW) =================
CREATE TABLE IF NOT EXISTS tbl_chat_read_status (
  user_id INT REFERENCES tbl_users(user_id),
  group_id INT REFERENCES tbl_groups(group_id),
  last_read_chat_id INT,
  PRIMARY KEY (user_id, group_id)
);

-- ================= GROUP LOGS =================
CREATE TABLE IF NOT EXISTS tbl_group_logs (
  log_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  group_id INT NOT NULL REFERENCES tbl_groups(group_id),
  expense_id INT,
  user_id INT NOT NULL REFERENCES tbl_users(user_id),
  action_type VARCHAR(15) NOT NULL CHECK (
    action_type IN (
      'EDIT', 'DELETE', 'SETTLED', 'UNSETTLED',
      'JOINED', 'LEFT', 'ADDED', 'REMOVED', 'EDIT_GROUP'
    )
  ),
  old_amount DECIMAL(10,2),
  new_amount DECIMAL(10,2),
  details JSONB DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================= PUSH SUBSCRIPTIONS =================
CREATE TABLE IF NOT EXISTS tbl_sw_subscriptions (
  subscription_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INT NOT NULL UNIQUE REFERENCES tbl_users(user_id),
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================= SUPPORT =================
CREATE TABLE IF NOT EXISTS tbl_support_categories (
  category_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category_name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tbl_bug_priorities (
  priority_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  priority_name VARCHAR(20) NOT NULL UNIQUE CHECK (
    priority_name IN ('Low', 'Medium', 'High', 'Critical')
  ),
  priority_value INT NOT NULL UNIQUE CHECK (priority_value BETWEEN 1 AND 4),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tbl_tickets (
  ticket_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ticket_type VARCHAR(20) NOT NULL CHECK (
    ticket_type IN ('SUPPORT', 'FEEDBACK', 'BUG')
  ),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  description TEXT NOT NULL,
  category_id INT,
  priority_id INT,
  status VARCHAR(20) NOT NULL DEFAULT 'OPEN' CHECK (
    status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')
  ),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  resolution_notes TEXT,

  CONSTRAINT fk_category FOREIGN KEY (category_id)
    REFERENCES tbl_support_categories(category_id) ON DELETE SET NULL,

  CONSTRAINT fk_priority FOREIGN KEY (priority_id)
    REFERENCES tbl_bug_priorities(priority_id) ON DELETE SET NULL,

  CONSTRAINT valid_fields CHECK (
    (ticket_type = 'SUPPORT' AND category_id IS NOT NULL) OR
    (ticket_type = 'BUG' AND priority_id IS NOT NULL) OR
    (ticket_type = 'FEEDBACK')
  )
);

-- ================= STORED PROCEDURES =================
-- SP to add an expense on a previous date
CREATE OR REPLACE PROCEDURE sp_add_past_expense(
    p_group_id INT,
    p_expense_name VARCHAR(255),
    p_amount NUMERIC(10,2),
    p_paid_by INT,
    p_expense_date TIMESTAMP,
    p_members JSONB
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_expense_id INT;
    v_member_id INT;
    v_split_amount NUMERIC(10,2);
    v_member_count INT;
BEGIN
    -- Calculate equal split amount
    v_member_count := jsonb_array_length(p_members);
    IF v_member_count = 0 THEN
        RAISE EXCEPTION 'Members array cannot be empty';
    END IF;
    
    v_split_amount := ROUND(p_amount / v_member_count, 2);

    -- 1. Insert into tbl_expenses
    INSERT INTO tbl_expenses (
        group_id, expense_name, description, amount, paid_by, split_type, expense_type, created_at
    ) VALUES (
        p_group_id, p_expense_name, 'Past expense added via SP', p_amount, p_paid_by, 'EQUAL', 'Others', p_expense_date
    ) RETURNING expense_id INTO v_expense_id;

    -- 2. Insert into tbl_expense_members
    FOR v_member_id IN SELECT jsonb_array_elements_text(p_members)::INT
    LOOP
        INSERT INTO tbl_expense_members (
            expense_id, user_id, amount, created_at
        ) VALUES (
            v_expense_id, v_member_id, v_split_amount, p_expense_date
        );
    END LOOP;

    -- 3. Update tbl_groups total_amount
    UPDATE tbl_groups
    SET total_amount = total_amount + p_amount
    WHERE group_id = p_group_id;

    -- 4. Log the expense addition in tbl_group_logs
    INSERT INTO tbl_group_logs (
        group_id, expense_id, user_id, action_type, old_amount, new_amount, created_at
    ) VALUES (
        p_group_id, v_expense_id, p_paid_by, 'ADDED', NULL, p_amount, p_expense_date
    );

END;
$$;