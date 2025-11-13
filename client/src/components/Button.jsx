import React from "react";

const BackButton = ({ label = "Go Back", onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="
        relative 
        flex items-center justify-center 
        w-48 h-14 
        bg-white text-black 
        text-xl font-semibold 
        rounded-2xl 
        overflow-hidden 
        group
      "
    >
      {/* Animated Background */}
      <div
        className="
          absolute left-1 top-1
          flex items-center justify-center 
          h-12 w-1/4 
          bg-green-400 
          rounded-xl 
          duration-500 
          z-10 
          group-hover:w-[184px]
        "
      >
        {/* Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1024 1024"
          height="25px"
          width="25px"
        >
          <path
            d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
            fill="#000000"
          ></path>
          <path
            d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
            fill="#000000"
          ></path>
        </svg>
      </div>

      {/* Label */}
      <span className="translate-x-2 relative z-20">{label}</span>
    </button>
  );
};

export default BackButton;
