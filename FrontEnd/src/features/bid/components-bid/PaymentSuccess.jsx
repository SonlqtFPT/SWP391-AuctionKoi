import React, { useEffect, useState } from "react";

const PaymentSuccess = () => {
  const [countdown, setCountdown] = useState(3); // Start countdown at 3 seconds

  useEffect(() => {
    // Countdown timer
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // When countdown reaches 0, send message and close the tab
    if (countdown === 0) {
      window.opener?.postMessage("payment_successful", "*"); // Using optional chaining for safety
      window.close();
    }
  }, [countdown]);

  return (
    <div className="success-container">
      <h1>Payment Successful!</h1>
      <p>Thank you for your deposit.</p>
      <p>Closing in {countdown} seconds...</p>
      <p>Teacher Nhan is handsome</p>

      {/* Inline styles */}
      <style jsx>{`
        .success-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          text-align: center;
          background-color: #f4f7fc;
          font-family: "Arial", sans-serif;
        }

        h1 {
          color: #28a745;
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        p {
          font-size: 1.2rem;
          color: #555;
        }

        .success-container p:nth-child(4) {
          font-size: 1rem;
          font-style: italic;
          color: #999;
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        h1,
        p {
          animation: fadeIn 1s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;
