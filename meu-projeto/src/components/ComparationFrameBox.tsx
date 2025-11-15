import React from 'react';
import { ComparationFrame } from '../App';

interface ComparationFrameBoxProps {
  frame: ComparationFrame;
}

const ComparationFrameBox: React.FC<ComparationFrameBoxProps> = ({ frame }) => {
  return (
    <div className="comparation-frame-box">
      <table>
        <tbody>
          {frame.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className={typeof cell === 'string' ? 'text-cell' : 'number-cell'}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComparationFrameBox;
