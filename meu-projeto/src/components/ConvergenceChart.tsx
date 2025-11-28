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
import type { ComparationFrame } from '../App';

interface ConvergenceChartProps {
  a_foguetes: number[];
  comparationFrameList: ComparationFrame[];
}

interface DataPoint {
  a: number;
  avgValue: number;
  converged: boolean;
}

const ConvergenceChart: React.FC<ConvergenceChartProps> = ({
  a_foguetes,
  comparationFrameList
}) => {
  const extractConvergenceData = (frame: ComparationFrame) => {
    const xRow = frame[2];
    const convergenceRow = frame[5];
    const convergedValues: number[] = [];

    for (let col = 1; col < xRow.length; col++) {
      const convergenceStatus = convergenceRow[col];
      const hasConverged = typeof convergenceStatus === 'string' &&
        convergenceStatus.toLowerCase().includes('sim');

      if (hasConverged) {
        const xValue = xRow[col];
        let numValue: number;

        if (typeof xValue === 'string') {
          let cleanValue = xValue.trim();
          cleanValue = cleanValue.replace(/^\\\(/, '').replace(/\\\)$/, '');

          const scientificRegex = /([-+]?\d+\.?\d*)\s*\\times\s*10\^?\{?([-+]?\d+)\}?/;
          const match = cleanValue.match(scientificRegex);

          if (match) {
            const mantissa = parseFloat(match[1]);
            const exponent = parseInt(match[2], 10);
            numValue = mantissa * Math.pow(10, exponent);
          } else {
            cleanValue = cleanValue
              .replace(/[×x]\s*10\^?\{?([-+]?\d+)\}?/gi, 'e$1')
              .replace(/\\/g, '')
              .trim();
            numValue = parseFloat(cleanValue);
          }
        } else if (typeof xValue === 'number') {
          numValue = xValue;
        } else {
          numValue = Number(xValue);
        }

        if (!isNaN(numValue) && isFinite(numValue)) {
          convergedValues.push(numValue);
        }
      }
    }

    return convergedValues;
  };

  const processData = () => {
    const convergedData: DataPoint[] = [];
    const notConvergedData: DataPoint[] = [];

    for (let i = 0; i < a_foguetes.length && i < comparationFrameList.length; i++) {
      const a = a_foguetes[i];
      const frame = comparationFrameList[i];
      const convergedValues = extractConvergenceData(frame);

      if (convergedValues.length > 0) {
        const average = convergedValues.reduce((sum, val) => sum + val, 0) / convergedValues.length;
        convergedData.push({ a, avgValue: average, converged: true });
      } else {
        notConvergedData.push({ a, avgValue: 0, converged: false });
      }
    }

    return { convergedData, notConvergedData };
  };

  const { convergedData, notConvergedData } = processData();

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
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
          <p style={{ margin: 0 }}>
            <strong>Média x:</strong> {data.avgValue.toExponential(4)}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Status:</strong> {data.converged ? 'Convergiu' : 'Não convergiu'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Valor médio do deslocamento pelo parâmetro a
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
            label={{ value: 'Valor de a', position: 'insideBottom', offset: -10 }}
          />
          <YAxis
            type="number"
            dataKey="avgValue"
            name="Média x"
            label={{ value: 'Média de x convergido', angle: -90, position: 'insideLeft' }}
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

export default ConvergenceChart;
