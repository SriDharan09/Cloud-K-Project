import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginAsync } from "../redux/slice/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  // Move the selector call inside the component
  console.log("Auth State:", { user, loading, error });

  const handleLogin = () => {
    dispatch(loginAsync({ email, password }));
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold">Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 m-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 m-2"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white p-2 m-2 rounded"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {user && <p className="text-green-500">Welcome, {user.name}!</p>}
    </div>
  );
};

export default Login;
