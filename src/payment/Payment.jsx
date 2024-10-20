import React from "react";
import { useParams } from "react-router-dom"; // Import useParams to get route params

const Payment = () => {
  const { lotId } = useParams(); // Get the lotId from the route

  return (
    <div>
      <h1>Payment for Lot: {lotId}</h1>
      {/* Add your payment form or information here */}
    </div>
  );
};

export default Payment;
