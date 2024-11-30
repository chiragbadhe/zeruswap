import React from "react";

interface DisplayDataProps {
  value: string | null;
  text: string;
}

const DisplayData: React.FC<DisplayDataProps> = ({ value, text }) => {
  return (
    <div className="mb-3">
      <p className="opacity-60 justify-between flex">
        {text}:<span className="font-medium">{value || "Loading..."}</span>
      </p>
    </div>
  );
};

export default DisplayData;
