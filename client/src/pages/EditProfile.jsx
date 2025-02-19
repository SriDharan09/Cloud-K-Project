import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  updateProfileAsync,
  changePasswordAsync,
  uploadProfileImageAsync,
} from "../redux/slice/profileSlice";
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
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [editModal, setEditModal] = useState({ open: false, field: "" });

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const handleUpdateProfile = async (values) => {
    setLoading(true);
    const response = await dispatch(updateProfileAsync(values));
    setLoading(false);
    if (response.meta.requestStatus === "fulfilled") {
      message.success("Profile updated successfully");
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
    if (response.meta.requestStatus === "fulfilled") {
      message.success("Profile image updated");
    } else {
      message.error("Failed to upload image");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg space-y-8">
      {/* Profile & Username (Centered) */}
      <div className="flex flex-col items-center pb-6">
        <Avatar
          size={120}
          src={user?.profileImage}
          className="border border-gray-300 shadow-md"
        />
        <Upload customRequest={handleUpload} showUploadList={false}>
          <Button type="primary" icon={<UploadOutlined />}>
            Change Profile Picture
          </Button>
        </Upload>
        <h2 className="text-2xl font-semibold mt-2">{user?.username}</h2>
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 gap-6">
        <Card title="General" className="shadow">
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
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
          <p>
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
          <p>Change your password</p>
          <Button
            type="primary"
            icon={<LockOutlined />}
            onClick={() => setEditModal({ open: true, field: "password" })}
          >
            Change Password
          </Button>
        </Card>

        <Card title="Preferences" className="shadow">
          <p>
            <strong>Dark Mode:</strong>{" "}
            <Switch checked={user?.preferences?.theme === "dark"} />
          </p>
          <p>
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
      </Modal>
    </div>
  );
};

export default EditProfile;
