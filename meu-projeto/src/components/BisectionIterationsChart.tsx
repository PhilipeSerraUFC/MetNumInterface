import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { ComparationFrame } from '../App';

interface BisectionIterationsChartProps {
  a_foguetes: number[];
  comparationFrameList: ComparationFrame[];
}

interface DataPoint {
  a: number;
  iterations: number;
  converged: boolean;
}

const BisectionIterationsChart: React.FC<BisectionIterationsChartProps> = ({
  a_foguetes,
  comparationFrameList
}) => {
  const extractIterationsData = (frame: ComparationFrame, methodColumn: number) => {
    const iterationsRow = frame[6];
    const convergenceRow = frame[5];
    const iterationsValue = iterationsRow[methodColumn];
    const convergenceStatus = convergenceRow[methodColumn];

    let iterations: number;
    if (typeof iterationsValue === 'string') {
      let cleanValue = iterationsValue.trim().replace(/^\\\(/, '').replace(/\\\)$/, '');
      iterations = parseInt(cleanValue, 10);
    } else {
      iterations = Number(iterationsValue);
    }

    const hasConverged = typeof convergenceStatus === 'string' &&
      convergenceStatus.toLowerCase().includes('sim');

    return { iterations, hasConverged };
  };

  const processData = () => {
    const convergedData: DataPoint[] = [];
    const notConvergedData: DataPoint[] = [];
    const methodColumn = 1; // Bissecção

    for (let i = 0; i < a_foguetes.length && i < comparationFrameList.length; i++) {
      const a = a_foguetes[i];
      const frame = comparationFrameList[i];

      try {
        const { iterations, hasConverged } = extractIterationsData(frame, methodColumn);
        
        if (!isNaN(iterations) && isFinite(iterations)) {
          const dataPoint: DataPoint = { a, iterations, converged: hasConverged };
          
          if (hasConverged) {
            convergedData.push(dataPoint);
          } else {
            notConvergedData.push(dataPoint);
          }
        }
      } catch (error) {
        console.error(`Erro ao processar dados para a=${a}:`, error);
      }
    }

    return { convergedData, notConvergedData };
  };

  const { convergedData, notConvergedData } = processData();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as DataPoint;
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <p style={{ margin: 0 }}><strong>a:</strong> {data.a}</p>
          <p style={{ margin: 0 }}><strong>Iterações:</strong> {data.iterations}</p>
          <p style={{ margin: 0 }}><strong>Status:</strong> {data.converged ? 'Convergiu' : 'Não convergiu'}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Método de Bissecção - Iterações
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 30, bottom: 60, left: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="a"
            name="a"
            label={{ value: 'Parâmetro a', position: 'insideBottom', offset: -10 }}
          />
          <YAxis
            type="number"
            dataKey="iterations"
            name="Iterações"
            label={{ value: 'Número de Iterações', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{ paddingBottom: '20px' }}
          />
          <Scatter
            name="Convergiu"
            data={convergedData}
            fill="#2563eb"
            shape="circle"
            r={6}
          />
          <Scatter
            name="Não Convergiu"
            data={notConvergedData}
            fill="#dc2626"
            shape="circle"
            r={6}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BisectionIterationsChart;
