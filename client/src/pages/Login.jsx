import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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

const Login = () => {
  const { showLoader, hideLoader } = useLoader();
  const openNotification = useNotification();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [fullName, setFullName] = useState("");
  const [repeatpassword, setRepeatpassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  var StoredEmail = useSelector((state) => state.auth.email);

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
    console.log(result);

    if (!result?.payload?.user) {
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
    console.log(email);

    showLoader();
    const result = await dispatch(signUpAsync({ fullName, email, password }));
    hideLoader();
    console.log(result);

    setEmail("");
    setFullName("");
    setRepeatpassword("");
    setPassword("");

    console.log("Error", result.payload.error);
    setIsModalOpen(true);

    if (result?.payload) {
      openNotification(
        result.payload.status,
        result.payload.title,
        result.payload.message
      );
    }
  };

  const handleVerifyCode = async () => {
    const result = await userVerification({
      email: StoredEmail,
      verificationCode,
    });
    if (result?.status === 200 || result?.status === 201) {
      setVerificationCode("");
      setIsModalOpen(false);
      openNotification(result?.status, result?.title, result?.message);
    } else {
      setVerificationCode("");
      openNotification(result?.status, result?.title, result?.message);
    }
  };
  const toggleMode = () => {
    dispatch(setUserEmail(""));
    setIsModalOpen(false);
    setEmail("");
    setFullName("");
    setRepeatpassword("");
    setPassword("");
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
      <div className=" flex items-center justify-center">
        <AsyncModal
          title="Verify Your Email"
          content={`A verification code has been sent to ${email}.`}
          inputLabel="Enter Verification Code"
          inputValue={verificationCode}
          setInputValue={setVerificationCode}
          onConfirm={handleVerifyCode}
          triggerText="Verify Email"
          maxLength={6}
        />
      </div>
    )}
    </div>
  );
};

export default Login;
