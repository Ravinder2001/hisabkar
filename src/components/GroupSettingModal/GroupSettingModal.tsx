import React, { useState, useCallback, useEffect, Dispatch, SetStateAction } from "react";
import ModalComponent from "../ModalComponent/ModalComponent";
import styles from "./style.module.css";
import { Input } from "../ui/input";
import CustomSelect from "../CustomSelect/CustomSelect";
import { GroupDataType, MemberType, OptionType } from "../../utils/comman/CommanTypes";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Button } from "../ui/button";
import useApiFetch from "../../hooks/useAPIFetch";
import CONSTANTS from "../../utils/constant/Constant";
import showToast from "../../utils/helpers/toastHelper";
import CustomCircularLoading from "../Atoms/CustomCircularLoading/CustomCircularLoading";

type PropsType = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  data: GroupDataType;
  membersList: MemberType;
  groupId: string;
  callbackFunc: () => void;
};

type FormData = {
  group_name: string;
  group_type_id: string;
  members: MemberType;
  deletedMemberIds: string[];
};

function GroupSettingModal({ isOpen, setIsOpen, data, membersList, groupId, callbackFunc }: PropsType) {
  const groupTypeList = useSelector((state: RootState) => state.data.groupTypeList);

  const { fetchData: editGroupSetting, response, isLoading } = useApiFetch("");
  const { fetchData: toggleMemberStatus, response: toggleMemberRes, isLoading: isToggling } = useApiFetch("");

  const [formData, setFormData] = useState<FormData>({
    group_name: data.group_name,
    group_type_id: data.group_type_id,
    members: [...membersList],
    deletedMemberIds: [],
  });

  const [toggledMemberId, setToggledMemberId] = useState<string | null>(null);

  const [errors, setErrors] = useState<{
    group_name?: string;
    group_type_id?: string;
    members?: string;
  }>({});

  const validateForm = useCallback(() => {
    const newErrors: typeof errors = {};

    if (!formData.group_name.trim()) {
      newErrors.group_name = "Group name is required";
    }

    if (!formData.group_type_id) {
      newErrors.group_type_id = "Please select a group type";
    }

    if (formData.members.length === 0) {
      newErrors.members = "At least one member is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = (field: keyof FormData) => (value: string | OptionType) => {
    setFormData((prev) => ({
      ...prev,
      [field]: typeof value === "object" && value !== null ? value.value : value,
    }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleDeleteMember = (memberId: string) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((member) => member.id !== memberId),
      deletedMemberIds: [...prev.deletedMemberIds, memberId],
    }));
  };

  const handleToggleMember = async (memberId: string, currentStatus: boolean) => {
    if (currentStatus) return; // Prevent disabling if already enabled

    setToggledMemberId(memberId); // Store the member ID being toggled
    await toggleMemberStatus(`${CONSTANTS.API_ROUTES.TOGGLE_MEMBER_STATUS}/${groupId}/${memberId}`, {
      method: "PUT",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await editGroupSetting(`${CONSTANTS.API_ROUTES.GROUP_SETTINGS}/${groupId}`, {
        method: "PUT",
        data: {
          groupName: formData.group_name,
          groupTypeId: formData.group_type_id,
          removedMembers: formData.deletedMemberIds,
        },
      });
    }
  };

  const selectedOption = groupTypeList.find((type) => type.id === formData.group_type_id);

  useEffect(() => {
    if (response?.success === 1) {
      setIsOpen(false);
      showToast("Group details updated successfully", "success");
      callbackFunc();
    }
  }, [response]);

  useEffect(() => {
    if (toggleMemberRes?.success === 1 && toggledMemberId) {
      setFormData((prev) => ({
        ...prev,
        members: prev.members.map((member) => (member.id === toggledMemberId ? { ...member, is_current_user: true } : member)),
      }));
      showToast("Member status updated successfully", "success");
      setToggledMemberId(null); // Reset after successful toggle
    }
  }, [toggleMemberRes, toggledMemberId]);

  return (
    <ModalComponent isOpen={isOpen} setIsOpen={setIsOpen}>
      <form onSubmit={handleSubmit} className={styles.container}>
        <div className="text-md font-bold">Group Details</div>
        <div className={styles.fieldBox}>
          <label className="text-sm font-medium">Group Name</label>
          <Input
            value={formData.group_name}
            onChange={(e) => handleInputChange("group_name")(e.target.value)}
            className={`border-[#e5e7eb] rounded-lg ${errors.group_name ? "border-red-500" : ""}`}
            placeholder="Enter group name"
          />
          {errors.group_name && <p className="text-red-500 text-xs mt-1">{errors.group_name}</p>}
        </div>

        <div className={styles.fieldBox}>
          <label className="text-sm font-medium">Group Type</label>
          <CustomSelect
            value={selectedOption ? { value: selectedOption.id, label: selectedOption.name } : null}
            options={groupTypeList.map((type) => ({
              value: type.id,
              label: type.name,
            }))}
            onChange={(option: OptionType) => handleInputChange("group_type_id")(option)}
            placeholder="Select group type"
          />
          {errors.group_type_id && <p className="text-red-500 text-xs mt-1">{errors.group_type_id}</p>}
        </div>

        <div className={styles.fieldBox}>
          <label className="text-sm font-medium">Current Members</label>
          {errors.members && <p className="text-red-500 text-xs mb-2">{errors.members}</p>}
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {formData.members
              .filter((member) => member.is_current_user)
              .map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-md border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                      <img src={member.avatar || "/placeholder.svg"} alt={member.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="max-w-full sm:max-w-none overflow-hidden">
                      <p className="font-medium truncate">{member.name}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteMember(member.id)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label={`Remove ${member.name}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="px-4 py-2">
            Cancel
          </Button>
          <Button type="submit" className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700">
            {isLoading ? <CustomCircularLoading /> : "Save Changes"}
          </Button>
        </div>
        {formData.members.filter((member) => !member.is_current_user).length ? (
          <div className={styles.fieldBox}>
            <label className="text-sm font-medium">Inactive Members</label>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {formData.members
                .filter((member) => !member.is_current_user)
                .map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 rounded-md border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                        <img src={member.avatar || "/placeholder.svg"} alt={member.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="max-w-full sm:max-w-none overflow-hidden">
                        <p className="font-medium truncate">{member.name}</p>
                      </div>
                    </div>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={member.is_current_user || false}
                        onChange={() => handleToggleMember(member.id, member.is_current_user || false)}
                        disabled={member.is_current_user || (isToggling && toggledMemberId === member.id)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                ))}
            </div>
          </div>
        ) : null}
      </form>
    </ModalComponent>
  );
}

export default GroupSettingModal;
