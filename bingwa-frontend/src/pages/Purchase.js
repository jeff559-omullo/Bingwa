import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Spinner, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Purchase.css"; // Import the custom CSS

const Purchase = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/packages")
      .then((response) => {
        setPackages(response.data)
      })
      .catch((error) => setError("Failed to fetch packages."));
  }, []);

  const handlePurchase = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!phoneNumber || !selectedPackage) {
      setError("Please enter your phone number and select a package.");
      setLoading(false);
      return;
    }

    try {
      const response=await fetch("http://localhost:5000/api/mpesa/stkpush",{
        method:"POST",
        headers:{
          "content-type":"application/json"
        },
        body:JSON.stringify({
          phoneNumber,
          amount: selectedPackage,
        })
      })
      const parseRes=await response.json()
      console.log(parseRes)
      setSuccess("✅ STK Push Sent! Check your phone to complete payment.");
      setTimeout(() => navigate("/transactions"), 3000);
    } catch (error) {
      console.log(error)
      setError("❌ Payment request failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="purchase-container">
      {/* ✅ Green Header */}
      <div className="header">
        <h2>Buy Data Package</h2>
      </div>

      <div className="form-container">
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <form onSubmit={handlePurchase}>
          {/* ✅ Phone Number Input */}
          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-control"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
            />
          </div>

          {/* ✅ Package Selection */}
          <div className="mb-3">
            <label className="form-label">Select Package</label>
            <select
              className="form-select"
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
            >
              <option value="">-- Choose a package --</option>
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.price}>
                  {pkg.name} - Ksh {pkg.price} 
                </option>
              ))}
            </select>
          </div>

          {/* ✅ Buy Button */}
          <button type="submit" className="btn btn-success w-100" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Buy Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Purchase;

