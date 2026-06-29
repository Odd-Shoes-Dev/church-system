export type RegistrationStep =
  | "first_time"
  | "service"
  | "event"
  | "details"
  | "lookup"
  | "referral"
  | "prayer"
  | "summary";

export interface RegistrationData {
  isFirstTime: boolean | null;
  serviceId: string | null;
  serviceName: string | null;
  eventId: string | null;
  eventName: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  gender: "male" | "female" | null;
  ageGroup: "child" | "teen" | "young_adult" | "adult" | "senior" | null;
  district: string;
  occupation: string;
  maritalStatus: "single" | "married" | "widowed" | "divorced" | null;
  referralSourceId: string | null;
  referralSourceName: string | null;
  prayerRequest: string;
  existingMemberId: string | null;
}

export const EMPTY_REGISTRATION: RegistrationData = {
  isFirstTime: null,
  serviceId: null,
  serviceName: null,
  eventId: null,
  eventName: null,
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  gender: null,
  ageGroup: null,
  district: "",
  occupation: "",
  maritalStatus: null,
  referralSourceId: null,
  referralSourceName: null,
  prayerRequest: "",
  existingMemberId: null,
};
