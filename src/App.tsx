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
import ConvergenceChart from './components/ConvergenceChart.js';
import FalsePositionIterationsChart from './components/FalsePositionIterationsChart.js';
import BisectionIterationsChart from './components/BisectionIterationsChart.js';
import NewtonRaphsonIterationsChart from './components/NewtonRaphsonIterationsChart.js';

export type ComparationFrame = (string | number)[][];

// Função para converter número em notação científica LaTeX
const toScientificNotationLatex = (num: number): string => {
  const expString = num.toExponential(3); // Formato: 1.23e+4
  const [mantissa, exponent] = expString.split('e');
  const exp = parseInt(exponent, 10);

  if (exp === 0) {
    // Se expoente é 0, retorna apenas a mantissa em LaTeX
    return `\\(${mantissa}\\)`;
  }

  // Retorna em formato LaTeX: \(m 	imes 10^{t}\)
  return `\\(${mantissa} \\times 10^{${exp}}\\)`;
};

// Função para processar strings que contêm números e converter para LaTeX
const formatNumbersInStringLatex = (str: string): string => {
  // Detecta padrão x_N = valor (onde N é um número subscrito)
  const subscriptPattern = /x_(\d+)\s*=\s*([-]?\d+\.?\d*(?:[eE][+-]?\d+)?)/g;
  
  // Primeiro, processa o padrão x_N = valor
  let result = str.replace(subscriptPattern, (match, subscript, value) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      const latexValue = toScientificNotationLatex(num);
      // Remove os delimitadores \( \) do valor convertido
      const cleanLatexValue = latexValue.replace(/^\\\(/, '').replace(/\\\)$/, '');
      return `\\(x_{${subscript}} = ${cleanLatexValue}\\)`;
    }
    return match;
  });
  
  // Depois, processa números restantes que não fazem parte de x_N
  // Evita converter números que estão após x_
  const numberRegex = /(?<!x_)(-?\d+\.?\d*(?:[eE][+-]?\d+)?)/g;
  
  result = result.replace(numberRegex, (match) => {
    // Verifica se já está dentro de um bloco LaTeX
    const beforeMatch = result.substring(0, result.indexOf(match));
    const openParens = (beforeMatch.match(/\\\(/g) || []).length;
    const closeParens = (beforeMatch.match(/\\\)/g) || []).length;
    
    // Se está dentro de um bloco LaTeX, não converte novamente
    if (openParens > closeParens) {
      return match;
    }
    
    const num = parseFloat(match);
    if (!isNaN(num)) {
      return toScientificNotationLatex(num);
    }
    return match;
  });
  
  return result;
};

function App() {
  const [a_foguetes, setAFoguetes] = useState<number[]>([]);
  const [epsolon, setEpsolon] = useState(0.0001);
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

            // Linha 0 (headers) - mantém como está
            if (row === 0) {
              frameRow.push(value);
              continue;
            }

            // Coluna 0 (labels das linhas) - mantém como está
            if (col === 0) {
              frameRow.push(value);
              continue;
            }

            // Linha 1 (intervalo ou x0) - processa strings com números em LaTeX
            if (row === 1) {
              frameRow.push(formatNumbersInStringLatex(value));
              continue;
            }

            // Linhas 2-6 e colunas 1+ - valores numéricos em LaTeX
            if(row <= 5){

              const numValue = parseFloat(value);
              if (!isNaN(numValue)) {
              frameRow.push(toScientificNotationLatex(numValue));
              } else {
              // Se não for número, tenta processar como string com números
                frameRow.push(formatNumbersInStringLatex(value));
              }
            }

            if(row == 6){
              frameRow.push(value)
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

  const StartButton = () => {
    return (
          <button  
            className="start-button" 
            onClick={handleStart}
            disabled={isLoading || a_foguetes.length === 0}
          >
            {isLoading ? 'Processando...' : 'Start'}
          </button>
    )
  }

  //console.log(comparationFrameList[1][2][2])

  return (
    <div className="app-container">
      <div className="main-layout">
        {/* Coluna Esquerda - Foguetes */}
        <div className="left-section">
          <RocketListTitle count={a_foguetes.length} />
          <AddRocket onAdd={addRocket} />
          <RocketList rockets={a_foguetes} onDelete={deleteRocket} />
        </div>

        {/* Coluna Direita - Controles e Comparações */}
        <div className="right-section">
          {/* Linha superior com controles horizontais */}
          <div className="top-controls">
            <StartButton/>
            <EpsolonBox value={epsolon} onChange={setEpsolon} />
            <MaxIterBox value={max_iter} onChange={setMaxIter} />
            <TitleBox onStart={handleStart} isLoading={isLoading}>
              {isLoading ? 'Processando...' : 'Start'}
            </TitleBox>
          </div>

          {/* Lista de comparações abaixo dos controles */}
          <ComparationFrameBoxList frames={comparationFrameList} />
          

          {/* Gráficos */}

        </div>
            <div className= "graphs-section">
          <ConvergenceChart a_foguetes={a_foguetes} comparationFrameList={comparationFrameList}/>      
          <FalsePositionIterationsChart a_foguetes={a_foguetes} comparationFrameList={comparationFrameList} />
          <BisectionIterationsChart a_foguetes={a_foguetes} comparationFrameList={comparationFrameList} />
          <NewtonRaphsonIterationsChart a_foguetes={a_foguetes} comparationFrameList={comparationFrameList} />
          </div>
        </div>


    </div>
  );
}

export default App;