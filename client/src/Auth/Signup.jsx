import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null); // To store error messages
  const [success, setSuccess] = useState(null); // To store success messages
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/register', {
        name,
        email,
        password, // Send plain text password to the server
      });

      // Update UI to show success message
      setError(null); // Clear any previous errors
      setSuccess('Signup successful!');
      console.log('Signup successful:', response.data);
      navigate('/login'); // Navigate to login page after successful signup
    } catch (error) {
      setError(error.response?.data?.message || 'Signup failed.'); // Handle specific error messages
      setSuccess(null); // Clear any success message
    }
  };

  return (
    <div className="signup-container"> {/* Use CSS class for styling */}
      <form onSubmit={handleSubmit} className="signup-form">
        <h1 className="signup-heading">Sign Up</h1>

        {error && <div className="error-message">{error}</div>} {/* Display error message */}
        {success && <div className="success-message">{success}</div>} {/* Display success message */}

        <div className="form-group">
          <label htmlFor="name">Your Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Your Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>
            <input type="checkbox" /> Subscribe to our newsletter
          </label>
        </div>

        <button type="submit" className="signup-button">
          Register
        </button>
        <div>
        <Link to="/login">
            Login
        </Link>
        </div>
        
      </form>
    </div>
  );
}

export default Signup;
