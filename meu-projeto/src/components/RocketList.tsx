import React from 'react';
import RocketBox from './RocketBox';

interface RocketListProps {
  rockets: number[];
  onDelete: (index: number) => void;
}

const RocketList: React.FC<RocketListProps> = ({ rockets, onDelete }) => {
  return (
    <div className="rocket-list">
      {rockets.map((value, index) => (
        <RocketBox
          key={index}
          index={index}
          value={value}
          onDelete={() => onDelete(index)}
        />
      ))}
    </div>
  );
};

export default RocketList;
