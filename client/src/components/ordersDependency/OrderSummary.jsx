import React, { useState } from "react";
import {
  Card,
  Descriptions,
  Table,
  Tag,
  Typography,
  Button,
  Row,
  Col,
  Divider,
  Switch,
  Collapse,
  Space,
} from "antd";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FileTextOutlined,
  DollarCircleOutlined,
  CreditCardOutlined,
  HomeOutlined,
  PrinterOutlined,
  QrcodeOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.orderData;

  // Toggle state for basic/enhanced receipt
  const [showEnhancedReceipt, setShowEnhancedReceipt] = useState(false);

  if (!orderData) {
    return <Text className="text-red-500">No order data available.</Text>;
  }

  const {
    orderDetails,
    customerDetails,
    branchDetails,
    items,
    paymentDetails,
  } = orderData;

  const columns = [
    { title: "Item", dataIndex: "name", key: "name" },
    { title: "Qty", dataIndex: "quantity", key: "quantity", align: "center" },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `₹${price}`,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total) => <b>₹{total}</b>,
    },
  ];

  return (
    <motion.div
      className="max-w-4xl mx-auto mt-3 p-3 lg:p-5 bg-gray-50 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 💡 Toggle for Basic/Enhanced Receipt */}
      <div className="flex justify-end items-center mb-3">
        <Text className="mr-2">Basic Receipt</Text>
        <Switch
          checked={showEnhancedReceipt}
          onChange={() => setShowEnhancedReceipt(!showEnhancedReceipt)}
        />
        <Text className="ml-2">Enhanced Receipt</Text>
      </div>

      {showEnhancedReceipt ? (
        // 🔹 Enhanced Receipt with collapsible sections
        <>
          <div className="my-9">
            <Card className="p-6 mb-4 shadow-md bg-white border border-gray-300 text-center">
              {/* Restaurant Name Centered */}
              <Text strong className="text-xl block">
                🍽 {branchDetails.branchName}
              </Text>

              {/* Order Details */}
              <Row gutter={16} align="middle" justify="center" className="mt-3">
                {/* Transaction ID */}
                <Col span={12}>
                  <Text strong className="text-base">
                    🔗 Transaction ID:{" "}
                  </Text>
                  <Text className="text-base">
                    {orderDetails.trackingNumber}
                  </Text>
                </Col>

                {/* Status */}
                <Col span={6}>
                  <Text strong className="text-base">
                    🚀 Status:{" "}
                  </Text>
                  <Tag
                    color={
                      orderDetails.status === "pending"
                        ? "yellow"
                        : orderDetails.status === "delivered"
                        ? "green"
                        : "blue"
                    }
                    className="text-base px-3 py-1 rounded-md"
                  >
                    {orderDetails.status.toUpperCase()}
                  </Tag>
                </Col>

                {/* Total Paid */}
                <Col span={6}>
                  <Text strong className="text-base">
                    💰 Total Paid:{" "}
                  </Text>
                  <Text className="text-base font-semibold">
                    ₹{paymentDetails.totalPrice}
                  </Text>
                </Col>
              </Row>
            </Card>
          </div>

          <Collapse defaultActiveKey={["1", "2", "3", "4", "5", "6"]} accordion>
            {/* Order Details */}
            <Panel header="📌 Order Details" key="1">
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Order ID">
                  {orderDetails.orderId}
                </Descriptions.Item>
                <Descriptions.Item label="Date">
                  {orderDetails.orderDate}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag
                    color={
                      orderDetails.status === "pending" ? "yellow" : "green"
                    }
                  >
                    {orderDetails.status.toUpperCase()}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Prep Time">
                  {orderDetails.preparationTime}
                </Descriptions.Item>
                <Descriptions.Item label="Tracking No.">
                  {orderDetails.trackingNumber}
                </Descriptions.Item>
              </Descriptions>
            </Panel>

            {/* Customer Info */}
            <Panel header="🏠 Customer Info" key="2">
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Name">
                  {customerDetails.name}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {customerDetails.contact}
                </Descriptions.Item>
                <Descriptions.Item label="Address">
                  {customerDetails.address}
                </Descriptions.Item>
              </Descriptions>
            </Panel>

            {/* Branch Details */}
            <Panel header="🏬 Branch Details" key="3">
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Branch">
                  {branchDetails.branchName}
                </Descriptions.Item>
                <Descriptions.Item label="Address">
                  {branchDetails.branchAddress}
                </Descriptions.Item>
              </Descriptions>
            </Panel>

            {/* Payment Summary */}
            <Panel header="💳 Payment Summary" key="4">
              <Row gutter={16}>
                <Col span={12}>
                  <Card className="bg-blue-100 text-blue-700">
                    <DollarCircleOutlined style={{ fontSize: 22 }} />
                    <Text className="ml-3 font-bold">Total Paid: </Text>
                    <Text>₹{paymentDetails.totalPrice}</Text>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card className="bg-green-100 text-green-700">
                    <CreditCardOutlined style={{ fontSize: 22 }} />
                    <Text className="ml-3 font-bold">Transaction Ref: </Text>
                    <Text>{paymentDetails.TxnReferenceNumber}</Text>
                  </Card>
                </Col>
              </Row>
              <Divider />
              <Row justify="space-between">
                <Col span={12}>
                  <Text strong>Subtotal:</Text>
                </Col>
                <Col span={12} className="text-right">
                  <Text>₹{paymentDetails.subtotal}</Text>
                </Col>

                <Col span={12}>
                  <Text strong>Tax (5%):</Text>
                </Col>
                <Col span={12} className="text-right">
                  <Text>₹{paymentDetails.taxAmount}</Text>
                </Col>

                <Col span={12}>
                  <Text strong>Discount:</Text>
                </Col>
                <Col span={12} className="text-right">
                  <Text>- ₹{paymentDetails.discountAmount}</Text>
                </Col>

                <Col span={12}>
                  <Text strong>Delivery Fee:</Text>
                </Col>
                <Col span={12} className="text-right">
                  <Text>₹{paymentDetails.deliveryFee}</Text>
                </Col>

                <Col span={12}>
                  <Text strong>💰 Total:</Text>
                </Col>
                <Col span={12} className="text-right">
                  <Text>₹{paymentDetails.totalPrice}</Text>
                </Col>
              </Row>
            </Panel>

            {/* Ordered Items */}
            <Panel header="🍽 Ordered Items" key="5">
              <Table
                dataSource={items}
                columns={columns}
                pagination={false}
                rowKey="menuItemId"
              />
            </Panel>

            {/* Special Instructions */}
            <Panel header="📝 Special Instructions" key="6">
              <Card className="bg-gray-100 text-gray-700">
                <InfoCircleOutlined style={{ fontSize: 22 }} />
                <Text className="ml-3 font-bold">Notes: </Text>
                <Text>{orderDetails.notes || "N/A"}</Text>
                <br />
                <Text className="ml-3 font-bold">Special Instructions: </Text>
                <Text>{orderDetails.specialInstructions || "N/A"}</Text>
              </Card>
            </Panel>
          </Collapse>
        </>
      ) : (
        // 📄 Basic Receipt (like a printed bill)
        <motion.div
          className="flex justify-center items-center min-h-screen p-2 lg:p-5"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white border-dashed border-2 border-gray-400 shadow-lg rounded-lg p-5 max-w-md w-full text-gray-700 font-mono text-center">
            {/* Restaurant Details */}
            <Title level={4} className="mb-2">
              🧾 {branchDetails.branchName}
            </Title>
            <Text>{branchDetails.address}</Text>
            <Divider className="my-2 border-gray-400" />

            {/* Order Details */}
            <Row justify="space-between" className="mb-2">
              <Col span={12} className="text-left">
                <Text strong>Order ID:</Text> #{orderDetails.orderId}
                <br />
                <Text strong>Date:</Text> {orderDetails.orderDate}
              </Col>
              <Col span={12} className="text-right">
                <Text strong>Customer:</Text> {customerDetails.name}
                <br />
                <Text strong>Phone:</Text> {customerDetails.contact}
              </Col>
            </Row>

            <Divider className="my-2 border-gray-400" />

            {/* Ordered Items */}
            <Title level={5} className="mb-2">
              🛍 Ordered Items
            </Title>
            <Table
              dataSource={items}
              columns={[
                { title: "Item", dataIndex: "name", key: "name" },
                {
                  title: "Qty",
                  dataIndex: "quantity",
                  key: "quantity",
                  align: "center",
                },
                {
                  title: "Price",
                  dataIndex: "price",
                  key: "price",
                  render: (price) => `₹${price}`,
                },
                {
                  title: "Total",
                  dataIndex: "total",
                  key: "total",
                  render: (total) => <b>₹{total}</b>,
                },
              ]}
              pagination={false}
              size="small"
              bordered
              rowKey="menuItemId"
            />

            <Divider className="my-2 border-gray-400" />

            {/* Billing Summary */}
            <Row justify="space-between" className="text-left">
              <Col span={12}>
                <Text strong>Subtotal:</Text>
              </Col>
              <Col span={12} className="text-right">
                <Text>₹{paymentDetails.subtotal}</Text>
              </Col>

              <Col span={12}>
                <Text strong>Tax (5%):</Text>
              </Col>
              <Col span={12} className="text-right">
                <Text>₹{paymentDetails.taxAmount}</Text>
              </Col>

              <Col span={12}>
                <Text strong>Discount:</Text>
              </Col>
              <Col span={12} className="text-right">
                <Text>- ₹{paymentDetails.discountAmount}</Text>
              </Col>

              <Col span={12}>
                <Text strong>Delivery Fee:</Text>
              </Col>
              <Col span={12} className="text-right">
                <Text>₹{paymentDetails.deliveryFee}</Text>
              </Col>
            </Row>

            <Divider className="my-2 border-gray-400" />

            {/* Total Payment */}
            <Row justify="space-between">
              <Col span={12} className="text-left">
                <Title level={4}>💰 Total Paid:</Title>
              </Col>
              <Col span={12} className="text-right">
                <Title level={4}>₹{paymentDetails.totalPrice}</Title>
              </Col>
            </Row>

            <Text className="block mt-2">✅ Payment Status: PAID</Text>
            <Text className="block">
              🔗 Transaction Ref: {paymentDetails.TxnReferenceNumber}
            </Text>

            <Divider className="my-2 border-gray-400" />

            {/* Delivery Details */}
            <Row justify="space-between">
              <Col span={12} className="text-left">
                <Text strong>🛵 Delivered By:</Text>{" "}
                {orderDetails.deliveryPartner}
              </Col>
              <Col span={12} className="text-right">
                <Text strong>Tracking No.:</Text> {orderDetails.trackingNumber}
              </Col>
            </Row>

            <Divider className="my-2 border-gray-400" />

            {/* Thank You Message */}
            <Text strong className="block">
              📌 Thank You for Ordering!
            </Text>
            <Text type="secondary" className="block">
              Follow us on Instagram @ {branchDetails.branchName}
            </Text>
          </div>
        </motion.div>
      )}

      {/* 🎯 Action Buttons */}
      <Row
        justify="space-between"
        className="mt-5 sticky bottom-0 bg-gray-50 p-3 gap-4"
      >
        <Button
          type="primary"
          icon={<HomeOutlined />}
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
        <Button
          type="default"
          icon={<FileTextOutlined />}
          onClick={() => navigate("/orders")}
        >
          View Orders
        </Button>
        <Button
          type="dashed"
          icon={<PrinterOutlined />}
          onClick={() => window.print()}
        >
          Print Receipt
        </Button>
        <Button
          type="text"
          icon={<QrcodeOutlined />}
          onClick={() => alert("QR Code feature coming soon!")}
        >
          View QR Code
        </Button>
      </Row>
    </motion.div>
  );
};

export default OrderSummary;
