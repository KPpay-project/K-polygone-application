import { AlertTriangle, Clock, Info } from 'lucide-react';
import { Verify } from 'iconsax-reactjs';
type AlertState = 'success' | 'warning' | 'pending' | 'info';

interface InterfaceAlertProps {
  state: AlertState;
  title: string;
  description: string;
}

const stateTheme: Record<AlertState, { bg: string; text: string; icon: JSX.Element }> = {
  success: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    icon: <Verify className=" text-green-600" />
  },
  warning: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-600',
    icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />
  },
  pending: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    icon: <Clock className="h-5 w-5 text-blue-600" />
  },
  info: {
    bg: 'bg-sky-50',
    text: 'text-sky-600',
    icon: <Info className="h-5 w-5 text-sky-600" />
  }
};

const InterfaceAlert = ({ state, title, description }: InterfaceAlertProps) => {
  const { bg, text, icon } = stateTheme[state];

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl w-[90%] ${bg}`}>
      <div className="shrink-0">{icon}</div>
      <div>
        <h4 className={`font-semibold ${text}`}>{title}</h4>
        <p className={`${text}`}>{description}</p>
      </div>
    </div>
  );
};

export { InterfaceAlert };
