import { Chip } from 'ui-neumorphism';

export default function RecordingStatus({ state = false }: { state?: boolean }): JSX.Element {
  return (
    <Chip>
      <div className='pr-2'>
        <div
          className={`h-4 w-4 ${state ? 'bg-red-600 animate-pulse' : 'bg-gray-400'} rounded-full`}
        ></div>
      </div>
      <span>{state ? 'ON' : 'OFF'}</span>
    </Chip>
  );
}
