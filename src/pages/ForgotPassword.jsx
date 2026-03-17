import { useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { resetPassword } = UserAuth();
  const [status, setStatus] = useState({ type: "", msg: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "loading", msg: "Sending..." });

    const result = await resetPassword(email);
    if (result.success) {
      setStatus({ type: "success", msg: "Check your inbox for the reset link!" });
    } else {
      setStatus({ type: "error", msg: result.error });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 shadow-lg rounded-2xl bg-white border border-gray-100">
      <h2 className="text-2xl font-bold text-primary mb-2 text-center">Reset Password</h2>
      <p className="text-gray-500 text-sm text-center mb-6">
        Enter your email and we'll send you a link to get back into your account.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-accent/20"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="w-full bg-accent p-3 rounded-xl font-bold text-white hover:bg-red-900 transition-all">
          Send Reset Link
        </button>
      </form>

      {status.msg && (
        <p className={`mt-4 text-center text-sm font-medium ${
          status.type === "error" ? "text-red-600" : "text-green-600"
        }`}>
          {status.msg}
        </p>
      )}

      <div className="mt-6 text-center text-sm">
        <Link to="/login" className="text-accent hover:underline">Back to Login</Link>
      </div>
    </div>
  );
};

export default ForgotPassword;