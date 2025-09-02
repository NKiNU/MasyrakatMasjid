import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const { token } = useParams(); // Extract token from URL
  const [status, setStatus] = useState("loading"); // Status: loading, success, error
  const [message, setMessage] = useState(""); // Display a specific message

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Call the backend to verify the email
        const response = await axios.get(
          `http://localhost:3001/api/auth/verify-email/${token}`
        );
        setStatus("success");
        setMessage(response.data.message); // Get message from API
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message || "Verification failed. Try again."
        );
      }
    };

    verifyEmail();
  }, [token]);

  // Render loading state
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-700">Verifying...</h1>
          <p className="text-gray-500">Please wait while we verify your email.</p>
          <div className="mt-4 w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Render success state
  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-600">Success!</h1>
          <p className="mt-2 text-gray-700">{message}</p>
          <Link to="/login">
            <button className="mt-6 px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600">
              Go to Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Render error state
  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Verification Failed</h1>
          <p className="mt-2 text-gray-700">{message}</p>
          <Link to="/resend-verification">
            <button className="mt-6 px-6 py-2 bg-yellow-500 text-white font-medium rounded-md hover:bg-yellow-600">
              Resend Verification Email
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return null; // Fallback (should not be reached)
};

export default VerifyEmail;
