import React, { useState } from 'react';
import './App.css';
import RocketListTitle from './components/RocketListTitle';
import AddRocket from './components/AddRocket';
import RocketList from './components/RocketList';
import EpsolonBox from './components/EpsolonBox';
import TitleBox from './components/TitleBox';
import ComparationFrameBoxList from './components/ComparationFrameBoxList';

export type ComparationFrame = (string | number)[][];

function App() {
  const [a_foguetes, setAFoguetes] = useState<number[]>([]);
  const [epsolon, setEpsolon] = useState<number>(0);
  const [comparationFrameList, setComparationFrameList] = useState<ComparationFrame[]>([]);

  const addRocket = (value: number) => {
    setAFoguetes(prev => [...prev, value]);
  };

  const deleteRocket = (index: number) => {
    setAFoguetes(prev => prev.filter((_, i) => i !== index));
  };

  const handleStart = () => {
    const newFrames: ComparationFrame[] = a_foguetes.map((value, index) => {
      const frame: ComparationFrame = [];
      
      frame[0] = [`a_${index}`, 'Col1', 'Col2', 'Col3', 'Col4', 'Col5'];
      frame[1] = ['Row1', 'Text1', 'Text2', 'Text3', 'Text4', 'Text5'];
      
      for (let i = 2; i < 6; i++) {
        frame[i] = [`Row${i}`, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100];
      }
      
      return frame;
    });
    
    setComparationFrameList(newFrames);
  };

  return (
    <div className="app-container">
      <div className="main-layout">
        {/* Coluna Esquerda - Foguetes */}
        <aside className="left-section">
          <RocketListTitle count={a_foguetes.length} />
          <AddRocket onAdd={addRocket} />
          <RocketList 
            rockets={a_foguetes} 
            onDelete={deleteRocket} 
          />
        </aside>
        
        {/* Coluna Direita - Comparações */}
        <main className="right-section">
          <div className="top-controls">
            <EpsolonBox value={epsolon} onChange={setEpsolon} />
            <TitleBox />
          </div>
          
          <button className="start-button" onClick={handleStart}>
            Start
          </button>
          
          <ComparationFrameBoxList frames={comparationFrameList} />
        </main>
      </div>
    </div>
  );
}

export default App;
