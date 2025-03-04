import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderHistory } from "../../redux/slice/orderHistorySlice";
import {
  Card,
  Collapse,
  Tag,
  Divider,
  List,
  Avatar,
  Steps,
  Select,
  Image,
} from "antd";
import {
  ShoppingCartOutlined,
  HomeOutlined,
  UserOutlined,
  CreditCardOutlined,
  DashboardOutlined,
} from "@ant-design/icons";

const { Panel } = Collapse;
const { Step } = Steps;
const { Option } = Select;

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orderHistory);
  const [activeOrder, setActiveOrder] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchOrderHistory());
  }, [dispatch]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl font-semibold text-blue-500">
          Loading order history...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 mt-6">
        <p>Error: {error}</p>
      </div>
    );

  // Filter orders based on status
  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  // Overall Stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const completedOrders = totalOrders - pendingOrders;
  const totalSpent = orders.reduce(
    (sum, order) => sum + order.snapshot.paymentDetails.totalPrice,
    0
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="shadow-md border-l-4 border-blue-500">
          <h3 className="font-semibold flex items-center">
            <DashboardOutlined className="mr-2 text-blue-500" /> Total Orders
          </h3>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </Card>
        <Card className="shadow-md border-l-4 border-orange-500">
          <h3 className="font-semibold flex items-center">
            <ShoppingCartOutlined className="mr-2 text-orange-500" /> Pending
            Orders
          </h3>
          <p className="text-2xl font-bold">{pendingOrders}</p>
        </Card>
        <Card className="shadow-md border-l-4 border-green-500">
          <h3 className="font-semibold flex items-center">
            <ShoppingCartOutlined className="mr-2 text-green-500" /> Completed
            Orders
          </h3>
          <p className="text-2xl font-bold">{completedOrders}</p>
        </Card>
        <Card className="shadow-md border-l-4 border-red-500">
          <h3 className="font-semibold flex items-center">
            <CreditCardOutlined className="mr-2 text-red-500" /> Total Spent
          </h3>
          <p className="text-2xl font-bold">₹{totalSpent}</p>
        </Card>
      </div>

      {/* Filter Dropdown */}
      <div className="flex justify-end mb-4">
        <Select
          value={filter}
          onChange={setFilter}
          className="w-40"
          size="large"
          options={[
            { value: "all", label: "All Orders" },
            { value: "pending", label: "Pending Orders" },
            { value: "completed", label: "Completed Orders" },
          ]}
        />
      </div>

      {/* Order List */}
      <Collapse
        accordion
        className="bg-white shadow-md rounded-lg"
        onChange={(key) => setActiveOrder(key)}
      >
        {filteredOrders.map((order) => (
          <Panel
            key={order.orderId}
            header={
              <div
                className={`flex justify-between items-center p-2 rounded-lg ${
                  activeOrder == order.orderId
                    ? "bg-blue-100 border-l-4 border-blue-500"
                    : ""
                }`}
              >
                <span className="font-semibold text-lg">
                  <ShoppingCartOutlined className="mr-2 text-blue-500" />
                  Order ID: {order.orderId}
                </span>
                <Tag color={order.status === "pending" ? "orange" : "green"}>
                  {order.status}
                </Tag>
              </div>
            }
          >
            {/* Order Progress (Timeline) */}
            <Card className="mb-4 shadow-md rounded-lg">
              <Steps current={order.status === "pending" ? 0 : 2} size="small">
                <Step title="Order Placed" />
                <Step title="Processing" />
                <Step title="Delivered" />
              </Steps>
            </Card>

            {/* Ordered Items */}
            <Card className="mb-4 shadow-md border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold">
                <ShoppingCartOutlined className="mr-2 text-blue-500" /> Ordered
                Items
              </h3>
              <Divider />
              <List
                itemLayout="horizontal"
                dataSource={order.snapshot.items}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Image
                          width={40} 
                          src={item.menuImage}
                          preview={{ mask: "👁" }} 
                        />
                      }
                      title={
                        <span className="font-medium">
                          {item.quantity} × {item.name}
                        </span>
                      }
                      description={
                        <span className="text-gray-600">₹{item.total}</span>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>

            {/* Branch Details */}
            <Card className="mb-4 shadow-md border-l-4 border-green-500">
              <h3 className="text-lg font-semibold">
                <HomeOutlined className="mr-2 text-green-500" /> Resturant
                Details
              </h3>
              <Divider />
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Image
                      width={40} 
                      src={order.snapshot.branchDetails.branchImage}
                      preview={{ mask: "👁" }} 
                    />
                  }
                  title={
                    <span className="font-semibold">
                      {order.snapshot.branchDetails.branchName}
                    </span>
                  }
                  description={
                    <span className="text-gray-600">
                      {order.snapshot.branchDetails.branchAddress}
                    </span>
                  }
                />
              </List.Item>
            </Card>

            {/* Payment Details */}
            <Card className="mb-4 shadow-md border-l-4 border-red-500">
              <h3 className="text-lg font-semibold">
                <CreditCardOutlined className="mr-2 text-red-500" /> Payment
                Details
              </h3>
              <Divider />
              <p>
                <strong>Total:</strong> ₹
                {order.snapshot.paymentDetails.totalPrice}
              </p>
              <p>
                <strong>Payment Method:</strong>{" "}
                <Tag color="blue">
                  {order.snapshot.paymentDetails.paymentMethod}
                </Tag>
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <Tag
                  color={
                    order.snapshot.paymentDetails.paymentStatus === "unpaid"
                      ? "red"
                      : "green"
                  }
                >
                  {order.snapshot.paymentDetails.paymentStatus}
                </Tag>
              </p>
              <p>
                Transaction Ref:{" "}
                {order.snapshot.paymentDetails.TxnReferenceNumber}
              </p>
            </Card>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default OrderHistory;
