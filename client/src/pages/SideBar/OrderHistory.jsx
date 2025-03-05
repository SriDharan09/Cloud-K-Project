import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderHistory } from "../../redux/slice/orderHistorySlice";
import  OrderHistorySkeleton  from "../../components/Skeleton/OrderHistorySkeleton";
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
  Skeleton,
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

  if (loading) return <OrderHistorySkeleton />;

  if (error)
    return (
      <div className="text-center text-red-500 mt-6">
        <p>Error: {error}</p>
      </div>
    );

  // Filter orders based on status
  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    if (filter === "pending")
      return !["delivered", "cancelled"].includes(order.status);
    if (filter === "completed")
      return ["delivered", "cancelled"].includes(order.status);
    return order.status === filter;
  });

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => !["delivered", "completed", "cancelled"].includes(o.status)
  ).length;

  // Completed orders are those that are delivered or completed
  const completedOrders = orders.filter((o) =>
    ["delivered", "completed"].includes(o.status)
  ).length;

  // Calculate total spent
  const totalSpent = orders.reduce(
    (sum, order) => sum + (order.snapshot?.paymentDetails?.totalPrice || 0),
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
          <p className="text-xl font-bold">{totalOrders}</p>
        </Card>
        <Card className="shadow-md border-l-4 border-orange-500">
          <h3 className="font-semibold flex items-center">
            <ShoppingCartOutlined className="mr-2 text-orange-500" /> Pending
            Orders
          </h3>
          <p className="text-xl font-bold">{pendingOrders}</p>
        </Card>
        <Card className="shadow-md border-l-4 border-green-500">
          <h3 className="font-semibold flex items-center">
            <ShoppingCartOutlined className="mr-2 text-green-500" /> Completed
            Orders
          </h3>
          <p className="text-xl font-bold">{completedOrders}</p>
        </Card>
        <Card className="shadow-md border-l-4 border-red-500">
          <h3 className="font-semibold flex items-center">
            <CreditCardOutlined className="mr-2 text-red-500" /> Total Spent
          </h3>
          <p className="text-xl font-bold">₹{totalSpent}</p>
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
      <div className="max-w-3xl mx-auto w-full">
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
                  <span className="font-semibold text-sm lg:text-lg">
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
              <Card className="mb-4 shadow-md my-2! rounded-lg">
                <Steps
                  current={
                    order.status === "pending"
                      ? 0
                      : order.status === "preparing" ||
                        order.status === "on the way"
                      ? 1
                      : 2
                  }
                  size="small"
                >
                  <Step title="Order Placed" />
                  <Step title="Processing" />
                  <Step title="Delivered" />
                </Steps>
              </Card>

              {/* Ordered Items */}
              <Card className="mb-4 shadow-md border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold">
                  <ShoppingCartOutlined className="mr-2 text-blue-500" />{" "}
                  Ordered Items
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
                            size={28}
                            width={74}
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
              <Card className="mb-4 shadow-md border-l-4 my-2! border-green-500">
                <h3 className="text-lg font-semibold">
                  <HomeOutlined className="mr-2 text-green-500" /> Restaurant
                  Details
                </h3>
                <Divider />
                <div className="flex items-center gap-4">
                  {/* Left Side: Restaurant Image */}
                  <Image
                    width={74}
                    className="rounded-lg"
                    src={order.snapshot.branchDetails.branchImage}
                    preview={{ mask: "👁" }}
                  />

                  {/* Right Side: Details */}
                  <div>
                    <span className="block font-semibold text-lg">
                      {order.snapshot.branchDetails.branchName}
                    </span>
                    <span className="text-gray-600 text-sm">
                      {order.snapshot.branchDetails.branchAddress}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Payment Details */}
              <Card className="mb-4 shadow-md border-l-4 border-red-500">
                <h3 className="text-lg font-semibold">
                  <CreditCardOutlined className="mr-2 text-red-500" /> Payment
                  Details
                </h3>
                <Divider />
                <div className="grid grid-cols-2 gap-2">
                  <p>
                    <strong>Subtotal:</strong> ₹
                    {order.snapshot.paymentDetails.subtotal}
                  </p>
                  <p>
                    <strong>Tax Amount:</strong> ₹
                    {order.snapshot.paymentDetails.taxAmount}
                  </p>
                  <p>
                    <strong>Delivery Fee:</strong> ₹
                    {order.snapshot.paymentDetails.deliveryFee}
                  </p>
                  <p>
                    <strong>Discount:</strong>{" "}
                    {order.snapshot.paymentDetails.discountAmount > 0 ? (
                      <span className="text-green-600">
                        -₹{order.snapshot.paymentDetails.discountAmount}
                      </span>
                    ) : (
                      <span className="text-gray-500">Nil</span>
                    )}
                  </p>
                  <p className="col-span-2 font-bold text-lg">
                    <strong>Total Price:</strong> ₹
                    {order.snapshot.paymentDetails.totalPrice}
                  </p>

                  {/* Updated Grid for Payment Method & Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 col-span-2">
                    <p className="text-sm w-full">
                      <strong>Payment Method:</strong>{" "}
                      <Tag color="blue">
                        {order.snapshot.paymentDetails.paymentMethod}
                      </Tag>
                    </p>
                    <p className="text-sm w-full">
                      <strong>Status:</strong>{" "}
                      <Tag
                        color={
                          order.snapshot.paymentDetails.paymentStatus ===
                          "unpaid"
                            ? "red"
                            : "green"
                        }
                      >
                        {order.snapshot.paymentDetails.paymentStatus}
                      </Tag>
                    </p>
                  </div>

                  <p className="col-span-2 block sm:inline break-all">
                    <strong>Transaction Reference:</strong>{" "}
                    <br className="sm:hidden" />
                    {order.snapshot.paymentDetails.TxnReferenceNumber}
                  </p>
                </div>
              </Card>
            </Panel>
          ))}
        </Collapse>
      </div>
    </div>
  );
};

export default OrderHistory;
