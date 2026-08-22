import React, { useState, useRef, useEffect } from "react";
import { Plus, X } from "lucide-react";
import styles from "./CreateGroupForm.module.css";

interface CreateGroupFormProps {
  onSubmit: (name: string, members: string[]) => void;
  onCancel: () => void;
}

export default function CreateGroupForm({ onSubmit, onCancel }: CreateGroupFormProps) {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([""]);
  const memberRefs = useRef<Array<HTMLInputElement | null>>([]);
  const groupNameRef = useRef<HTMLInputElement | null>(null);
  const isFirstRender = useRef(true);

  const addMember = () => {
    setMembers((prev) => [...prev, ""]);
  };

  // Focus the group name field on mount.
  useEffect(() => {
    groupNameRef.current?.focus();
  }, []);

  // Focus the last input whenever a new member is added (but not on mount).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const lastIndex = members.length - 1;
    memberRefs.current[lastIndex]?.focus();
  }, [members.length]);

  const updateMember = (index: number, value: string) => {
    const updated = [...members];
    updated[index] = value;
    setMembers(updated);
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // prevent form submit
      const value = members[index].trim();
      if (value) {
        if (index === members.length - 1) addMember();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName.trim() && members.some((m) => m.trim())) {
      onSubmit(
        groupName.trim(),
        members.filter((m) => m.trim())
      );
    }
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.heading}>Create New Group</h3>
      <form onSubmit={handleSubmit} className={styles.formBody}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="groupName">
            Group Name
          </label>
          <input
            id="groupName"
            type="text"
            ref={groupNameRef}
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className={styles.input}
            placeholder="Enter group name"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Members</label>
          <div className={styles.memberList}>
            {members.map((member, index) => (
              <div key={index} className={styles.memberRow}>
                <input
                  type="text"
                  value={member}
                  onChange={(e) => updateMember(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => {
                    memberRefs.current[index] = el;
                  }}
                  className={styles.input}
                  placeholder="Member name"
                />
                {members.length > 1 && (
                  <button type="button" onClick={() => removeMember(index)} className={styles.removeBtn} aria-label="Remove member">
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={addMember} className={styles.addMemberBtn}>
            <Plus size={14} />
            Add Member
          </button>
        </div>

        <div className={styles.actions}>
          <button type="submit" className="hk-btn-primary">
            Create Group
          </button>
          <button type="button" onClick={onCancel} className="hk-btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
