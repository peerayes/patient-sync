"use client";

import { Database, supabase } from "@/app/lib/supabase";
import { PatientFormData } from "@/app/types/patient";
import { useEffect, useRef, useState } from "react";

type PatientInsert = Database["public"]["Tables"]["patients"]["Insert"];

export default function PatientForm() {
  const [sessionId, setSessionId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [formData, setFormData] = useState<PatientFormData>({
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "male",
    phone: "",
    email: "",
    address: "",
    preferred_language: "",
    nationality: "",
    religion: "",
    emergency_contact_name: "",
    emergency_contact_relationship: "",
  });

  // Ref to hold the timeout ID for debounce
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Generate session ID on component mount
  useEffect(() => {
    const newSessionId = `PAT-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    setSessionId(newSessionId);
  }, []);

  // Helper to sanitize data before sending to Supabase
  const sanitizePayload = (data: PatientFormData) => {
    return {
      ...data,
      date_of_birth: data.date_of_birth === "" ? null : data.date_of_birth,
      // Handle other potential empty strings that should be null if necessary
      // e.g. if phone/email are optional in DB but required in Form
    };
  };

  // Auto-save function
  const autoSave = async (data: PatientFormData) => {
    if (!sessionId) return;
    setIsSaving(true);

    try {
      const sanitizedData = sanitizePayload(data);
      const payload = {
        session_id: sessionId,
        ...sanitizedData,
        status: "filling",
        updated_at: new Date().toISOString(),
      };

      // Cast to any to bypass Supabase type inference issue (returns never)
      const { error } = await supabase
        .from("patients")
        .upsert(payload as any, { onConflict: "session_id" });

      if (error) throw error;
      setLastSaved(new Date());
    } catch (error) {
      console.error("Auto-save error:", JSON.stringify(error, null, 2));
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);

    // Debounce auto-save (1 second delay)
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      autoSave(newData);
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear any pending auto-saves
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setIsSubmitting(true);

    try {
      const sanitizedData = sanitizePayload(formData);
      const payload = {
        session_id: sessionId,
        ...sanitizedData,
        status: "submitted", // Change status to submitted
        updated_at: new Date().toISOString(),
      };

      // Cast to any to bypass Supabase type inference issue
      const { error } = await supabase
        .from("patients")
        .upsert(payload as any, { onConflict: "session_id" });

      if (error) throw error;

      setSubmitSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Submit error:", JSON.stringify(error, null, 2));
      alert("เกิดข้อผิดพลาดในการส่งฟอร์ม กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            ส่งข้อมูลสำเร็จ!
          </h2>
          <p className="text-green-700">ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว</p>
          <p className="text-sm text-green-600 mt-2">Session ID: {sessionId}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🏥</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Patient Registration Form
              </h1>
              <p className="text-sm text-gray-500">Session ID: {sessionId}</p>
            </div>
          </div>
          {/* Save Status Indicator */}
          <div className="text-xs text-gray-400 text-right">
            {isSaving ? (
              <span className="flex items-center gap-1 text-blue-500">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                Saving...
              </span>
            ) : lastSaved ? (
              <span>Saved {lastSaved.toLocaleTimeString()}</span>
            ) : null}
          </div>
        </div>

        {/* Personal Information */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            ข้อมูลส่วนตัว
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อ (First Name) *
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อกลาง (Middle Name)
              </label>
              <input
                type="text"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                นามสกุล (Last Name) *
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                วันเกิด (Date of Birth) *
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                เพศ (Gender) *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
              >
                <option value="male">ชาย (Male)</option>
                <option value="female">หญิง (Female)</option>
                <option value="other">อื่นๆ (Other)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                สัญชาติ (Nationality)
              </label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ศาสนา (Religion)
              </label>
              <input
                type="text"
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ภาษาที่ต้องการ (Preferred Language)
              </label>
              <input
                type="text"
                name="preferred_language"
                value={formData.preferred_language}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            ข้อมูลติดต่อ
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                เบอร์โทรศัพท์ (Phone) *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                อีเมล (Email) *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ที่อยู่ (Address) *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            ผู้ติดต่อฉุกเฉิน
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อผู้ติดต่อฉุกเฉิน (Name)
              </label>
              <input
                type="text"
                name="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ความสัมพันธ์ (Relationship)
              </label>
              <input
                type="text"
                name="emergency_contact_relationship"
                value={formData.emergency_contact_relationship}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "กำลังส่งข้อมูล..." : "Submit Form"}
          </button>
        </div>
      </div>
    </form>
  );
}
