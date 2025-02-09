import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginAsync } from "../redux/slice/authSlice";
import LoginForm from "../components/LoginForm";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginAsync({ email, password }));
  };

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
          onSubmit={handleLogin} 
        />

        {loading && <div>Loading...</div>}
        {error && <div className="error">{error}</div>}
      </section>
    </div>
  );
};

export default Login;
