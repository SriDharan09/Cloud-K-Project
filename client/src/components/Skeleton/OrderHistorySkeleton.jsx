import { Card, Skeleton, Steps, Collapse } from "antd";
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  CreditCardOutlined,
  HomeOutlined,
} from "@ant-design/icons";

const { Step } = Steps;
const { Panel } = Collapse;

const OrderHistorySkeleton = () => {
  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Overall Stats Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="shadow-md border-l-4">
            <h3 className="font-semibold flex items-center">
              <Skeleton.Avatar active size="xs" className="mr-2" />
              <div className="w-10!">
                {/* <Skeleton.Input active size="small" className="w-full" /> */}
              </div>
            </h3>
            <Skeleton.Button active className="w-16 h-6 mt-2" />
          </Card>
        ))}
      </div>

      {/* Filter Dropdown Skeleton */}
      <div className="flex justify-end mb-4">
        <Skeleton.Button active className="w-32 sm:w-40 h-10" />
      </div>

      {/* Order List Skeleton */}
      <div className="max-w-3xl mx-auto w-full">
        {[...Array(3)].map((_, index) => (
          <Collapse
            key={index}
            accordion
            className="bg-white shadow-md rounded-lg"
          >
            <Panel
              header={
                <div className="flex justify-between items-center p-2 rounded-lg">
                  <Skeleton.Button active className="w-32 sm:w-40 h-6" />
                  <Skeleton.Button active className="w-16 sm:w-20 h-6" />
                </div>
              }
            >
              {/* Order Progress Skeleton */}
              <Card className="mb-4 shadow-md rounded-lg">
                <Steps current={1} size="small" className="hidden sm:flex">
                  {[...Array(3)].map((_, idx) => (
                    <Step
                      key={idx}
                      title={<Skeleton.Button style={{ width: 80 }} />}
                    />
                  ))}
                </Steps>
                {/* Mobile Progress (Linear) */}
                <Skeleton.Button active className="w-full h-4 sm:hidden mt-2" />
              </Card>

              {/* Ordered Items Skeleton */}
              <Card className="mb-4 shadow-md border-l-4">
                <h3 className="text-lg font-semibold">
                  <ShoppingCartOutlined className="mr-2 text-blue-500" />
                  Ordered Items
                </h3>
                {[...Array(2)].map((_, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-center gap-4 my-2"
                  >
                    <Skeleton.Image className="w-20 h-20" />
                    <Skeleton active paragraph={{ rows: 1 }} />
                  </div>
                ))}
              </Card>

              {/* Branch Details Skeleton */}
              <Card className="mb-4 shadow-md border-l-4">
                <h3 className="text-lg font-semibold">
                  <HomeOutlined className="mr-2 text-green-500" /> Restaurant
                  Details
                </h3>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Skeleton.Image className="w-20 h-20 rounded-lg" />
                  <Skeleton active paragraph={{ rows: 1 }} />
                </div>
              </Card>

              {/* Payment Details Skeleton */}
              <Card className="mb-4 shadow-md border-l-4">
                <h3 className="text-lg font-semibold">
                  <CreditCardOutlined className="mr-2 text-red-500" /> Payment
                  Details
                </h3>
                <Skeleton active paragraph={{ rows: 2 }} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Skeleton.Button active className="w-full sm:w-24 h-6" />
                  <Skeleton.Button active className="w-full sm:w-24 h-6" />
                </div>
              </Card>
            </Panel>
          </Collapse>
        ))}
      </div>
    </div>
  );
};

export default OrderHistorySkeleton;
