import React, { useState, useEffect } from 'react';

interface EpsolonBoxProps {
  value: number;
  onChange: (value: number) => void;
}

const EpsolonBox: React.FC<EpsolonBoxProps> = ({ value, onChange }) => {
  // Converte o valor atual para mantissa e expoente
  const valueToScientific = (num: number) => {
    if (num === 0) return { mantissa: 0, exponent: 0 };
    
    const expString = num.toExponential();
    const [mantissaStr, exponentStr] = expString.split('e');
    
    return {
      mantissa: parseInt(mantissaStr),
      exponent: parseInt(exponentStr, 10)
    };
  };

  const scientific = valueToScientific(value);
  const [mantissa, setMantissa] = useState(scientific.mantissa);
  const [exponent, setExponent] = useState(scientific.exponent);

  // Atualiza quando o valor externo muda
  /*
  useEffect(() => {
    const scientific = valueToScientific(value);
    setMantissa(scientific.mantissa);
    setExponent(scientific.exponent);
  }, [value]);
  */

  // Atualiza o valor quando mantissa ou expoente mudam
  const updateValue = (newMantissa: number, newExponent: number) => {
    const newValue = newMantissa * Math.pow(10, newExponent);
    onChange(newValue);
  };

  const handleMantissaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMantissa = parseInt(e.target.value) || 0;
    setMantissa(newMantissa);
    updateValue(newMantissa, exponent);
  };

  const handleExponentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newExponent = parseInt(e.target.value) || 0;
    setExponent(newExponent);
    updateValue(mantissa, newExponent);
  };

  return (
    <div className="epsolon-box">
      <label>Erro máximo:</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <input
          type="number"
          step="any"
          value={mantissa}
          onChange={handleMantissaChange}
          placeholder="Mantissa"
          style={{ width: '80px' }}
        />
        <span>×10 ^ </span>
        <sup>
          <input
            type="number"
            step="1"
            value={exponent}
            onChange={handleExponentChange}
            placeholder="Exp"
            style={{ width: '80px' }}
          />
        </sup>
      </div>
    </div>
  );
};

export default EpsolonBox;