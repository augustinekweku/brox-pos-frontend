import React from "react";

const InnerRelativeLoader = () => {
  return (
    <div
      className="absolute  flex items-center justify-center my-4"
      style={{
        width: "100%",
        height: "100%",
        zIndex: "99",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
      }}
    >
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  );
};

export default InnerRelativeLoader;
