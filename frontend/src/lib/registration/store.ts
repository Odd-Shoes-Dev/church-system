"use client";

import { create } from "zustand";
import type { RegistrationStep, RegistrationData } from "./types";
import { EMPTY_REGISTRATION } from "./types";

interface RegistrationState {
  step: RegistrationStep;
  data: RegistrationData;
  setStep: (step: RegistrationStep) => void;
  updateData: (partial: Partial<RegistrationData>) => void;
  reset: () => void;
}

export const useRegistrationStore = create<RegistrationState>((set) => ({
  step: "first_time",
  data: { ...EMPTY_REGISTRATION },
  setStep: (step) => set({ step }),
  updateData: (partial) =>
    set((state) => ({ data: { ...state.data, ...partial } })),
  reset: () => set({ step: "first_time", data: { ...EMPTY_REGISTRATION } }),
}));
