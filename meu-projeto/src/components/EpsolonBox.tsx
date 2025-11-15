import React from 'react';

interface EpsolonBoxProps {
  value: number;
  onChange: (value: number) => void;
}

const EpsolonBox: React.FC<EpsolonBoxProps> = ({ value, onChange }) => {
  return (
    <div className="epsolon-box">
      <label>Epsolon:</label>
      <input
        type="number"
        step="any"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      />
    </div>
  );
};

export default EpsolonBox;
