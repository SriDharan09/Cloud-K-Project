import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SolutionOutlined, UserOutlined } from "@ant-design/icons";
import {
  loginAsync,
  setUserEmail,
  signUpAsync,
} from "../redux/slice/authSlice";
import LoginForm from "../components/LoginForm";
import { useNotification } from "../context/NotificationProvider";
import AsyncModal from "../components/Modal/AsyncModal";
import { userVerification } from "../api/authApi";
import { useLoader } from "../context/LoaderContext";
import "../styles/Login.css";
import { Steps } from "antd";

const Login = () => {
  const { showLoader, hideLoader } = useLoader();
  const openNotification = useNotification();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [fullName, setFullName] = useState("");
  const [repeatpassword, setRepeatpassword] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [verificationCode, setVerificationCode] = useState("");
  const StoredEmail = useSelector((state) => state.auth.email);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginAsync({ email, password }));
    console.log(result);
    if (result?.payload) {
      openNotification(
        result.payload.status,
        result.payload.title,
        result.payload.message
      );
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== repeatpassword) {
      openNotification("warning", "Signup Error", "Passwords do not match!");
      return;
    }
    showLoader();
    const result = await dispatch(signUpAsync({ fullName, email, password }));
    hideLoader();

    if (result?.payload) {
      openNotification(
        result.payload.status,
        result.payload.title,
        result.payload.message
      );
      if (result.payload.status === 200 || result.payload.status === 201) {
        setCurrentStep(1);
      }
    }
  };

  const handleVerifyCode = async () => {
    const result = await userVerification({
      email: StoredEmail,
      verificationCode,
    });
    if (result?.status === 200 || result?.status === 201) {
      setVerificationCode("");
      openNotification(result?.status, result?.title, result?.message);
      setCurrentStep(2);
    } else {
      setVerificationCode("");
      openNotification(result?.status, result?.title, result?.message);
    }
  };

  const toggleMode = () => {
    dispatch(setUserEmail(""));
    setEmail("");
    setFullName("");
    setRepeatpassword("");
    setPassword("");
    setCurrentStep(0);
    setMode((prevMode) => (prevMode === "login" ? "signup" : "login"));
  };

  return (
    <div>
      <div className={`form-block-wrapper form-block-wrapper--is-${mode}`} />
      <section className={`form-block form-block--is-${mode}`}>
        {mode === "signup" && (
          <div className="py-2">
            <Steps
              className="custom-steps"
              current={currentStep}
              items={[
                {
                  title: "Register",
                  status: currentStep >= 1 ? "finish" : "process",
                  icon: <UserOutlined />,
                },
                {
                  title: "Verify Email",
                  status: currentStep === 2 ? "finish" : "wait",
                  icon: <SolutionOutlined />,
                },
              ]}
            />
          </div>
        )}

        <header className="form-block__header">
          <h1>{mode === "login" ? "Welcome back!" : "Sign up"}</h1>
          {currentStep === 0 && (
            <div className="form-block__toggle-block">
              <span id="toggle-text">
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
          )}
        </header>

        {currentStep === 0 ? (
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
        ) : (
          <AsyncModal
            title="Verify Your Email"
            content={`A verification code has been sent to ${email}.`}
            inputLabel="Enter Verification Code :"
            inputValue={verificationCode}
            setInputValue={setVerificationCode}
            onConfirm={handleVerifyCode}
            triggerText="Verify Email"
            maxLength={6}
            inputType="number"
          />
        )}
      </section>
    </div>
  );
};

export default Login;
