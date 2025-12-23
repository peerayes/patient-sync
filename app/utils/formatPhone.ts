/**
 * Phone Number Utilities for Thai Phone Numbers
 * Supports mobile (06x, 08x, 09x) and landline (02x)
 */

/**
 * Format phone number with dashes (xxx-xxx-xxxx)
 * Used for input formatting
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '').slice(0, 10);
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
}

/**
 * Format phone number with spaces (xxx xxx xxxx)
 * Used for display in cards/lists
 */
export function formatPhoneNumberWithSpace(phone: string): string {
  if (!phone || phone.trim() === '') return '-';
  const cleaned = phone.replace(/\D/g, '').slice(0, 10);
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
}

/**
 * Validation result type
 */
export interface PhoneValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate Thai phone number
 * Mobile: 06x, 08x, 09x (10 digits)
 * Landline: 02x (10 digits)
 */
export function validatePhoneNumber(phone: string): PhoneValidationResult {
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: 'กรุณากรอกเบอร์โทรศัพท์' };
  }

  const cleaned = phone.replace(/\D/g, '');

  // Must be 10 digits
  if (cleaned.length !== 10) {
    return { isValid: false, error: 'เบอร์โทรศัพท์ต้องมี 10 หลัก' };
  }

  // Must start with 0
  if (!cleaned.startsWith('0')) {
    return { isValid: false, error: 'เบอร์โทรศัพท์ต้องขึ้นต้นด้วย 0' };
  }

  // Allow mobile (06x, 08x, 09x) or landline (02x)
  if (!/^0[2689]\d{8}$/.test(cleaned)) {
    return { isValid: false, error: 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง' };
  }

  return { isValid: true };
}

/**
 * Clean phone number (remove all non-digit characters)
 * Used before saving to database
 */
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}
