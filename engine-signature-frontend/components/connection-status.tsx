import { ConnnectionStates } from '../local';
import { Chip } from 'ui-neumorphism';
const style: Record<ConnnectionStates, 'success' | 'info' | 'warning' | 'error'> = {
  CLOSED: 'info',
  LISTENING: 'success',
  CLOSING: 'warning',
  ERROR: 'error',
  OPEN: 'success',
};

export default function ConnectionStatus({ status }: { status: ConnnectionStates }) {
  return (
    <Chip type={style[status]}>
      <span>{status}</span>
    </Chip>
  );
}
