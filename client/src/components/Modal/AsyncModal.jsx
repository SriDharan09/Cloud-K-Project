import React, { useState } from "react";
import { Button, Modal, Input } from "antd";

const AsyncModal = ({ title, content, onConfirm, triggerText, inputLabel }) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalContent, setModalContent] = useState(content);
  const [inputValue, setInputValue] = useState(""); // Store input value

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    setModalContent("Processing...");
    
    try {
      await onConfirm(inputValue); // Send input value to the function
      setModalContent("Success! Closing in 2 seconds...");
    } catch (error) {
      setModalContent("Error occurred. Please try again.");
    }
    
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
      setModalContent(content);
      setInputValue(""); // Reset input after closing
    }, 2000);
  };

  const handleCancel = () => {
    setOpen(false);
    setInputValue(""); // Reset input
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        {triggerText || "Open Modal"}
      </Button>
      <Modal
        title={title || "Title"}
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalContent}</p>
        
        {inputLabel && (
          <>
            <p>{inputLabel}</p>
            <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
          </>
        )}
      </Modal>
    </>
  );
};

export default AsyncModal;
