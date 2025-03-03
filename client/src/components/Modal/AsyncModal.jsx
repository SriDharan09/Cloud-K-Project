import React, { useState } from "react";
import { Button, Modal, Input } from "antd";

const AsyncModal = ({
  title,
  content,
  onConfirm,
  triggerText,
  inputLabel,
  inputValue,
  setInputValue,
  inputType,
  maxLength,
}) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => setOpen(true);

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("Error:", error);
    }
    setConfirmLoading(false);
    setOpen(false);
  };

  return (
    <>
      <Button
        type="primary"
        className="px-4 py-2 rounded-md"
        onClick={showModal}
      >
        {triggerText || "Open Modal"}
      </Button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 animate-fade-in">
            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-900">
              {title || "Title"}
            </h2>

            {/* Content */}
            <p className="text-gray-600 mt-2">{content}</p>

            {/* Input Field */}
            {inputLabel && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {inputLabel}
                </label>
                <Input
                  value={inputValue}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= maxLength) {
                      setInputValue(value);
                    }
                  }}
                  maxLength={maxLength ? maxLength : null}
                  type={inputType ? inputType : null}
                  className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                className="px-4 py-2 rounded-md bg-gray-300"
                onClick={() => setOpen(false)}
                setInputValue={() => setInputValue("1")}
              >
                Cancel
              </Button>
              <Button
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                loading={confirmLoading}
                onClick={handleOk}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AsyncModal;
