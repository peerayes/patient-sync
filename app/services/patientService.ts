import { Database, supabase } from "@/app/lib/supabase";
import { PatientFormData } from "@/app/types/patient";
import { cleanPhoneNumber } from "@/app/utils/formatPhone";

type PatientInsert = Database["public"]["Tables"]["patients"]["Insert"];

export const PatientService = {
  sanitizePayload(data: PatientFormData): PatientFormData {
    return {
      ...data,
      date_of_birth: data.date_of_birth === "" ? null : data.date_of_birth,
    } as PatientFormData;
  },

  async upsertPatient(
    sessionId: string,
    data: PatientFormData,
    status: "filling" | "submitted"
  ) {
    const sanitizedData = this.sanitizePayload(data);

    // Construct payload ensuring it matches the Database Insert type
    const payload: PatientInsert = {
      session_id: sessionId,
      first_name: sanitizedData.first_name,
      middle_name: sanitizedData.middle_name,
      last_name: sanitizedData.last_name,
      date_of_birth:
        sanitizedData.date_of_birth === "" ? null : sanitizedData.date_of_birth,
      gender: sanitizedData.gender,
      phone: cleanPhoneNumber(sanitizedData.phone),
      email: sanitizedData.email,
      address: sanitizedData.address,
      preferred_language: sanitizedData.preferred_language,
      nationality: sanitizedData.nationality,
      religion: sanitizedData.religion,
      emergency_contact_name: sanitizedData.emergency_contact_name,
      emergency_contact_relationship:
        sanitizedData.emergency_contact_relationship,
      status: status,
      updated_at: new Date().toISOString(),
    };

    return await supabase
      .from("patients")
      .upsert(payload as any, { onConflict: "session_id" });
  },
};
