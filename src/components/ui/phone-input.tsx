// src/components/ui/phone-input.tsx
"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional callback when a valid phone is entered */
  onValidChange?: (value: string) => void;
}

export function PhoneInput({ onValidChange, ...props }: PhoneInputProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validate = (val: string) => {
    // Very simple validation: allow digits, spaces, +, -, parentheses, length 7-15
    const phoneRegex =
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{3,4}[-\s\.]?[0-9]{3,4}$/;
    if (val && !phoneRegex.test(val)) {
      setError("Invalid phone number");
    } else {
      setError(null);
      if (onValidChange) {
        onValidChange(val);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    validate(val);
  };

  return (
    <div className="space-y-1">
      <Input
        {...props}
        value={value}
        onChange={handleChange}
        placeholder="e.g. +1 (555) 123-4567"
        className={error ? "border-red-500" : undefined}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
