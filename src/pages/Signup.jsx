import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { signUpNewUser } = UserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setIsSubmitting(true);

    if (!name || !email || !studentId || !password) {
      setError("All fields are required");
      return;
    }

    const metadata = {
      full_name: name,
      student_id: studentId,
      role: role,
    };

    const result = await signUpNewUser(email, password, metadata);
    setIsSubmitting(false);

    if (result.success) {
      const targetTutor = location.state?.assignedTutor;

      if (targetTutor) {
        navigate(`/book/${targetTutor}`);
      } else {
        navigate("/welcome");
      }
    } else {
      setError(result.error);
    }
  };

  const getStrength = (pass) => {
    let score = 0;

    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getStrength(password);

  const strengthColor = [
    "bg-gray-200",
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
  ];
  const strengthWidth = ["0%", "25%", "50%", "75%", "100%"];

  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow-lg rounded-2xl mt-10">
      <h1 className="text-3xl font-bold text-primary text-center">
        Join the Community
      </h1>
      <p className="text-center text-gray-500 mt-2 mb-8">
        Already have an account?{" "}
        <Link to="/login" className="text-accent font-semibold hover:underline">
          Sign in
        </Link>
      </p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-bold text-gray-700">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ray McMillan Gumbo"
            required
          />
        </div>

        {/* Student ID - CRITICAL for your database trigger */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="studentId"
            className="text-sm font-bold text-gray-700"
          >
            Student ID
          </label>
          <input
            id="studentId"
            type="text"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="e.g. 202303013"
            required
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-bold text-gray-700">
            Student Email
          </label>
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

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-bold text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Min. 8 characters"
            required
          />

          {/* Only show the bar and text if the user is currently focused on the input */}
          {isFocused && (
            <div className="transition-opacity duration-300">
              <div className="h-2 w-full bg-gray-200 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${strengthColor[strength]}`}
                  style={{ width: strengthWidth[strength] }}
                ></div>
              </div>

              <p className="text-xs mt-1 text-gray-500">
                Password is:{" "}
                <span className="font-bold">
                  {["Too short", "Weak", "Fair", "Good", "Strong"][strength]}
                </span>
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700">
            I want to join as a:
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`flex-1 py-2 rounded-lg border-2 transition-all ${
                role === "student"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-gray-200"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("tutor")}
              className={`flex-1 py-2 rounded-lg border-2 transition-all ${
                role === "tutor"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-gray-200"
              }`}
            >
              Tutor
            </button>
          </div>
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
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary text-white hover:bg-opacity-90 cursor-pointer"
          }`}
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
