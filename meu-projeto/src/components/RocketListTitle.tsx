import React from 'react';

interface RocketListTitleProps {
  count: number;
}

const RocketListTitle: React.FC<RocketListTitleProps> = ({ count }) => {
  return (
    <div className="rocket-list-title">
      <h2>Foguetes</h2>
      <p>Quantidade: {count}</p>
    </div>
  );
};

export default RocketListTitle;
