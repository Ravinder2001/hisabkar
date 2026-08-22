import type React from "react";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import UserAvatar from "../../components/Atoms/UserAvatar/UserAvatar";
import CustomToggle from "../../components/Atoms/CustomToggle/CustomToggle";
import useApiFetch from "../../hooks/useAPIFetch";
import CONSTANTS from "../../utils/constant/Constant";
import showToast from "../../utils/helpers/toastHelper";
import { useDispatch } from "react-redux";
import { setUserProfileData } from "../../store/features/userSlice";
import { formatMembershipDuration } from "../../utils/helpers/commanHelper";
import CustomCircularLoading from "../../components/Atoms/CustomCircularLoading/CustomCircularLoading";
import { getSubscription, subscribeUser, unsubscribeUser } from "../../utils/helpers/serviceWorkerHelper";
import styles from "./style.module.css";

const initialData = {
  email: "",
  name: "",
  avatar: "",
  created_at: "",
  role: "",
  is_available: false,
};

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { fetchData: fetchProfileDetails, response: profileRes } = useApiFetch(CONSTANTS.API_ROUTES.PROFILE_DETAILS);
  const { fetchData: fetchNewAvatarList, response: avatarRes, isLoading: avatarListLoading } = useApiFetch("");
  const { fetchData: updateProfileRes, response: editProfileRes } = useApiFetch("");

  const [formData, setFormData] = useState(initialData);
  const [avatarList, setAvatarList] = useState<string[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);

  const savedNameRef = useRef("");

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && (navigator as Navigator & { standalone?: boolean }).standalone);

  const saveProfile = (overrides: Partial<typeof formData>) => {
    const payload = { ...formData, ...overrides };
    updateProfileRes(CONSTANTS.API_ROUTES.UPDATE_PROFILE_DETAILS, {
      method: "PUT",
      data: {
        name: payload.name,
        avatar: payload.avatar,
        is_available: payload.is_available,
      },
    });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only letters and spaces, remove anything else
    const sanitizedValue = value.replace(/[^a-zA-Z\s]/g, "");
    setFormData({ ...formData, name: sanitizedValue });
  };

  const handleNameBlur = () => {
    const trimmedName = formData.name.trim();
    if (!trimmedName || trimmedName === savedNameRef.current) return;
    savedNameRef.current = trimmedName;
    setFormData((prev) => ({ ...prev, name: trimmedName }));
    saveProfile({ name: trimmedName });
  };

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isAvailable = e.target.checked;
    setFormData({ ...formData, is_available: isAvailable });
    saveProfile({ is_available: isAvailable });
  };

  const handleAvatarChange = (newAvatar: string) => {
    setFormData({ ...formData, avatar: newAvatar });
    saveProfile({ avatar: newAvatar });
  };

  const fetchAvatarList = () => {
    fetchNewAvatarList(CONSTANTS.API_ROUTES.GEN_NEW_AVATARS);
  };

  const handleBack = () => {
    if (window.history.length > 2) navigate(-1);
    else navigate(CONSTANTS.PROJECT_ROUTES.HOME);
  };

  useEffect(() => {
    fetchProfileDetails();
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    const sub = await getSubscription();
    setIsSubscribed(!!sub);
  };

  const handleNotificationToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationLoading(true);
    try {
      if (e.target.checked) {
        if (isIOS && !isStandalone) {
          showToast("To enable notifications on iOS, please add this app to your Home Screen first.", "info");
          return;
        }
        const sub = await subscribeUser();
        if (sub) {
          setIsSubscribed(true);
          showToast("Notifications enabled successfully!", "success");
        }
      } else {
        const result = await unsubscribeUser();
        if (result) {
          setIsSubscribed(false);
          showToast("Notifications disabled.", "info");
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Notification permission error:", error);
      showToast("Could not change notification settings. Please check your browser permissions.", "error");
    } finally {
      setNotificationLoading(false);
    }
  };

  useEffect(() => {
    if (profileRes?.success == 1) {
      setFormData(profileRes.data);
      savedNameRef.current = profileRes.data.name;
    }
  }, [profileRes]);
  useEffect(() => {
    if (avatarRes?.success == 1) {
      setAvatarList(avatarRes.data);
    }
  }, [avatarRes]);
  useEffect(() => {
    if (editProfileRes?.success == 1) {
      showToast("Profile updated", "success");
      dispatch(
        setUserProfileData({
          name: formData.name,
          avatar: formData.avatar,
        })
      );
    }
  }, [editProfileRes]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button type="button" className="hk-icon-btn" onClick={handleBack} aria-label="Go back">
          <ArrowLeft size={18} />
        </button>
        <h1 className={styles.title}>Profile</h1>
      </div>

      <div className={styles.card}>
        <div className={`${styles.row} ${styles.identityRow}`}>
          <div className={styles.avatarWrap}>
            <UserAvatar userImage={formData.avatar} />
            <div className={styles.changeAvatar} onClick={fetchAvatarList}>
              {avatarListLoading ? <CustomCircularLoading /> : "Change"}
            </div>
            {avatarList.length ? (
              <div className={styles.avatarList}>
                {avatarList.map((avatar, index) => (
                  <UserAvatar userImage={avatar} key={index} onClick={handleAvatarChange} />
                ))}
              </div>
            ) : null}
          </div>
          <div className={styles.nameField}>
            <label className={styles.label} htmlFor="name">
              Name
            </label>
            <input id="name" className={styles.input} value={formData.name} onChange={handleNameChange} onBlur={handleNameBlur} maxLength={20} />
          </div>
        </div>

        <div className={`${styles.row} ${styles.availabilityRow}`}>
          <div>
            <div className={styles.availabilityText}>Available</div>
            <p className={styles.availabilitySub}>Let your groups know you&apos;re around to settle up.</p>
          </div>
          <CustomToggle checked={formData.is_available} onChange={handleToggle} />
        </div>

        <div className={styles.row}>
          <span className={styles.infoLabel}>Email</span>
          <span className={styles.infoValue}>{formData.email}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.infoLabel}>Role</span>
          <span className={styles.infoValue}>{formData.role}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.infoLabel}>Member Since</span>
          <span className={styles.infoValue}>{formData.created_at ? formatMembershipDuration(formData.created_at) : ""}</span>
        </div>

        <div className={styles.row}>
          <div>
            <div className={styles.notificationText}>Push Notifications</div>
            <p className={styles.notificationSub}>Receive alerts for new expenses and updates.</p>
          </div>
          <div className={styles.notificationToggleWrap}>
            {notificationLoading && <CustomCircularLoading />}
            <CustomToggle checked={isSubscribed} onChange={handleNotificationToggle} disabled={notificationLoading} />
          </div>
        </div>
        {isIOS && !isStandalone && (
          <div className={styles.iosNote}>
            <strong>Note:</strong> On iOS, you must add &quot;Hisabkar&quot; to your <strong>Home Screen</strong> to receive notifications. Tap the{" "}
            <strong>Share</strong> icon and select <strong>&quot;Add to Home Screen&quot;</strong>.
          </div>
        )}
      </div>
    </div>
  );
}
