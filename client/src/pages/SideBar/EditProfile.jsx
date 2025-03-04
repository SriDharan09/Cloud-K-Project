import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/ModalContext";
import ProfileSkeleton from "../../components/Skeleton/ProfileSkeleton";
import { useNotification } from "../../context/NotificationProvider";
import { useLoader } from "../../context/LoaderContext";
import {
  fetchUserProfile,
  updateProfileAsync,
  changePasswordAsync,
  uploadProfileImageAsync,
} from "../../redux/slice/profileSlice";
import { setUpdateUser } from "../../redux/slice/authSlice";
import {
  Avatar,
  Button,
  Card,
  Modal,
  Form,
  Input,
  Switch,
  Upload,
  message,
} from "antd";
import {
  EditOutlined,
  LockOutlined,
  UploadOutlined,
  SaveOutlined,
} from "@ant-design/icons";

const EditProfile = () => {
  const openNotification = useNotification();
  const { openModal } = useModal();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();
  const { user } = useSelector((state) => state.profile, shallowEqual);
  const isUserLogin = useSelector(
    (state) => state.auth.isUserLogin,
    shallowEqual
  );
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [editModal, setEditModal] = useState({ open: false, field: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    console.log("isUserLogin:", isUserLogin);

    if (!isUserLogin) {
      setTimeout(() => {
        openModal();
      }, 2000);

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 500);
    } else {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isUserLogin, navigate]);

  if (!isUserLogin) {
    return <ProfileSkeleton />;
  }
  const handleUpdateProfile = async (values) => {
    setLoading(true);

    // Transform address fields if they exist
    const updatedValues = { ...values };

    if (values.street || values.city || values.state || values.zip) {
      updatedValues.address = {
        street: values.street || user?.address?.street,
        city: values.city || user?.address?.city,
        state: values.state || user?.address?.state,
        zip: values.zip || user?.address?.zip,
      };

      // Remove individual address fields to avoid redundancy
      delete updatedValues.street;
      delete updatedValues.city;
      delete updatedValues.state;
      delete updatedValues.zip;
    }
    if (values.theme || values.notifications !== undefined) {
      updatedValues.preferences = {
        theme: values.theme || user?.preferences?.theme,
        notifications:
          values.notifications !== undefined
            ? values.notifications
            : user?.preferences?.notifications,
      };

      delete updatedValues.theme;
      delete updatedValues.notifications;
    }

    const response = await dispatch(updateProfileAsync(updatedValues));
    console.log("Update Profile Response:", response);

    setLoading(false);
    if (response.meta.requestStatus === "fulfilled") {
      dispatch(fetchUserProfile());
      dispatch(
        setUpdateUser({ username: response.payload.user.username })
      );
      openNotification(response.payload.status, response.payload.message, "");
      setEditModal({ open: false, field: "" });
    } else {
      message.error("Failed to update profile");
    }
  };

  const handlePasswordChange = async () => {
    try {
      const values = await passwordForm.validateFields();
      console.log("Validated Password values:", values);
      if (values.newPassword !== values.confirmPassword) {
        message.error("New passwords do not match");
        return;
      }
      setLoading(true);
      const response = await dispatch(
        changePasswordAsync({
          oldPassword: values.currentPassword,
          newPassword: values.newPassword,
        })
      );
      setLoading(false);
      if (response.meta.requestStatus === "fulfilled") {
        message.success("Password changed successfully");
        setEditModal({ open: false, field: "" });
        passwordForm.resetFields();
      } else {
        message.error("Failed to change password");
      }
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const handleUpload = async ({ file }) => {
    const response = await dispatch(uploadProfileImageAsync(file));
    showLoader();
    if (response.meta.requestStatus === "fulfilled") {
      console.log("Upload Response:", response);
      if (response.payload.status === 200) {
        dispatch(fetchUserProfile());
        dispatch(
          setUpdateUser({ profileImage: response.payload.profileImage })
        );
      }
      openNotification(response.payload.status, response.payload.message, "");
      hideLoader();
      message.success("Profile image updated");
    } else {
      hideLoader();
      message.error("Failed to upload image");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-lg space-y-8">
      {/* Profile & Username (Centered) */}
      <div className="flex flex-col items-center pb-6">
        <Avatar
          size={120}
          src={user?.profileImage}
          onClick={() => setIsModalOpen(true)}
          className="border border-gray-300 shadow-md"
        />
        <div className="mt-4">
          <Upload customRequest={handleUpload} showUploadList={false}>
            <Button type="primary" icon={<UploadOutlined />}>
              Change Profile Picture
            </Button>
          </Upload>
        </div>
        <h2 className="text-2xl font-semibold mt-2">{user?.username}</h2>
        <Modal
          open={isModalOpen}
          footer={null}
          onCancel={() => setIsModalOpen(false)}
          centered
          width=""
          className="custom-modal"
        >
          <div className="flex items-center justify-center overflow-auto">
            <img
              src={user?.profileImage}
              alt="Profile"
              className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg object-contain"
            />
          </div>
        </Modal>
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 gap-6">
        <Card title="General" className="shadow">
          <p className="mb-2">
            <strong>Email:</strong> {user?.email}
          </p>
          <p className="mb-2">
            <strong>Phone:</strong> {user?.phoneNumber}
          </p>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => setEditModal({ open: true, field: "general" })}
          >
            Edit
          </Button>
        </Card>

        <Card title="Address" className="shadow">
          <p>
            {user?.address?.street}, {user?.address?.city}
          </p>
          <p className="mb-4">
            {user?.address?.state}, {user?.address?.zip}
          </p>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => setEditModal({ open: true, field: "address" })}
          >
            Edit
          </Button>
        </Card>

        <Card title="Security" className="shadow">
          <p className="mb-3">Change your password</p>
          <Button
            type="primary"
            icon={<LockOutlined />}
            onClick={() => setEditModal({ open: true, field: "password" })}
          >
            Change Password
          </Button>
        </Card>

        <Card title="Preferences" className="shadow">
          <p className="mb-4">
            <strong>Dark Mode:</strong>{" "}
            <Switch checked={user?.preferences?.theme === "dark"} />
          </p>
          <p className="mb-4">
            <strong>Notifications:</strong>{" "}
            <Switch checked={user?.preferences?.notifications} />
          </p>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => setEditModal({ open: true, field: "preferences" })}
          >
            Edit Preferences
          </Button>
        </Card>
      </div>

      {/* Edit Modals */}
      <Modal
        title="Edit Profile"
        open={editModal.open}
        onCancel={() => setEditModal({ open: false, field: "" })}
        footer={null}
        className="bg-white"
      >
        {editModal.field === "general" && (
          <Form form={form} layout="vertical" onFinish={handleUpdateProfile}>
            <Form.Item
              label="Username"
              name="username"
              initialValue={user?.username}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              initialValue={user?.phoneNumber}
            >
              <Input />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
              block
            >
              Save Changes
            </Button>
          </Form>
        )}

        {editModal.field === "address" && (
          <Form form={form} layout="vertical" onFinish={handleUpdateProfile}>
            <Form.Item
              label="Street"
              name="street"
              initialValue={user?.address?.street}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="City"
              name="city"
              initialValue={user?.address?.city}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="State"
              name="state"
              initialValue={user?.address?.state}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Zip Code"
              name="zip"
              initialValue={user?.address?.zip}
            >
              <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Save Address
            </Button>
          </Form>
        )}

        {editModal.field === "password" && (
          <Form form={passwordForm} layout="vertical">
            <Form.Item
              label="Current Password"
              name="currentPassword"
              rules={[
                { required: true, message: "Current password is required" },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[{ required: true, message: "New password is required" }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="Confirm New Password"
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Confirm new password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Button
              type="primary"
              onClick={handlePasswordChange}
              loading={loading}
              block
            >
              Change Password
            </Button>
          </Form>
        )}

        {editModal.field === "preferences" && (
          <Form form={form} layout="vertical" onFinish={handleUpdateProfile}>
            <Form.Item
              label="Dark Mode"
              name="theme"
              initialValue={user?.preferences?.theme}
            >
              <Switch
                checked={form.getFieldValue("theme") === "dark"}
                onChange={
                  (checked) =>
                    form.setFieldsValue({ theme: checked ? "dark" : "light" }) // Convert boolean to string
                }
              />
            </Form.Item>
            <Form.Item
              label="Notifications"
              name="notifications"
              valuePropName="checked"
              initialValue={user?.preferences?.notifications}
            >
              <Switch />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Save Preferences
            </Button>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default EditProfile;
