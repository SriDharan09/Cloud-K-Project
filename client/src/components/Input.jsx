import React from "react";

const Input = ({ id, type, label, disabled, value, onChange }) => (
  <input
    className="form-group__input"
    type={type}
    id={id}
    placeholder={label}
    disabled={disabled}
    value={value}
    onChange={onChange}
  />
);

export default Input;
