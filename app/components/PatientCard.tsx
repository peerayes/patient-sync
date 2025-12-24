import { supabase } from "@/app/lib/supabase";
import { Patient } from "@/app/types/patient";
import {
  formatPhoneNumberWithSpace,
  validatePhoneNumber,
} from "@/app/utils/formatPhone";
import { validateEmail } from "@/app/utils/validators";
import { Cake, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import StatusBadge from "./StatusBadge";

interface PatientCardProps {
  patient: Patient;
  onDelete?: () => void;
}

export default function PatientCard({ patient, onDelete }: PatientCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const updated = new Date(timestamp);
    const diffInSeconds = Math.floor(
      (now.getTime() - updated.getTime()) / 1000
    );

    if (diffInSeconds < 10) return "just now";
    if (diffInSeconds < 60) return `${diffInSeconds} secs ago`;

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60)
      return `${diffInMinutes} min${diffInMinutes > 1 ? "s" : ""} ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  };

  // Validate phone and email
  const phoneValidation = validatePhoneNumber(patient.phone);
  const emailValidation = validateEmail(patient.email);

  const handleDelete = async () => {
    if (
      !confirm(
        `ต้องการลบข้อมูลของ ${patient.first_name} ${patient.last_name} ใช่หรือไม่?`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("patients")
        .delete()
        .eq("id", patient.id);

      if (error) throw error;

      // Call onDelete callback if provided
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error("Error deleting patient:", error);
      alert("ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-3">
        <div className="mb-1">
          <h3 className="text-2xl font-semibold text-gray-900">
            {patient.first_name} {patient.middle_name} {patient.last_name}
          </h3>
          <p className="text-xs text-gray-500">ID: {patient.session_id}</p>
        </div>
        <StatusBadge status={patient.status} />
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">
            <Phone className="w-4 h-4" />
          </span>
          <span className="text-gray-700">
            {formatPhoneNumberWithSpace(patient.phone)}
          </span>
          {!phoneValidation.isValid && (
            <span className="text-red-500 text-xs ml-2">
              Invalid phone format
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-500">
            <Mail className="w-4 h-4" />
          </span>
          <span className="text-gray-700">{patient.email}</span>
          {!emailValidation.isValid && (
            <span className="text-red-500 text-xs ml-2">
              Invalid email format
            </span>
          )}
        </div>

        {patient.date_of_birth && (
          <div className="flex items-center gap-2">
            <span className="text-gray-500">
              <Cake className="w-4 h-4" />
            </span>
            <span className="text-gray-700">
              {new Date(patient.date_of_birth).toLocaleDateString("th-TH")}
            </span>
          </div>
        )}

        {patient.address && (
          <div className="flex items-center gap-2">
            <span className="text-gray-500">
              <MapPin className="w-4 h-4" />
            </span>
            <span className="text-gray-700 line-clamp-1">
              {patient.address}
            </span>
          </div>
        )}
      </div>

      <div className="mt-2 pt-3 border-t border-gray-100 flex justify-between items-center">
        <p className="text-xs text-gray-400">
          Updated: {getTimeAgo(patient.updated_at)}
        </p>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`text-xs px-3 py-1 rounded-full cursor-pointer ${
            isDeleting
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-red-50 text-red-500 border border-red-200"
          }`}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
