import { z } from "zod";

export const detailsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+\d{7,15}$/, "Enter a valid phone number starting with your country code, e.g. +256700000000"),
  email: z
    .string()
    .email("Enter a valid email address, e.g. name@example.com")
    .or(z.literal(""))
    .optional(),
  gender: z
    .string()
    .nullable()
    .optional()
    .refine((v) => !!v && ["male", "female"].includes(v), "Please select your gender"),
  ageGroup: z
    .string()
    .nullable()
    .optional()
    .refine(
      (v) => !!v && ["child", "teen", "young_adult", "adult", "senior"].includes(v),
      "Please select an age group"
    ),
  district: z.string().optional(),
  occupation: z.string().optional(),
  maritalStatus: z
    .string()
    .optional()
    .nullable(),
});

export const prayerRequestSchema = z.object({
  prayerRequest: z.string().optional(),
});
