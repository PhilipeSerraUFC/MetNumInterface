import React from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface ComparationFrameBoxProps {
  frame: (string | number)[][];
  index: number;
}

const ComparationFrameBox: React.FC<ComparationFrameBoxProps> = ({ frame, index }) => {
  // Função para renderizar células com LaTeX
  const renderCell = (value: string | number) => {
    const valueStr = String(value);

    // Detecta se tem LaTeX inline \(...\)
    if (valueStr.includes('\\(') && valueStr.includes('\\)')) {
        const parts = valueStr.split(/(\\\(.*?\\\))/g);
      return (
        <>
          {parts.map((part, idx) => {
            if (part.startsWith('\\(') && part.endsWith('\\)')) {
              // Remove \( e \) e renderiza LaTeX
              const latex = part.slice(2, -2);
              return <InlineMath key={idx} math={latex} />;
            }
            return <span key={idx}>{part}</span>;
          })}
        </>
      );
    }

    return valueStr;
  };

  return (
    <div className="comparation-frame-box">
      <h3>Foguete {index + 1}</h3>
      <table>
        <tbody>
          {frame.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell, cellIdx) => {
                const isTextCell = rowIdx === 0 || cellIdx === 0;
                return (
                  <td 
                    key={cellIdx} 
                    className={isTextCell ? 'text-cell' : 'number-cell'}
                  >
                    {renderCell(cell)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComparationFrameBox;