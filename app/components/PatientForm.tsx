"use client";

import { usePatientForm } from "@/app/hooks/usePatientForm";
import { validatePhoneNumber } from "@/app/utils/formatPhone";
import { validateEmail } from "@/app/utils/validators";
import { Check, Heart } from "lucide-react";

export default function PatientForm() {
  const {
    sessionId,
    formData,
    isSubmitting,
    submitSuccess,
    isSaving,
    lastSaved,
    errors,
    setErrors,
    handleChange,
    handlePhoneChange,
    handleSubmit,
    isFormValid,
  } = usePatientForm();

  if (submitSuccess) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <span className="mx-auto mb-4 flex items-center justify-center w-12 h-12 bg-green-600 rounded-full">
            <Check className="w-8 h-8 text-white" />
          </span>
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            ส่งข้อมูลสำเร็จ!
          </h2>
          <p className="text-gray-600">ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว</p>
          <p className="text-sm text-gray-600 mt-2">Session ID: {sessionId}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6">
      <div className="bg-white shadow-xs rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <span className="bg-teal-600 p-2 rounded-xl">
              <Heart className="w-10 h-10" />
            </span>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Registration Form
              </h1>
              <p className="text-xs md:text-sm text-gray-500">
                Session ID: {sessionId}
              </p>
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
                onBlur={(e) => {
                  if (e.target.value.trim() === "") {
                    setErrors.setFirstName("กรุณากรอกชื่อ");
                  } else {
                    setErrors.setFirstName("");
                  }
                }}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-500 ${
                  errors.firstName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
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
                onChange={handleChange}
                onBlur={(e) => {
                  if (e.target.value.trim() === "") {
                    setErrors.setLastName("กรุณากรอกนามสกุล");
                  } else {
                    setErrors.setLastName("");
                  }
                }}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-500 ${
                  errors.lastName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
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
                onChange={handleChange}
                onBlur={(e) => {
                  if (e.target.value === "") {
                    setErrors.setDob("กรุณาเลือกวันเกิด");
                  } else {
                    setErrors.setDob("");
                  }
                }}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-500 ${
                  errors.dob
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.dob && (
                <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
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
                onChange={handlePhoneChange}
                onBlur={(e) => {
                  const result = validatePhoneNumber(e.target.value);
                  if (!result.isValid && e.target.value) {
                    setErrors.setPhone(result.error || "");
                  }
                }}
                placeholder="081-234-5678"
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500 ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
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
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                onBlur={(e) => {
                  const result = validateEmail(e.target.value);
                  if (!result.isValid && e.target.value) {
                    setErrors.setEmail(result.error || "");
                  }
                }}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ที่อยู่ (Address) *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                onBlur={(e) => {
                  if (e.target.value.trim() === "") {
                    setErrors.setAddress("กรุณากรอกที่อยู่");
                  } else {
                    setErrors.setAddress("");
                  }
                }}
                required
                rows={2}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-500 ${
                  errors.address
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
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
                : "bg-teal-600 hover:bg-teal-700 hover:shadow-lg text-white"
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
