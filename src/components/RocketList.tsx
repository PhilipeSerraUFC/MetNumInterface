import React from 'react';
import RocketBox from './RocketBox';

interface RocketListProps {
  rockets: number[];
  onDelete: (index: number) => void;
}

const RocketList: React.FC<RocketListProps> = ({ rockets, onDelete }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      maxHeight: '1000px',
      overflowY: 'auto',
      paddingRight: '8px',
      borderRadius: '8px'
    }}>
      {rockets.map((value, index) => (
        <RocketBox
          key={index}
          value={value}
          index = {index}
          onDelete={() => onDelete(index)}
        />
      ))}
    </div>
  );
};

export default RocketList;
