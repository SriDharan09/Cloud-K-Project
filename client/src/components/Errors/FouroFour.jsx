import React from "react";
import { Link } from "react-router-dom";
import { Button, Result } from "antd";

const FouroFour = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Result
        status="404"
        title={
          <div className="text-4xl font-bold">
            404{" "}
            <div className="text-2xl text-gray-500 font-semibold mb-2">
              Page Not Found
            </div>
          </div>
        }
        subTitle={
          <div>
            <p className="text-gray-600">
              Sorry, the page you are looking for does not exist.
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

export default FouroFour;
