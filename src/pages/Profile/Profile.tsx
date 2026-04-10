import type React from "react";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import UserAvatar from "../../components/Atoms/UserAvatar/UserAvatar";
import CustomToggle from "../../components/Atoms/CustomToggle/CustomToggle";
import useApiFetch from "../../hooks/useAPIFetch";
import CONSTANTS from "../../utils/constant/Constant";
import ButtonComponent from "../../components/Atoms/ButtonComponent/ButtonComponent";
import showToast from "../../utils/helpers/toastHelper";
import { useDispatch } from "react-redux";
import { setUserProfileData } from "../../store/features/userSlice";
import { formatDateTime } from "../../utils/helpers/commanHelper";
import CustomCircularLoading from "../../components/Atoms/CustomCircularLoading/CustomCircularLoading";
import { getSubscription, subscribeUser, unsubscribeUser } from "../../utils/helpers/serviceWorkerHelper";

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

  const { fetchData: fetchProfileDetails, response: profileRes, isLoading: profileLoading } = useApiFetch(CONSTANTS.API_ROUTES.PROFILE_DETAILS);
  const { fetchData: fetchNewAvatarList, response: avatarRes, isLoading: avatarListLoading } = useApiFetch("");
  const { fetchData: updateProfileRes, response: editProfileRes, isLoading } = useApiFetch("");

  const [formData, setFormData] = useState(initialData);
  const [avatarList, setAvatarList] = useState<string[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && (navigator as Navigator & { standalone?: boolean }).standalone);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only letters and spaces, remove anything else
    const sanitizedValue = value.replace(/[^a-zA-Z\s]/g, "");
    setFormData({ ...formData, name: sanitizedValue });
  };
  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, is_available: e.target.checked });
  };

  const handleAvatarChange = (newAvatar: string) => {
    setFormData({ ...formData, avatar: newAvatar });
  };

  const fetchAvatarList = () => {
    fetchNewAvatarList(CONSTANTS.API_ROUTES.GEN_NEW_AVATARS);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfileRes(CONSTANTS.API_ROUTES.UPDATE_PROFILE_DETAILS, {
      method: "PUT",
      data: {
        name: formData.name,
        avatar: formData.avatar,
        is_available: formData.is_available,
      },
    });
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
    }
  }, [profileRes]);
  useEffect(() => {
    if (avatarRes?.success == 1) {
      setAvatarList(avatarRes.data);
    }
  }, [avatarRes]);
  useEffect(() => {
    if (editProfileRes?.success == 1) {
      showToast("Profile Details edited succesfully", "success");
      dispatch(
        setUserProfileData({
          name: formData.name,
          avatar: formData.avatar,
        })
      );
    }
  }, [editProfileRes]);

  return (
    <form onSubmit={handleSubmit}>
      <Card className="max-w-2xl bg-white">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <UserAvatar userImage={formData.avatar} />
            <div className="cursor-pointer text-blue-500" onClick={fetchAvatarList}>
              Change Avatar
            </div>
            {avatarListLoading ? (
              <CustomCircularLoading />
            ) : avatarList.length ? (
              <div className="flex justify-around p-4 gap-5">
                {avatarList.map((avatar, index) => (
                  <UserAvatar userImage={avatar} key={index} onClick={handleAvatarChange} />
                ))}
              </div>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={formData.name} onChange={handleNameChange} maxLength={20} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" className="cursor-not-allowed" value={formData.email} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" className="cursor-not-allowed" value={formData.role} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="created_at">Member Since</Label>
            <Input id="created_at" className="cursor-not-allowed" value={formatDateTime(formData.created_at)} disabled />
          </div>
          <div className="flex items-center space-x-2">
            <CustomToggle checked={formData.is_available} onChange={handleToggle} />
            <Label htmlFor="is_available">Available</Label>
          </div>
          <hr className="my-4 border-gray-100" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Push Notifications</Label>
                <p className="text-sm text-gray-500">Receive alerts for new expenses and updates.</p>
              </div>
              <div className="flex items-center">
                {notificationLoading && <CustomCircularLoading />}
                <CustomToggle checked={isSubscribed} onChange={handleNotificationToggle} disabled={notificationLoading} />
              </div>
            </div>
            {isIOS && !isStandalone && (
              <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
                <strong>Note:</strong> On iOS, you must add &quot;Hisabkar&quot; to your <strong>Home Screen</strong> to receive notifications. Tap
                the <strong>Share</strong> icon and select <strong>&quot;Add to Home Screen&quot;</strong>.
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>{profileLoading ? null : <ButtonComponent text="Submit" isLoading={isLoading} />}</CardFooter>
      </Card>
    </form>
  );
}
