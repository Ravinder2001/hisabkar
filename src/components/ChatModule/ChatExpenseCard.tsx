import React, { useState } from "react";
import { Receipt, ChevronDown, ChevronUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import styles from "./ChatExpenseCard.module.css";
import CustomCountUp from "../CustomCountUp/CustomCountUp";

interface ExpenseMember {
  name: string;
  amount: number;
  avatar: string;
}

interface ChatExpenseCardProps {
  name: string;
  amount: number;
  date: string;
  icon: string;
  category: string;
  members: ExpenseMember[];
  isMe?: boolean;
}

const ChatExpenseCard: React.FC<ChatExpenseCardProps> = ({ name, amount, date, icon, category, members, isMe }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`${styles.cardContainer} ${isMe ? styles.myCardContainer : ""}`}>
      <div className={styles.cardHeader}>
        <div className={styles.iconBox}>
          {icon ? <img src={icon} alt={category} className="w-4 h-4" /> : <Receipt size={16} />}
        </div>
        <div className={styles.titleBox}>
          <h4 className={styles.expenseName}>{name}</h4>
          <span className={styles.expenseDate}>{new Date(date).toLocaleDateString()}</span>
        </div>
        <div className={styles.amountBox}>
          <span className={styles.currency}>₹</span>
          <span className={styles.amount}>
            <CustomCountUp count={Number(amount)} />
          </span>
        </div>
      </div>

      {members && members.length > 0 && (
        <div className={styles.detailsSection}>
          <button className={styles.expandButton} onClick={() => setIsExpanded(!isExpanded)}>
            <span>Split between {members.length} people</span>
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {isExpanded && (
            <div className={styles.membersList}>
              {members.map((member, idx) => (
                <div key={idx} className={styles.memberRow}>
                  <div className={styles.memberInfo}>
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback style={{ background: "var(--hk-avatar-1)", color: "#fff", fontSize: "9px" }}>
                        {member.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className={styles.memberName}>{member.name.split(" ")[0]}</span>
                  </div>
                  <span className={styles.memberAmount}>₹{Number(member.amount).toFixed(0)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatExpenseCard;
