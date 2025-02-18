import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Result } from "antd";

const FiveZeroZero = () => {
  console.log("⚡ FiveZeroZero is rendering with error:");

  return (
    <div className="flex items-center justify-center h-screen">
      <Result
        status="500"
        title={<div className="text-4xl font-bold">500</div>}
        subTitle={
          <div>
            <div className="text-2xl text-gray-500 font-semibold mb-2">
              Internal Server Error
            </div>
            <p className="text-gray-600">
              Oops! Something went wrong. Please try again later.
            </p>
          </div>
        }
      />
    </div>
  );
};

export default FiveZeroZero;
