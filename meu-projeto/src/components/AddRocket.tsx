import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

interface AddRocketProps {
  onAdd: (value: number) => void;
}

const AddRocket: React.FC<AddRocketProps> = ({ onAdd }) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleAdd = () => {
    const num = parseFloat(inputValue);
    if (!isNaN(num)) {
      onAdd(num);
      setInputValue('');
    }
  };

  return (
    <div className="add-rocket">
      <label>Adicionar Foguete?</label>
      <input
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Número"
      />
      <button onClick={handleAdd} className="add-button">
        <FaPlus />
      </button>
    </div>
  );
};

export default AddRocket;
