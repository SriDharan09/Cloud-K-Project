import React from "react";
import Input from "./Input";

const LoginForm = ({
  mode,
  email,
  setEmail,
  password,
  setPassword,
  fullName,
  setFullName,
  repeatpassword,
  setRepeatpassword,
  onSubmit,
}) => (
  <>
    <form onSubmit={onSubmit}>
      <div className="form-block__input-wrapper">
        <div className="form-group form-group--login">
          <Input
            type="text"
            id="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-group form-group--signup">
          <>
            <Input
              type="text"
              id="fullname"
              label="Full Name"
              disabled={false}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <Input
              type="email"
              id="email"
              label="Email"
              disabled={false}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              id="createpassword"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={false}
            />
            <Input
              type="password"
              id="repeatpassword"
              label="Repeat Password"
              value={repeatpassword}
              onChange={(e) => setRepeatpassword(e.target.value)}
              disabled={false}
            />
          </>
        </div>
      </div>

      <button
        className="button mt-1.5 button--primary full-width"
        type="submit"
      >
        {mode === "login" ? "Log In" : "Sign Up"}
      </button>
    </form>
    {mode === "login" && (
      <div className="flex items-center justify-between mt-3 text-sm text-gray-800">
        {/* Remember Me Checkbox */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="rememberMe"
            id="rememberMe"
            className="w-5 h-5 rounded-md border-gray-400 text-primary focus:ring-primary"
          />
          <span className="text-gray-900 font-medium hover:text-gray-700 transition">
            Remember me
          </span>
        </label>

        {/* Forgot Password Link */}
        <button className=" font-semibold hover:underline hover:text-blue-800 transition duration-200">
          Forgot Password?
        </button>
      </div>
    )}
  </>
);

export default LoginForm;
