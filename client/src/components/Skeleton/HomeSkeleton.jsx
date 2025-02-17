import React from "react";
import { Skeleton, Space, Card, Carousel, Row, Col } from "antd";
import { motion } from "framer-motion";

const HomeSkeleton = () => {
  return (
    <div className="p-4">
      {/* Hero Section Skeleton */}
      <div className="flex flex-col justify-center items-center my-20 w-full">
        <Skeleton.Image className="w-full max-w-md h-32" active />
        <Skeleton.Input active size="large" block />
      </div>

      {/* Branch List Skeleton (Cards) */}
      <h2 className="text-xl font-semibold mb-4">
        <Skeleton.Input active size="large" style={{ width: 200 }} />
      </h2>
      <Row gutter={[16, 16]}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <Card className="w-full">
              <Skeleton.Image className="w-full h-32 mb-2" active />
              <Skeleton active paragraph={{ rows: 1 }} />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Category Section Skeleton (Carousel) */}
      <h2 className="text-xl font-semibold mt-8 mb-4">
        <Skeleton.Input active size="large" style={{ width: 200 }} />
      </h2>
      <motion.div
        className="flex space-x-8 w-max"
        animate={{ x: ["0%", "-100%"] }}
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
      >
        {/* Placeholder cards (Looping for skeleton effect) */}
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.div
            key={index}
            className="relative w-full sm:w-50 h-32 sm:h-40 rounded-lg overflow-hidden cursor-pointer shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            <Skeleton.Image
              className="w-full h-full"
              style={{ width: "450%", height: "100%" }}
              active
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Menu Section Skeleton (Images) */}
      <h2 className="text-xl font-semibold mt-8 mb-4">
        <Skeleton.Input active size="large" style={{ width: 200 }} />
      </h2>
      <Row gutter={[16, 16]}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Col xs={12} sm={8} md={6} lg={4} key={index}>
            <Skeleton.Image className="w-full h-24 mb-2" active />
            <Skeleton active paragraph={{ rows: 1 }} />
          </Col>
        ))}
      </Row>

      {/* Testimonials Skeleton */}
      <h2 className="text-xl font-semibold mt-8 mb-4">
        <Skeleton.Input active size="large" style={{ width: 200 }} />
      </h2>
      <Row gutter={[16, 16]}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card className="w-full p-4">
              <Skeleton.Avatar active size="large" shape="circle" />
              <Skeleton active paragraph={{ rows: 2 }} />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Footer Skeleton */}
      <div className="mt-10 text-center">
        <Skeleton.Button block active size="large" className="w-1/2 mx-auto" />
      </div>
    </div>
  );
};

export default HomeSkeleton;
