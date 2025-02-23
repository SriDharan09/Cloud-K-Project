import { Skeleton, Avatar, Card, Button, Switch } from "antd";
import { UploadOutlined, EditOutlined, LockOutlined } from "@ant-design/icons";

const ProfileSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto mt-18 p-8 bg-white rounded-lg shadow-lg space-y-8">
      {/* Profile Picture & Username */}
      <div className="flex flex-col items-center pb-6">
        <Skeleton.Avatar size={120} active />
        <Skeleton.Input style={{ width: 150, marginTop: 16 }} active />
        <Skeleton.Button style={{ marginTop: 12 }} active />
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 gap-6">
        <Card title={<Skeleton.Input style={{ width: 100 }} active />} className="shadow">
          <Skeleton paragraph={{ rows: 2 }} active />
          <Skeleton.Button active />
        </Card>

        <Card title={<Skeleton.Input style={{ width: 100 }} active />} className="shadow">
          <Skeleton paragraph={{ rows: 2 }} active />
          <Skeleton.Button active />
        </Card>

        <Card title={<Skeleton.Input style={{ width: 100 }} active />} className="shadow">
          <Skeleton paragraph={{ rows: 1 }} active />
          <Skeleton.Button active />
        </Card>

        <Card title={<Skeleton.Input style={{ width: 100 }} active />} className="shadow">
          <Skeleton paragraph={{ rows: 2 }} active />
          <Skeleton.Button active />
        </Card>
      </div>
    </div>
  );
};

export default ProfileSkeleton;