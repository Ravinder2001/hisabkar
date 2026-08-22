import React, { useEffect, useState } from "react";
import ModalComponent from "../ModalComponent/ModalComponent";
import styles from "./style.module.css";
import CustomCircularLoading from "../Atoms/CustomCircularLoading/CustomCircularLoading";
import { Search, Plus, X } from "lucide-react";
import useApiFetch from "../../hooks/useAPIFetch";
import CONSTANTS from "../../utils/constant/Constant";
import showToast from "../../utils/helpers/toastHelper";

type PropsType = {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  callBackFunc: () => void;
};

type UserType = {
  user_id: string;
  name: string;
  avatar: string;
  email: string;
};

// Email validation regex
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Simple debounce function
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

function AddMemberModal(props: PropsType) {
  const { fetchData: fetchFriendsList, response: friendsRes } = useApiFetch(CONSTANTS.API_ROUTES.FRIENDS_LIT + "/" + props.groupId);
  const { fetchData: searchFriends, response: searchRes } = useApiFetch(""); // Empty initial URL for search requests
  const { fetchData: addMember, response: addMemberRes, isLoading: addMemberLoading } = useApiFetch("");

  const [users, setUsers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms debounce delay
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);

  // Initial fetch of friends list when modal opens
  useEffect(() => {
    if (props.isOpen) {
      fetchFriendsList();
    }
  }, [props.isOpen]);

  // Handle response from initial friends list fetch
  useEffect(() => {
    if (friendsRes?.success == 1) {
      setUsers(friendsRes.data);
      setFilteredUsers(friendsRes.data);
    }
  }, [friendsRes]);

  // Handle search results response
  useEffect(() => {
    if (searchRes?.success == 1) {
      setFilteredUsers(searchRes.data);
    }
  }, [searchRes]);

  // Handle add member response
  useEffect(() => {
    if (addMemberRes?.success == 1) {
      showToast("Members added successfully", "success");
      props.callBackFunc();
    }
  }, [addMemberRes]);

  // Handle debounced search term changes
  useEffect(() => {
    // For empty search or invalid email, filter the already fetched users locally
    if (!debouncedSearchTerm || !isValidEmail(debouncedSearchTerm)) {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || user.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
    // For valid email, make an API call
    else if (isValidEmail(debouncedSearchTerm)) {
      const searchUrl = `${CONSTANTS.API_ROUTES.FRIENDS_LIT}/${props.groupId}?search=${debouncedSearchTerm}`;
      searchFriends(searchUrl);
    }
  }, [debouncedSearchTerm, props.groupId, users]);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

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
              placeholder="Search by name or email. Enter full email for precise search."
              className={styles.searchInput}
              value={searchTerm}
              onChange={handleSearchChange}
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
          <button type="button" className={`hk-btn-primary ${styles.submitBtn}`} onClick={handleSubmit} disabled={addMemberLoading}>
            {addMemberLoading ? <CustomCircularLoading /> : "Add Members"}
          </button>
        </div>
      </div>
    </ModalComponent>
  );
}

export default AddMemberModal;
