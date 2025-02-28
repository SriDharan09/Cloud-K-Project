import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Card, Typography, Select, Image, Row, Col, Rate } from "antd";
import BreadcrumbNav from "./BreadcrumbNav";
import MenuItemCard from "./MenuItemCard"; // Import MenuItemCard

const { Title, Paragraph } = Typography;

const BranchDetails = () => {
  const { branchSlug } = useParams();
  const [sortOrder, setSortOrder] = useState("name");

  const branches = useSelector((state) => state.branch.branchDetails.branches);
  const menuItems = useSelector((state) => state.menu.menuDetails.menuItems);

  if (!branches || branches.length === 0) return <p>Loading...</p>;

  const branchId = Number(branchSlug.split("-").pop()); // Extract ID
  const branch = branches.find((b) => b.id === branchId);
  if (!branch) return <p className="text-gray-500">Branch not found</p>;

  // Filter menu items for this branch
  let branchMenu = menuItems.filter((item) => item.BranchId === branchId);

  // Sort menu based on selection
  if (sortOrder === "price") {
    branchMenu.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "popularity") {
    branchMenu.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="p-6">
      <BreadcrumbNav />

      {/* Branch Info */}
      <Card className="shadow-md p-4">
        <Row gutter={24} align="middle">
          <Col xs={24} md={8}>
            <Image src={branch.mainImage} alt={branch.name} className="rounded-lg" width={400} height={200} />
          </Col>
          <Col xs={24} md={16}>
            <Title level={2}>{branch.name}</Title>
            <Paragraph>{branch.address}</Paragraph>
            <Paragraph strong>Delivery Time: {branch.deliveryTime} mins</Paragraph>
            <Rate  disabled allowHalf defaultValue={branch.rating || 4.5} />
          </Col>
        </Row>
      </Card>

      {/* Sorting */}
      <div className="mt-6 flex items-center gap-4">
        <Title level={4}>Sort By:</Title>
        <Select defaultValue="name" onChange={(value) => setSortOrder(value)} style={{ width: 150 }}>
          <Select.Option value="name">Name</Select.Option>
          <Select.Option value="price">Price</Select.Option>
          <Select.Option value="popularity">Popularity</Select.Option>
        </Select>
      </div>

      {/* Menu Items */}
      <Title level={3} className="mt-6">Menu</Title>
      <div className="flex flex-col gap-4 mt-4 px-70">
        {branchMenu.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default BranchDetails;
