import React from "react";

const Spinner = ({ size = "md" }) => {
  const sizeClasses = {
    xs: "w-3 h-3 border-2",
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-3",
    lg: "w-8 h-8 border-4",
    xl: "w-12 h-12 border-4",
  };

  return (
    <span
      className={`inline-block animate-spin rounded-full border-t-transparent border-solid border-blue-500 ${sizeClasses[size]}`}
      role="status"
    ></span>
  );
};

export default Spinner;
