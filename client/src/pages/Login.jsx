import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { Stepper, Step, StepLabel } from "@mui/material";
import { styled } from "@mui/material/styles";
import Check from "@mui/icons-material/Check";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
const steps = ["Register", "Verify Email"];
import { useModal } from "../context/ModalContext";
import { fetchUserProfile } from "../redux/slice/profileSlice";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,#f27121 0%,#e94057 50%,#8a2387 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,#f27121 0%,#e94057 50%,#8a2387 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ ownerState }) => ({
  backgroundColor: "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient(136deg, #f27121 0%, #e94057 50%, #8a2387 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient(136deg, #f27121 0%, #e94057 50%, #8a2387 100%)",
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <PersonAddIcon />,
    2: <VerifiedUserIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {completed ? <Check /> : icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

const Login = () => {
  const { closeModal, isModalOpen } = useModal();
  const { showLoader, hideLoader } = useLoader();
  const openNotification = useNotification();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [fullName, setFullName] = useState("");
  const [repeatpassword, setRepeatpassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const StoredEmail = useSelector((state) => state.auth.email);
  const [currentStep, setCurrentStep] = useState(0);
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginAsync({ email, password }));
    console.log(result.payload);
    if (result?.payload) {
      if (result.payload.status === 200 || result.payload.status === 201) {
        closeModal();
        dispatch(fetchUserProfile());
      }
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
      closeModal();
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
  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setRepeatpassword("");
    setVerificationCode("");
    setCurrentStep(0);
    setMode("login");
    dispatch(setUserEmail(""));
  };

  useEffect(() => {
    if (isModalOpen) {
      resetForm();
    }
  }, [isModalOpen]);

  return (
    <div>
      <button
        onClick={() => {
          closeModal();
          resetForm();
        }}
        className="absolute top-2.5 login_close right-3.5 text-xl text-gray-600 hover:text-black"
      >
        ✖
      </button>
      <div className={`form-block-wrapper form-block-wrapper--is-${mode}`} />
      <section className={`form-block form-block--is-${mode}`}>
        {mode === "signup" && (
          <div className="py-2">
            <Stepper
              alternativeLabel
              activeStep={currentStep}
              connector={<ColorlibConnector />}
            >
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>
        )}

        <header className="form-block__header">
          <h1>{mode === "login" ? "Welcome back!" : "Sign up"}</h1>
          {currentStep === 0 && (
            <div className="form-block__toggle-block">
              <span id="toggle-text font-medium">
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
