import React from "react";
import { Link } from "react-router-dom";
import { Button, Result } from "antd";

const FouroThree = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Result
        status="403"
        title={<div className="text-4xl font-bold">403</div>}
        subTitle={
          <div>
            <div className="text-2xl text-gray-500 font-semibold mb-2">
              Unauthorized
            </div>
            <p className="text-gray-600">
              Oops! You are not authorized to access this page.
            </p>
          </div>
        }
        extra={
          <Link to="/">
            <Button type="primary">Back Home</Button>
          </Link>
        }
      />
    </div>
  );
};

export default FouroThree;
