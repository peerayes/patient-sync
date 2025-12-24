"use client";

import PatientCard from "@/app/components/PatientCard";
import { supabase } from "@/app/lib/supabase";
import { Patient } from "@/app/types/patient";
import {
  Ambulance,
  Check,
  CloudSync,
  Database,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function StaffPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    // Initial fetch
    fetchPatients();

    // Subscribe to real-time changes
    const channel = supabase
      .channel("patients-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "patients",
        },
        (payload) => {
          console.log("Real-time update:", payload);
          setIsLive(true);
          setTimeout(() => setIsLive(false), 2000);
          fetchPatients();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;

      setPatients(data || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fillingPatients = patients.filter((p) => p.status === "filling");
  const submittedPatients = patients.filter((p) => p.status === "submitted");
  const totalPatients = submittedPatients.length + fillingPatients.length;

  return (
    <div className="min-h-screen bg-gray-50 border-t-32 border-blue-600">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white shadow-xs rounded-lg p-6 mb-6">
          <div className="flex flex-col-reverse md:flex-row justify-between md:items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="bg-blue-600 p-2 rounded-xl">
                <ShieldCheck className="w-10 h-10 text-white" />
              </span>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Staff Dashboard
                </h1>
                <p className="text-xs md:text-sm text-gray-500">
                  Real-time patient monitoring
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  isLive ? "bg-red-100" : "bg-gray-100"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    isLive ? "bg-red-500 animate-pulse" : "bg-gray-400"
                  }`}
                />
                <span
                  className={`font-medium ${
                    isLive ? "text-red-700" : "text-gray-600"
                  }`}
                >
                  {isLive ? "Live Update" : "Connected"}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white border-2 border-green-600 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">Submitted</p>
                  <p className="text-3xl font-bold text-green-800">
                    {submittedPatients.length}
                  </p>
                </div>
                <Check className="w-10 h-10 text-green-600" />
              </div>
            </div>

            <div className="bg-white border-2 border-orange-400 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-700">Filling</p>
                  <p className="text-3xl font-bold text-yellow-800">
                    {fillingPatients.length}
                  </p>
                </div>
                <CloudSync className="w-10 h-10 text-orange-400" />
              </div>
            </div>

            <div className="bg-white border-2 border-blue-600 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">Total</p>
                  <p className="text-3xl font-bold text-blue-800">
                    {totalPatients}
                  </p>
                </div>
                <Database className="w-10 h-10 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filling Patients */}
        {fillingPatients.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CloudSync className="w-6 h-6 text-orange-600" />
              <span>Filling ({fillingPatients.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fillingPatients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onDelete={fetchPatients}
                />
              ))}
            </div>
          </div>
        )}

        {/* Submitted Patients */}
        {submittedPatients.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Check className="w-6 h-6 text-green-600" />
              <span>Submitted ({submittedPatients.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {submittedPatients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onDelete={fetchPatients}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {patients.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <span className="mb-4 bg-blue-600 p-4 rounded-full flex items-center justify-center w-16 h-16 mx-auto">
              <Ambulance className="text-white w-12 h-12" />
            </span>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No Patients Yet
            </h3>
            <p className="text-gray-500">
              Waiting for patients to start filling out the registration form...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
