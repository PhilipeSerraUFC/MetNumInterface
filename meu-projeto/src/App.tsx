import React, { useState } from 'react';
import './App.css';
import RocketListTitle from './components/RocketListTitle';
import AddRocket from './components/AddRocket';
import RocketList from './components/RocketList';
import EpsolonBox from './components/EpsolonBox';
import TitleBox from './components/TitleBox';
import ComparationFrameBoxList from './components/ComparationFrameBoxList';
import MaxIterBox from './components/MaxIterBox';
import Module from '../RootFinders/main.js'

export type ComparationFrame = (string | number)[][];

function App() {
  const [a_foguetes, setAFoguetes] = useState<number[]>([]);
  const [epsolon, setEpsolon] = useState(0);
  const [max_iter, setMaxIter] = useState(100);
  const [comparationFrameList, setComparationFrameList] = useState<ComparationFrame[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addRocket = (value: number) => {
    setAFoguetes(prev => [...prev, value]);
  };

  const deleteRocket = (index: number) => {
    setAFoguetes(prev => prev.filter((_, i) => i !== index));
  };

  const handleStart = async () => {
    if (a_foguetes.length === 0) {
      alert('Adicione pelo menos um foguete antes de iniciar!');
      return;
    }

    setIsLoading(true);
    try {
      // Carrega o módulo WebAssembly
      const wasmModule = await Module();

      // Cria um vetor de doubles para passar ao C++
      const vectorDouble = new wasmModule.VectorDouble();
      a_foguetes.forEach(value => vectorDouble.push_back(value));

      // Chama a função comparative_boards do C++
      const boards = wasmModule.comparative_boards(vectorDouble, epsolon, max_iter);

      // Converte o resultado 3D em ComparationFrame[]
      const newFrames: ComparationFrame[] = [];
      for (let i = 0; i < boards.size(); i++) {
        const board = boards.get(i);
        const frame: ComparationFrame = [];

        const numCols = board.size(); // 4 colunas (texto + 3 métodos)
        const numRows = board.get(0).size(); // 6 linhas

        for (let row = 0; row < numRows; row++) {
          const frameRow: (string | number)[] = [];
          for (let col = 0; col < numCols; col++) {
            const column = board.get(col);
            const value = column.get(row);

            // Tenta converter para número, senão mantém como string
            const numValue = parseFloat(value);
            if (!isNaN(numValue) && row >= 2 && col >= 1) {
              // Valores numéricos (a partir da linha 2, colunas de métodos)
              frameRow.push(numValue);
            } else {
              // Mantém como string (headers e labels)
              frameRow.push(value);
            }
          }
          frame.push(frameRow);
        }

        newFrames.push(frame);
      }

      setComparationFrameList(newFrames);

      // Limpa os vetores do C++
      vectorDouble.delete();
      boards.delete();
    } catch (error) {
      console.error('Erro ao executar WebAssembly:', error);
      alert('Erro ao processar os dados. Verifique o console.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="main-layout">
        {/* Coluna Esquerda - Foguetes */}
        <div className="left-section">
          <RocketListTitle />
          <AddRocket onAdd={addRocket} />
          <RocketList rockets={a_foguetes} onDelete={deleteRocket} />
        </div>

        {/* Coluna Direita - Controles e Comparações */}
        <div className="right-section">
          {/* Linha superior com controles horizontais */}
          <div className="top-controls">
            <button  
            className="start-button" 
            onClick={handleStart}
            disabled={isLoading || a_foguetes.length === 0}
          >
            {isLoading ? 'Processando...' : 'Start'}
          </button>
            <EpsolonBox value={epsolon} onChange={setEpsolon} />
            <MaxIterBox value={max_iter} onChange={setMaxIter} />
            <TitleBox onStart={handleStart} isLoading={isLoading}>
              {isLoading ? 'Processando...' : 'Start'}
            </TitleBox>
          </div>

          {/* Lista de comparações abaixo dos controles */}
          <ComparationFrameBoxList frames={comparationFrameList} />
        </div>
      </div>
    </div>
  );
}

export default App;