import { PatientService } from "@/app/services/patientService";
import { PatientFormData } from "@/app/types/patient";
import {
  formatPhoneNumber,
  validatePhoneNumber,
} from "@/app/utils/formatPhone";
import { validateEmail } from "@/app/utils/validators";
import { useEffect, useRef, useState } from "react";

export function usePatientForm() {
  const [sessionId, setSessionId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Error states
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

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Session
  useEffect(() => {
    const newSessionId = `USER-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    setSessionId(newSessionId);
  }, []);

  // Validation Helper
  const isFormValid = (): boolean => {
    return (
      formData.first_name.trim() !== "" &&
      formData.last_name.trim() !== "" &&
      formData.date_of_birth !== "" &&
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

  const autoSave = async (data: PatientFormData) => {
    if (!sessionId) return;
    setIsSaving(true);
    try {
      const { error } = await PatientService.upsertPatient(
        sessionId,
        data,
        "filling"
      );
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

    // Clear validation errors
    if (name === "first_name" && firstNameError) setFirstNameError("");
    if (name === "last_name" && lastNameError) setLastNameError("");
    if (name === "date_of_birth" && dobError) setDobError("");
    if (name === "gender" && genderError) setGenderError("");
    if (name === "address" && addressError) setAddressError("");

    // Debounce auto-save
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      autoSave(newData);
    }, 1000);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    const newData = { ...formData, phone: formatted };
    setFormData(newData);
    setPhoneError("");

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      autoSave(newData);
    }, 1000);
  };

  const validateAllFields = () => {
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
    if (formData.address.trim() === "") {
      setAddressError("กรุณากรอกที่อยู่");
      hasError = true;
    }

    const phoneRes = validatePhoneNumber(formData.phone);
    if (!phoneRes.isValid) {
      setPhoneError(phoneRes.error || "กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง");
      hasError = true;
    }

    const emailRes = validateEmail(formData.email);
    if (!emailRes.isValid) {
      setEmailError(emailRes.error || "กรุณากรอกอีเมลที่ถูกต้อง");
      hasError = true;
    }

    return !hasError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    if (!validateAllFields()) return;

    setIsSubmitting(true);
    try {
      const { error } = await PatientService.upsertPatient(
        sessionId,
        formData,
        "submitted"
      );
      if (error) throw error;
      setSubmitSuccess(true);
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error("Submit error:", JSON.stringify(error, null, 2));
      alert("เกิดข้อผิดพลาดในการส่งฟอร์ม กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    sessionId,
    formData,
    isSubmitting,
    submitSuccess,
    isSaving,
    lastSaved,
    errors: {
      firstName: firstNameError,
      lastName: lastNameError,
      dob: dobError,
      phone: phoneError,
      email: emailError,
      address: addressError,
    },
    setErrors: {
      setFirstName: setFirstNameError,
      setLastName: setLastNameError,
      setDob: setDobError,
      setPhone: setPhoneError,
      setEmail: setEmailError,
      setAddress: setAddressError,
    },
    handleChange,
    handlePhoneChange,
    handleSubmit,
    isFormValid,
  };
}
