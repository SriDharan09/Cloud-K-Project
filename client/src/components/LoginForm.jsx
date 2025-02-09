import React from "react";
import Input from "./Input"; 

const LoginForm = ({
  mode,
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
}) => (
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
          <Input type="text" id="fullname" label="Full Name" disabled={false} />
          <Input type="email" id="email" label="Email" disabled={false} />
          <Input
            type="password"
            id="createpassword"
            label="Password"
            disabled={false}
          />
          <Input
            type="password"
            id="repeatpassword"
            label="Repeat Password"
            disabled={false}
          />
        </>
      </div>
    </div>

    <button className="button button--primary full-width" type="submit">
      {mode === "login" ? "Log In" : "Sign Up"}
    </button>
  </form>
);

export default LoginForm;
