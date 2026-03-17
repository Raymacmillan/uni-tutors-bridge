import { useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const { session, loading, updatePassword } = UserAuth();
  const [message, setMessage] = useState("");

  if (!loading && !session) {
    return (
      <div className="text-center mt-20 p-8 bg-white max-w-md mx-auto rounded-2xl shadow-lg border">
        <p className="text-red-500 font-bold">Invalid or expired session.</p>
        <Link
          to="/forgot-password"
          className="text-accent underline mt-4 block"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    const result = await updatePassword(newPassword);
    if (result.success) {
      setMessage("Password updated! Redirecting...");
      setTimeout(() => (window.location.href = "/login"), 2000);
    } else {
      setMessage("Error: " + result.error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 shadow-lg rounded-2xl bg-white border border-gray-100">
      <h2 className="text-2xl font-bold text-primary mb-4 text-center">
        Set New Password
      </h2>
      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="Enter new password"
          className="p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-accent/20"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button className="bg-accent p-3 rounded-xl font-bold text-white hover:bg-red-900 transition-all">
          Update Password
        </button>
      </form>
      {message && (
        <p className="mt-4 text-center text-sm font-medium">{message}</p>
      )}
    </div>
  );
};

export default UpdatePassword;
