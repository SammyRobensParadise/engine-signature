import { Button } from 'ui-neumorphism';

export default function EmergencyShutdownMessage({
  dismiss,
  autoShutoff,
}: {
  dismiss: () => void;
  autoShutoff: boolean;
}): JSX.Element {
  function handleEmergencyShutdown() {
    console.log('SHUTDOWN MACHINE');
  }
  if (autoShutoff) {
    handleEmergencyShutdown();
  }

  return (
    <div className='p-4 space-y-4'>
      <button
        onClick={handleEmergencyShutdown}
        className='w-full text-white h-24 rounded-md shadow-lg font-semibold text-3xl emerg-shutoff '
      >
        SHUTDOWN
      </button>
      <Button onClick={() => dismiss()} depressed>
        Dismiss
      </Button>
    </div>
  );
}
