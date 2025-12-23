"use client";

import { Database, supabase } from "@/app/lib/supabase";
import { PatientFormData } from "@/app/types/patient";
import {
  cleanPhoneNumber,
  formatPhoneNumber,
  validatePhoneNumber,
} from "@/app/utils/formatPhone";
import { validateEmail } from "@/app/utils/validators";
import { useEffect, useRef, useState } from "react";

type PatientInsert = Database["public"]["Tables"]["patients"]["Insert"];

export default function PatientForm() {
  const [sessionId, setSessionId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Error states for all required fields
  const [firstNameError, setFirstNameError] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const [dobError, setDobError] = useState<string>("");
  const [genderError, setGenderError] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [addressError, setAddressError] = useState<string>("");

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
    const newSessionId = `USER-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    setSessionId(newSessionId);
  }, []);

  // Check if form is valid (all required fields filled + no validation errors)
  const isFormValid = (): boolean => {
    return (
      formData.first_name.trim() !== "" &&
      formData.last_name.trim() !== "" &&
      formData.date_of_birth !== "" &&
      // Gender always has a valid default value
      formData.phone.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.address.trim() !== "" &&
      firstNameError === "" &&
      lastNameError === "" &&
      dobError === "" &&
      phoneError === "" &&
      emailError === "" &&
      addressError === ""
    );
  };

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
        phone: cleanPhoneNumber(sanitizedData.phone), // Clean phone before save
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

    // Clear errors on change
    if (name === "first_name" && firstNameError) setFirstNameError("");
    if (name === "last_name" && lastNameError) setLastNameError("");
    if (name === "date_of_birth" && dobError) setDobError("");
    if (name === "gender" && genderError) setGenderError("");
    if (name === "address" && addressError) setAddressError("");

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

    // Validate all required fields before submit
    let hasError = false;

    if (formData.first_name.trim() === "") {
      setFirstNameError("กรุณากรอกชื่อ");
      hasError = true;
    }
    if (formData.last_name.trim() === "") {
      setLastNameError("กรุณากรอกนามสกุล");
      hasError = true;
    }
    if (formData.date_of_birth === "") {
      setDobError("กรุณาเลือกวันเกิด");
      hasError = true;
    }
    // Gender always has a default value, so no validation needed
    if (formData.address.trim() === "") {
      setAddressError("กรุณากรอกที่อยู่");
      hasError = true;
    }

    // Validate phone
    const phoneValidation = validatePhoneNumber(formData.phone);
    if (!phoneValidation.isValid) {
      setPhoneError(
        phoneValidation.error || "กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง"
      );
      hasError = true;
    }

    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || "กรุณากรอกอีเมลที่ถูกต้อง");
      hasError = true;
    }

    // Block submit if any validation errors
    if (hasError) {
      return;
    }

    setIsSubmitting(true);

    try {
      const sanitizedData = sanitizePayload(formData);
      const payload = {
        session_id: sessionId,
        ...sanitizedData,
        phone: cleanPhoneNumber(sanitizedData.phone), // Clean phone before save
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
                onChange={(e) => {
                  handleChange(e);
                  if (firstNameError) setFirstNameError("");
                }}
                onBlur={(e) => {
                  if (e.target.value.trim() === "") {
                    setFirstNameError("กรุณากรอกชื่อ");
                  }
                }}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-500 ${
                  firstNameError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {firstNameError && (
                <p className="text-red-500 text-xs mt-1">{firstNameError}</p>
              )}
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
                onChange={(e) => {
                  handleChange(e);
                  if (lastNameError) setLastNameError("");
                }}
                onBlur={(e) => {
                  if (e.target.value.trim() === "") {
                    setLastNameError("กรุณากรอกนามสกุล");
                  }
                }}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-500 ${
                  lastNameError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {lastNameError && (
                <p className="text-red-500 text-xs mt-1">{lastNameError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                วันเกิด (Date of Birth) *
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={(e) => {
                  handleChange(e);
                  if (dobError) setDobError("");
                }}
                onBlur={(e) => {
                  if (e.target.value === "") {
                    setDobError("กรุณาเลือกวันเกิด");
                  }
                }}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-500 ${
                  dobError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {dobError && (
                <p className="text-red-500 text-xs mt-1">{dobError}</p>
              )}
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
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  const newData = { ...formData, phone: formatted };
                  setFormData(newData);
                  setPhoneError("");

                  // Debounce auto-save
                  if (saveTimeoutRef.current) {
                    clearTimeout(saveTimeoutRef.current);
                  }

                  saveTimeoutRef.current = setTimeout(() => {
                    autoSave(newData);
                  }, 1000);
                }}
                onBlur={(e) => {
                  const result = validatePhoneNumber(e.target.value);
                  if (!result.isValid && e.target.value) {
                    setPhoneError(result.error || "");
                    // When phone has error, validate all required fields
                    if (formData.first_name.trim() === "")
                      setFirstNameError("กรุณากรอกชื่อ");
                    if (formData.last_name.trim() === "")
                      setLastNameError("กรุณากรอกนามสกุล");
                    if (formData.date_of_birth === "")
                      setDobError("กรุณาเลือกวันเกิด");
                    if (formData.address.trim() === "")
                      setAddressError("กรุณากรอกที่อยู่");
                    // Also validate email
                    const emailResult = validateEmail(formData.email);
                    if (!emailResult.isValid && formData.email) {
                      setEmailError(
                        emailResult.error || "กรุณากรอกอีเมลที่ถูกต้อง"
                      );
                    }
                  }
                }}
                placeholder="081-234-5678"
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500 ${
                  phoneError ? "border-red-500" : "border-gray-300"
                }`}
              />
              {phoneError && (
                <p className="text-red-500 text-xs mt-1">{phoneError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                อีเมล (Email) *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500 ${
                  emailError ? "border-red-500" : "border-gray-300"
                }`}
                onBlur={(e) => {
                  const result = validateEmail(e.target.value);
                  if (!result.isValid && e.target.value) {
                    setEmailError(result.error || "");
                    // When email has error, validate all required fields
                    if (formData.first_name.trim() === "")
                      setFirstNameError("กรุณากรอกชื่อ");
                    if (formData.last_name.trim() === "")
                      setLastNameError("กรุณากรอกนามสกุล");
                    if (formData.date_of_birth === "")
                      setDobError("กรุณาเลือกวันเกิด");
                    if (formData.address.trim() === "")
                      setAddressError("กรุณากรอกที่อยู่");
                  } else {
                    setEmailError("");
                  }
                }}
                onChange={(e) => {
                  handleChange(e);
                  if (emailError) setEmailError("");
                }}
              />
              {emailError && (
                <p className="text-red-500 text-xs mt-1">{emailError}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ที่อยู่ (Address) *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={(e) => {
                  handleChange(e);
                  if (addressError) setAddressError("");
                }}
                onBlur={(e) => {
                  if (e.target.value.trim() === "") {
                    setAddressError("กรุณากรอกที่อยู่");
                  }
                }}
                required
                rows={2}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-500 ${
                  addressError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {addressError && (
                <p className="text-red-500 text-xs mt-1">{addressError}</p>
              )}
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
            disabled={!isFormValid() || isSubmitting}
            className={`font-semibold px-8 py-3 rounded-lg shadow-md transition-all flex items-center gap-2 ${
              !isFormValid() || isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg text-white"
            }`}
          >
            {isSubmitting && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {isSubmitting ? "กำลังส่งข้อมูล..." : "Submit Form"}
          </button>
        </div>
      </div>
    </form>
  );
}
