import React from 'react';
import ComparationFrameBox from './ComparationFrameBox';
import { ComparationFrame } from '../App';

interface ComparationFrameBoxListProps {
  frames: ComparationFrame[];
}

const ComparationFrameBoxList: React.FC<ComparationFrameBoxListProps> = ({ frames }) => {
  return (
    <div className="comparation-frame-box-list">
      {frames.map((frame, index) => (
        <ComparationFrameBox key={index} frame={frame} />
      ))}
    </div>
  );
};

export default ComparationFrameBoxList;
