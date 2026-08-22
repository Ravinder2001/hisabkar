import React, { useState } from "react";
import { Plus, Users, Trash2 } from "lucide-react";
import CreateGroupForm from "./CreateGroupForm";
import type { Group } from "../../pages/OpenExpenses/OpenExpenses";
import styles from "./GroupsView.module.css";

interface GroupsViewProps {
  groups: Group[];
  onSelectGroup: (group: Group) => void;
  onCreateGroup: (name: string, members: string[]) => void;
  onDeleteGroup: (groupId: string) => void;
}

export default function GroupsView({ groups, onSelectGroup, onCreateGroup, onDeleteGroup }: GroupsViewProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <span className={styles.subheading}>Your Groups</span>
        <button className="hk-btn-primary" onClick={() => setShowCreateForm(true)}>
          <Plus size={16} />
          Create Group
        </button>
      </div>

      {showCreateForm && (
        <CreateGroupForm
          onSubmit={(name, members) => {
            onCreateGroup(name, members);
            setShowCreateForm(false);
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {groups.length === 0 ? (
        <div className={`hk-card ${styles.emptyState}`}>
          <div className={styles.emptyIcon}>
            <Users size={26} />
          </div>
          <h3 className={styles.emptyTitle}>No groups yet</h3>
          <p className={styles.emptyDescription}>Create your first group to start tracking expenses</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {groups.map((group) => (
            <div key={group.id} className={`hk-card ${styles.card}`}>
              <div className={styles.cardTop}>
                <h3 className={styles.cardTitle}>{group.name}</h3>
                <button className={styles.deleteBtn} onClick={() => onDeleteGroup(group.id)} aria-label="Delete group">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className={styles.statsRow}>
                <span>
                  {group.members.length} member{group.members.length === 1 ? "" : "s"}
                </span>
                <span>·</span>
                <span>
                  {group.expenses.length} expense{group.expenses.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className={`hk-money ${styles.total}`}>₹{group.expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}</div>
              <button className={`hk-btn-secondary ${styles.viewBtn}`} onClick={() => onSelectGroup(group)}>
                View Group
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
