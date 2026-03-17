import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { signInUser } = UserAuth();

  const handleSignin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await signInUser(email, password);
    setIsSubmitting(false);

    if (result.success) {
      const origin = location.state?.from || "/"; 
      const targetTutor = location.state?.tutorId;

      if (targetTutor) {
        navigate(`/book/${targetTutor}`);
      } else {
        navigate(origin);
      }
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow-lg rounded-2xl mt-10 border border-gray-100">
      <h1 className="text-3xl font-bold text-primary text-center">Welcome Back</h1>
      <p className="text-center text-gray-500 mt-2 mb-8">
        Don't have an account?{" "}
        <Link to="/signup" className="text-accent font-semibold hover:underline">Sign up</Link>
      </p>

      <form className="space-y-6" onSubmit={handleSignin}>
        {/* Email Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-bold text-gray-700">Email Address</label>
          <input
            id="email"
            type="email"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="text-sm font-bold text-gray-700">Password</label>
            <Link to="/forgot-password" size="xs" className="text-xs text-accent hover:underline">Forgot Password?</Link>
          </div>
          <input
            id="password"
            type="password"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 rounded-lg font-bold transition-all ${
            isSubmitting 
              ? "bg-gray-400 cursor-not-allowed text-white" 
              : "bg-primary text-white hover:bg-opacity-90 cursor-pointer shadow-md active:scale-[0.98]"
          }`}
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default Login;