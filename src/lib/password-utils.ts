import * as z from "zod";

export interface PasswordRequirement {
  id: string;
  label: string;
  test: (password: string, confirmPassword?: string) => boolean;
}

export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  {
    id: "minLength",
    label: "At least 8 characters",
    test: (password: string) => password.length >= 8,
  },
  {
    id: "hasUppercase",
    label: "One uppercase letter",
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    id: "hasLowercase",
    label: "One lowercase letter",
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    id: "hasDigit",
    label: "One number",
    test: (password: string) => /\d/.test(password),
  },
  {
    id: "hasSpecialChar",
    label: "One special character",
    test: (password: string) =>
      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  },
  {
    id: "passwordsMatch",
    label: "Passwords match",
    test: (password: string, confirmPassword?: string) => {
      if (!confirmPassword) return false;
      return password === confirmPassword && password.length > 0;
    },
  },
];

export const validatePasswordRequirements = (
  password: string,
  confirmPassword?: string
) => {
  return PASSWORD_REQUIREMENTS.map((requirement) => ({
    ...requirement,
    satisfied: requirement.test(password, confirmPassword),
  }));
};

export const isPasswordValid = (password: string) => {
  return PASSWORD_REQUIREMENTS.filter(
    (req) => req.id !== "passwordsMatch"
  ).every((requirement) => requirement.test(password));
};

export const createPasswordSchema = (fieldName: string = "password") => {
  return z
    .string({ message: `${fieldName} is required` })
    .min(1, `${fieldName} is required`)
    .refine((password) => password.length >= 8, {
      message: "Password must be at least 8 characters long",
    })
    .refine((password) => /[A-Z]/.test(password), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((password) => /[a-z]/.test(password), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((password) => /\d/.test(password), {
      message: "Password must contain at least one number",
    })
    .refine(
      (password) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
      {
        message: "Password must contain at least one special character",
      }
    );
};
