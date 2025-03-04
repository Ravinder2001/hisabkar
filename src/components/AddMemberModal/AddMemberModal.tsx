import React, { useEffect, useState } from "react";
import ModalComponent from "../ModalComponent/ModalComponent";
import styles from "./style.module.css";
import ButtonComponent from "../Atoms/ButtonComponent/ButtonComponent";
import { Search, Plus, X } from "lucide-react";
import useApiFetch from "../../hooks/useAPIFetch";
import CONSTANTS from "../../utils/constant/Constant";
import showToast from "../../utils/helpers/toastHelper";

type PropsType = {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
};

type UserType = {
  user_id: string;
  name: string;
  avatar: string;
  email: string;
};

function AddMemberModal(props: PropsType) {
  const { fetchData: fetchFriendsList, response: friendsRes } = useApiFetch(CONSTANTS.API_ROUTES.FRIENDS_LIT + "/" + props.groupId);
  const { fetchData: addMember, response: addMemberRes } = useApiFetch("");

  const [users, setUsers] = useState<UserType[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);

  const filteredUsers = users.filter(
    (user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUser = (user: UserType) => {
    if (!selectedUsers.some((selectedUser) => selectedUser.user_id === user.user_id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((user) => user.user_id !== userId));
  };

  const handleSubmit = async () => {
    if (!selectedUsers.length) return;
    await addMember(CONSTANTS.API_ROUTES.ADD_GROUP_MEMBERS + "/" + props.groupId, {
      method: "POST",
      data: {
        userIds: selectedUsers.map((user) => user.user_id),
      },
    });
  };

  useEffect(() => {
    fetchFriendsList();
  }, []);

  useEffect(() => {
    if (friendsRes?.success == 1) {
      setUsers(friendsRes.data);
    }
  }, [friendsRes]);

  useEffect(() => {
    if (addMemberRes?.success == 1) {
      showToast("Members added successfully", "success");
      props.onClose();
    }
  }, [addMemberRes]);

  return (
    <ModalComponent isOpen={props.isOpen} setIsOpen={props.onClose}>
      <div className={styles.container}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Add Team Members</h2>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.description}>Select team members to add to your project.</p>

          {/* Selected users section */}
          {selectedUsers.length > 0 && (
            <div className={styles.selectedUsers}>
              <h3 className={styles.sectionTitle}>Selected Members</h3>
              <div className={styles.userChips}>
                {selectedUsers.map((user) => (
                  <div key={user.user_id} className={styles.userChip}>
                    <img src={user.avatar || "/placeholder.svg"} alt={user.name} className={styles.chipAvatar} />
                    <span className={styles.chipName}>{user.name}</span>
                    <button className={styles.removeButton} onClick={() => handleRemoveUser(user.user_id)} aria-label={`Remove ${user.name}`}>
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search input */}
          <div className={styles.searchContainer}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by name or email"
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* User list */}
          <div className={styles.userList}>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user.user_id} className={styles.userItem} onClick={() => handleSelectUser(user)}>
                  <img src={user.avatar || "/placeholder.svg"} alt={user.name} className={styles.avatar} />
                  <div className={styles.userInfo}>
                    <div className={styles.userName}>{user.name}</div>
                    <div className={styles.userEmail}>{user.email}</div>
                  </div>
                  <button className={styles.addButton} aria-label={`Add ${user.name}`}>
                    <Plus size={18} />
                  </button>
                </div>
              ))
            ) : (
              <div className={styles.noResults}>No users found</div>
            )}
          </div>
        </div>

        <div className={styles.modalFooter}>
          <ButtonComponent text="Add Members" onClick={handleSubmit} />
        </div>
      </div>
    </ModalComponent>
  );
}

export default AddMemberModal;
