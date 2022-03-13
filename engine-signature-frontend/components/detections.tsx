import { SoundBarsInterface } from './soundbars';
import { Card, Alert } from 'ui-neumorphism';

export default function Detection({ data, threshold = 0.9 }: SoundBarsInterface): JSX.Element {
  const dataMap = data.map((d, index) => {
    return {
      name: `Feature-${index + 1}`,
      Presence: d,
    };
  });
  return (
    <div>
      <h2 className='pb-4'>Detections</h2>
      <Card inset>
        <div className='flex p-4 space-x-4'>
          {dataMap.map((source) => {
            const hasError = source.Presence > threshold;
            return (
              <Alert
                key={source.name}
                type={hasError ? 'error' : 'info'}
                border='bottom'
                flat={!hasError}
              >
                {source.name}
              </Alert>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
