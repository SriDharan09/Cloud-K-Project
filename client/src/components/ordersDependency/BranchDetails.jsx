import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import {
  Card,
  Typography,
  Image,
  Row,
  Col,
  Rate,
  Empty,
  Dropdown,
  Menu,
  Button,
  Divider,
  List,
  Descriptions,
  Space,
  Tag,
} from "antd";
import { FacebookOutlined, InstagramOutlined } from "@ant-design/icons";
import BreadcrumbNav from "./BreadcrumbNav";
import MenuItemCard from "./MenuItemCard";

const { Title, Paragraph } = Typography;

const BranchDetails = () => {
  const { branchSlug } = useParams();
  const [sortOrder, setSortOrder] = useState("name");
  const [filterType, setFilterType] = useState("all");

  const branches = useSelector((state) => state.branch.branchDetails.branches);
  const menuItems = useSelector((state) => state.menu.menuDetails.menuItems);

  if (!branches || branches.length === 0) return <p>Loading...</p>;

  const branchId = Number(branchSlug.split("-").pop());
  const branch = branches.find((b) => b.id === branchId);
  if (!branch) return <p className="text-gray-500">Branch not found</p>;

  let branchMenu = menuItems.filter((item) => item.BranchId === branchId);
  if (filterType === "veg") {
    branchMenu = branchMenu.filter((item) => item.isVeg);
  } else if (filterType === "non-veg") {
    branchMenu = branchMenu.filter((item) => !item.isVeg);
  }
  if (sortOrder === "price") {
    branchMenu.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "popularity") {
    branchMenu.sort((a, b) => b.rating - a.rating);
  }

  const menu = (
    <Menu>
      <Menu.ItemGroup title="Sort By">
        <Menu.Item onClick={() => setSortOrder("name")}>Name</Menu.Item>
        <Menu.Item onClick={() => setSortOrder("price")}>Price</Menu.Item>
        <Menu.Item onClick={() => setSortOrder("popularity")}>
          Popularity
        </Menu.Item>
      </Menu.ItemGroup>

      <Menu.ItemGroup title="Filter By Type">
        <Menu.Item onClick={() => setFilterType("all")}>All</Menu.Item>
        <Menu.Item onClick={() => setFilterType("veg")}>Veg</Menu.Item>
        <Menu.Item onClick={() => setFilterType("non-veg")}>Non-Veg</Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  );

  return (
    <div className="p-4 md:p-6">
      <BreadcrumbNav />

      {/* Branch Info */}
      <Card className="shadow-md p-4">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Image
              src={branch.mainImage}
              alt={branch.name}
              className="rounded-lg w-full h-auto"
              width={285}
              height={200}
              style={{ objectFit: "cover" }}
            />
          </Col>
          <Col xs={24} md={16} className="flex flex-col gap-2">
            <Title level={3} className="text-lg md:text-2xl">
              <div className="flex justify-between items-center">
                {branch.name}
                <Descriptions.Item
                  className="text-sm md:text-base "
                  label="Status"
                >
                  <Tag color={branch.status === "open" ? "green" : "red"}>
                    {branch.status.toUpperCase()}
                  </Tag>
                </Descriptions.Item>
              </div>
            </Title>

            <Paragraph className="text-sm md:text-base text-gray-500">
              {branch.tagline}
            </Paragraph>
            <Paragraph className="text-sm md:text-base">
              {branch.address}
            </Paragraph>
            <Paragraph strong className="text-sm md:text-base">
              Delivery Time: {branch.delivery_time}
            </Paragraph>
            <Rate
              disabled
              allowHalf
              defaultValue={branch.average_rating || 4.5}
            />
            <Paragraph className="text-gray-600 my-3">
              {branch.reviews_count} Reviews | Avg Cost for Two: ₹
              {branch.avg_cost_for_two}
            </Paragraph>
          </Col>
          <div className="flex flex-col ">
            <div>
              <Title level={5} className="mt-1">
                Connect with Us
              </Title>
              <Space>
                {branch.social_media?.facebook && (
                  <Button
                    type="link"
                    href={branch.social_media.facebook}
                    target="_blank"
                    icon={<FacebookOutlined />}
                  >
                    Facebook
                  </Button>
                )}
                {branch.social_media?.instagram && (
                  <Button
                    type="link"
                    href={branch.social_media.instagram}
                    target="_blank"
                    icon={<InstagramOutlined />}
                  >
                    Instagram
                  </Button>
                )}
              </Space>
              {/* <Row gutter={[16, 16]} className="mt-2">
                <Col xs={24} sm={12}>
                  <Title level={5}>Payment Methods</Title>
                  <Space wrap>
                    {JSON.parse(branch.payment_methods).map((method) => (
                      <Tag key={method} color="blue">
                        {method}
                      </Tag>
                    ))}
                  </Space>
                </Col>
                <Col xs={24} sm={12}>
                  <Title level={5}>Amenities</Title>
                  <Space wrap>
                    {JSON.parse(branch.amenities).map((amenity) => (
                      <Tag key={amenity} color="purple">
                        {amenity}
                      </Tag>
                    ))}
                  </Space>
                </Col>
              </Row> */}
            </div>
            <Title level={5} className="mt-4">
              Popular Dishes
            </Title>
            <List
              dataSource={JSON.parse(branch.popular_dishes)}
              renderItem={(dish) => <Tag color="orange">{dish}</Tag>}
              className="mb-4"
            />
          </div>
        </Row>
      </Card>

      {/* Sorting & Filtering */}
      <div className="mt-4 flex justify-end gap-4 items-center">
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button type="primary" size="small">
            Sort & Filter
          </Button>
        </Dropdown>
        <Divider type="vertical" />
        <Button
          type="default"
          size="small"
          onClick={() => setSortOrder("name")}
        >
          Reset
        </Button>
      </div>

      {/* Menu Items */}
      <Title level={3} className="mt-6 text-lg md:text-xl">
        Menu
      </Title>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {branchMenu.length > 0 ? (
          branchMenu.map((item) => <MenuItemCard key={item.id} item={item} />)
        ) : (
          <Empty className="my-6" description="No menu items available." />
        )}
      </div>
    </div>
  );
};

export default BranchDetails;
