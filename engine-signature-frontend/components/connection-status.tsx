import { ConnnectionStates } from '../local';

const style: Record<ConnnectionStates, string> = {
  CLOSED: 'text-blue-700',
  LISTENING: 'text-green-700',
  CLOSING: 'text-blue-900',
  ERROR: 'text-red-900',
};

export default function ConnectionStatus({ status }: { status: ConnnectionStates }) {
  return (
    <div className={`${style[status]} bg-slate-100 rounded-full p-2`}>
      <span>{status}</span>
    </div>
  );
}
