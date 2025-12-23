import { Patient } from '@/app/types/patient';
import StatusBadge from './StatusBadge';

interface PatientCardProps {
  patient: Patient;
}

export default function PatientCard({ patient }: PatientCardProps) {
  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const updated = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - updated.getTime()) / 1000);

    if (diffInSeconds < 10) return 'just now';
    if (diffInSeconds < 60) return `${diffInSeconds} secs ago`;

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {patient.first_name} {patient.middle_name} {patient.last_name}
          </h3>
          <p className="text-sm text-gray-500">ID: {patient.session_id}</p>
        </div>
        <StatusBadge status={patient.status} />
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">📞</span>
          <span className="text-gray-700">{patient.phone}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-500">📧</span>
          <span className="text-gray-700">{patient.email}</span>
        </div>

        {patient.date_of_birth && (
          <div className="flex items-center gap-2">
            <span className="text-gray-500">🎂</span>
            <span className="text-gray-700">
              {new Date(patient.date_of_birth).toLocaleDateString('th-TH')}
            </span>
          </div>
        )}

        {patient.address && (
          <div className="flex items-center gap-2">
            <span className="text-gray-500">📍</span>
            <span className="text-gray-700 line-clamp-1">{patient.address}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          Updated: {getTimeAgo(patient.updated_at)}
        </p>
      </div>
    </div>
  );
}
