import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginAsync, signUpAsync } from "../redux/slice/authSlice";
import LoginForm from "../components/LoginForm";
import { useNotification } from "../context/NotificationProvider";
import AsyncModal from "../components/Modal/AsyncModal";
import { Input } from "antd";
import "../styles/Login.css";

const Login = () => {
  const openNotification = useNotification();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [fullName, setFullName] = useState("");
  const [repeatpassword, setRepeatpassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginAsync({ email, password }));
    if (result) {
      openNotification({
        status: result.payload.status,
        message: result.payload.title,
        description: result.payload.message,
      });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== repeatpassword) {
      openNotification("warning", "Signup Error", "Passwords do not match!");
      return;
    }

    const result = await dispatch(signUpAsync({ fullName, email, password }));
    console.log("Error", result.payload.error);
    setIsModalOpen(true); // Open verification modal

    if (result?.payload) {
      openNotification(
        result.payload.status,
        result.payload.title,
        result.payload.message
      );
    }
  };
  const handleVerifyCode = async () => {}
  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "login" ? "signup" : "login"));
  };

  return (
    <div>
      <div className={`form-block-wrapper form-block-wrapper--is-${mode}`} />
      <section className={`form-block form-block--is-${mode}`}>
        <header className="form-block__header">
          <h1>{mode === "login" ? "Welcome back!" : "Sign up"}</h1>
          <div className="form-block__toggle-block">
            <span>
              {mode === "login" ? "Don't" : "Already"} have an account? Click
              here &#8594;
            </span>
            <input
              id="form-toggler"
              type="checkbox"
              checked={mode === "signup"}
              onChange={toggleMode}
            />
            <label htmlFor="form-toggler"></label>
          </div>
        </header>

        <LoginForm
          mode={mode}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          fullName={fullName}
          setFullName={setFullName}
          repeatpassword={repeatpassword}
          setRepeatpassword={setRepeatpassword}
          onSubmit={mode === "login" ? handleLogin : handleSignup}
        />
      </section>
      {isModalOpen && (
        <AsyncModal
          title="Verify Your Email"
          content={
            <>
              <p>
                A verification code has been sent to <strong>{email}</strong>.
                Enter the code below:
              </p>
              <Input
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter Code"
              />

            </>
          }
          onConfirm={handleVerifyCode}
          triggerText="Verify Email"

        />
      )}
    </div>
  );
};

export default Login;
