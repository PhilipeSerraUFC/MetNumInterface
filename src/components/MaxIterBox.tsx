import React from 'react';

interface MaxIterBoxProps {
  value: number;
  onChange: (value: number) => void;
}

const MaxIterBox: React.FC<MaxIterBoxProps> = ({ value, onChange }) => {
  return (
    <div className="max-iter-box">
      <label>Quantidade máxima de Interações:</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
      />
    </div>
  );
};

export default MaxIterBox;
