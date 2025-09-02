import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import mosquelogo from "../assets/mosque-svgrepo-com (1).svg";

const SignUp = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { role } = useParams();
  const [selectedRole, setSelectedRole] = useState(role || "user");
  const { signup, user } = useAuth();
  const navigate = useNavigate();
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    messages: [],
  });

  useEffect(() => {
    if (user) {
      navigate("/homeMM");
    }
  }, [user, navigate]);

  // Password validation criteria
  const validatePassword = (password) => {
    const messages = [];
    let score = 0;

    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      messages.push("At least 8 characters long");
    }

    // Uppercase letter check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      messages.push("At least one uppercase letter");
    }

    // Lowercase letter check
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      messages.push("At least one lowercase letter");
    }

    // Number check
    if (/\d/.test(password)) {
      score += 1;
    } else {
      messages.push("At least one number");
    }

    // // Special character check
    // if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    //   score += 1;
    // } else {
    //   messages.push("At least one special character");
    // }

    return { score, messages };
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(validatePassword(newPassword));
  };

  const getPasswordStrengthColor = (score) => {
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-yellow-500";
    if (score <= 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Check if password meets minimum requirements
    if (passwordStrength.score < 4) {
      setError("Please create a stronger password");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/signup",
        {
          username,
          email,
          password,
          role: selectedRole,
        }
      );
      if (response.data.success) {
         // Send verification email
        //  const verificationResponse = await axios.post(
        //   "http://localhost:3001/api/auth/send-verification",
        //   { email }
        // );

        // if (verificationResponse.data.success) {
          setIsEmailSent(true);
          setSuccessMessage(
            "Account created successfully! Please check your email to verify your account."
          );
        // }

        // navigate("/login");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error during signup. Please try again later");
      console.error("Error during signup:", error);
    }
  };

    // If email is sent, show verification pending screen
    if (isEmailSent) {
      return (
        <div className="flex items-center justify-center h-screen w-screen bg-gray-500 dark:bg-gray-900">
          <div className="w-full max-w-md bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700 p-8">
            <div className="text-center">
              <img
                className="w-16 h-16 mx-auto mb-4"
                src={mosquelogo}
                alt="logo"
              />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Verify Your Email
              </h2>
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-6">
                <p className="text-blue-800 dark:text-blue-200">
                  We've sent a verification link to:
                </p>
                <p className="font-medium text-blue-800 dark:text-blue-200">
                  {email}
                </p>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Please check your email and click the verification link to activate
                your account. If you don't see the email, check your spam folder.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Go to Login
                </button>
                <button
                  onClick={async () => {
                    try {
                      await axios.post(
                        "http://localhost:3001/api/auth/resend-verification",
                        { email }
                      );
                      setSuccessMessage("Verification email resent successfully!");
                    } catch (error) {
                      setError("Failed to resend verification email");
                    }
                  }}
                  className="w-full text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Resend Verification Email
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-500 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 sm:p-8">
        {successMessage && (
            <div className="p-4 mb-4 text-sm text-green-800 bg-green-50 rounded-lg dark:bg-gray-800 dark:text-green-400">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="p-4 mb-4 text-sm text-red-800 bg-red-50 rounded-lg dark:bg-gray-800 dark:text-red-400">
              {error}
            </div>
          )}
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img className="w-8 h-8 mr-2" src={mosquelogo} alt="logo" />
            Masyarakat Masjid
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-blue-900 md:text-2xl dark:text-white">
                Create your account
              </h1>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your name
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="John Doe"
                    value={username}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                  {/* Password strength indicator */}
                  <div className="mt-2">
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-full rounded-full ${getPasswordStrengthColor(
                          passwordStrength.score
                        )}`}
                        style={{
                          width: `${(passwordStrength.score / 4) * 100}%`,
                        }}
                      ></div>
                    </div>
                    {/* Password requirements */}
                    <div className="mt-2 text-sm">
                      <p className="text-gray-600 dark:text-gray-400 mb-1">
                        {passwordStrength.score >= 4
                          ? "Strong"
                          : "Password must contain:"}
                      </p>
                      {passwordStrength.score < 4 && (
                        <ul className="space-y-1">
                          {passwordStrength.messages.map((message, index) => (
                            <li
                              key={index}
                              className="text-red-500 dark:text-red-400 flex items-center"
                            >
                              <span className="mr-1">•</span>
                              {message}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
                {/* <div>
                  <label
                    htmlFor="role"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Select Role
                  </label>
                  <select
                    id="role"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div> */}
                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Create Account
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign in
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
