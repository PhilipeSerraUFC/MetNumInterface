import React from 'react';
import { FaTimes } from 'react-icons/fa';

interface RocketBoxProps {
  index: number;
  value: number;
  onDelete: () => void;
}

const RocketBox: React.FC<RocketBoxProps> = ({ index, value, onDelete }) => {
  return (
    <div className="rocket-box">
      <span className="rocket-label">a_{index}</span>
      <span className="rocket-value">{value}</span>
      <button onClick={onDelete} className="delete-button">
        <FaTimes />
      </button>
    </div>
  );
};

export default RocketBox;
