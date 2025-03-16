import React, { useState } from "react";
import axios from "axios";

const Status = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");

  const checkStatus = async () => {
    setError("");
    setStatus(null);
    if (!phoneNumber) {
      setError("Please enter your phone number.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/status?phoneNumber=${phoneNumber}`);
      setStatus(response.data);
    } catch (err) {
      setError("Failed to fetch status. Try again.");
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Transaction Status</h2>
      <div className="mb-3">
        <label className="form-label">Phone Number</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <button className="btn btn-primary" onClick={checkStatus}>
        Check Status
      </button>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {status && (
        <div className="alert alert-info mt-3">
          <h5>Status:</h5>
          <p><strong>Transaction ID:</strong> {status.transactionId}</p>
          <p><strong>Status:</strong> {status.status}</p>
          <p><strong>Amount:</strong> Ksh {status.amount}</p>
        </div>
      )}
    </div>
  );
};

export default Status;
