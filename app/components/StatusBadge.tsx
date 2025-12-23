import { PatientStatus } from '@/app/types/patient';

interface StatusBadgeProps {
  status: PatientStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'filling':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'submitted':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'filling':
        return '🟢';
      case 'submitted':
        return '✅';
      case 'inactive':
        return '⚪';
      default:
        return '⚪';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'filling':
        return 'Filling';
      case 'submitted':
        return 'Submitted';
      case 'inactive':
        return 'Inactive';
      default:
        return status;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyles()}`}
    >
      <span>{getStatusIcon()}</span>
      <span>{getStatusText()}</span>
    </span>
  );
}
