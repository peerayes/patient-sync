export type PatientStatus = 'filling' | 'submitted' | 'inactive';

export type Gender = 'male' | 'female' | 'other';

export interface Patient {
  id: string;
  session_id: string;

  // Personal Information
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_of_birth: string;
  gender: Gender;

  // Contact Information
  phone: string;
  email: string;
  address: string;

  // Additional Information
  preferred_language?: string;
  nationality?: string;
  religion?: string;

  // Emergency Contact
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;

  // Status
  status: PatientStatus;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface PatientFormData {
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_of_birth: string;
  gender: Gender;
  phone: string;
  email: string;
  address: string;
  preferred_language?: string;
  nationality?: string;
  religion?: string;
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;
}
