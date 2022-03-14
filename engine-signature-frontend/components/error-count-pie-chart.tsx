import { SoundBarsInterface } from './soundbars';
import { Card, Alert } from 'ui-neumorphism';
import { useState, useEffect } from 'react';
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const acc = (a: number[], b: number[]) => {
  return a.map((e, i) => e + b[i]);
};

export default function ErrorCountPieChart({ data, threshold = 0.9 }: SoundBarsInterface) {
  const [errorCounts, updateErrorCounts] = useState<number[]>(Array(data.length).fill(0));
  useEffect(() => {
    if (!errorCounts.length) {
      updateErrorCounts(Array(data.length).fill(0));
    }
  }, [data, errorCounts.length]);

  useEffect(() => {
    const addiition = data.map((point) => (point > threshold ? 1 : 0));
    updateErrorCounts((c) => {
      const result = acc(c, addiition);
      return result;
    });
  }, [data, threshold]);

  const dataGroup = errorCounts.map((value, index) => {
    return { name: `Feature-${index + 1}`, value: value };
  });
  return (
    <Card className='pb-4'>
      <h2 className='p-4'>Number of Errors Encountered</h2>
      <p className='p-1 pl-4 text-sm text-slate-600'>
        Note that Changing The Error Threshold will cause these values to display incorrectly
      </p>
      {dataGroup.length ? (
        <ResponsiveContainer width='100%' height={300}>
          <PieChart width={400} height={400}>
            <Pie
              dataKey='value'
              isAnimationActive={false}
              data={dataGroup}
              cx='50%'
              cy='50%'
              outerRadius={80}
              label
              fill='#9008ff'
            />
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className='h-36 text-center pt-11'>Waiting For Data</p>
      )}
    </Card>
  );
}
