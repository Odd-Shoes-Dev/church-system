import { z } from "zod";

export const detailsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+\d{7,15}$/, "Enter a valid phone number with country code"),
  email: z
    .string()
    .email("Enter a valid email")
    .or(z.literal("")),
  gender: z.enum(["male", "female"]),
  ageGroup: z.enum(["child", "teen", "young_adult", "adult", "senior"]),
  district: z.string().optional(),
  occupation: z.string().optional(),
  maritalStatus: z
    .enum(["single", "married", "widowed", "divorced"])
    .optional()
    .nullable(),
});

export const prayerRequestSchema = z.object({
  prayerRequest: z.string().optional(),
});
