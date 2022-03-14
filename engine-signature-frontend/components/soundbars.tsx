import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';

export interface SoundBarsInterface {
  data: number[];
  threshold?: number;
}

export default function SoundBars({ data, threshold = 0.9 }: SoundBarsInterface): JSX.Element {
  const dataMap = data.map((d, index) => {
    return {
      name: `Feature-${index + 1}`,
      Presence: d,
    };
  });
  return (
    <ResponsiveContainer width='100%' height={300}>
      <BarChart width={500} height={300} data={dataMap}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='name' />
        <YAxis type='number' />
        <Tooltip />
        <Legend />
        <Bar dataKey='Presence' stackId='a' label={`${data}`}>
          {' '}
          {data.map((_entry, index) => (
            <Cell key={Math.random()} fill={data[index] > threshold ? '#ff4242' : '#7aa4ff'} />
          ))}
        </Bar>
        <ReferenceLine
          y={threshold}
          stroke='black'
          label={`Error=${threshold}`}
          strokeWidth='5 5'
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
