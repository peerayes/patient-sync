export const validateEmail = (
  email: string
): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: false, error: "กรุณากรอกอีเมล" };
  }

  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: "รูปแบบอีเมลไม่ถูกต้อง (ตัวอย่าง: name@example.com)",
    };
  }

  return { isValid: true };
};
