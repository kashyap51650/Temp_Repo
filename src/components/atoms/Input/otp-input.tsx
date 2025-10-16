import React from "react";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "./input-otp";

interface OtpInputProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  disabled = false,
  error,
  className = "",
}) => {
  return (
    <div className={className}>
      <InputOTP
        maxLength={6}
        value={value}
        onChange={onChange}
        containerClassName="flex justify-center gap-2"
        inputMode="numeric"
        autoComplete="one-time-code"
        disabled={disabled}
      >
        <InputOTPGroup className="flex justify-between gap-2 w-full">
          <InputOTPSlot
            index={0}
            className="w-12 h-12 rounded-md border border-input bg-background text-center text-2xl font-medium focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all"
          />
          <InputOTPSlot
            index={1}
            className="w-12 h-12 rounded-md border border-input bg-background text-center text-2xl font-medium focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all"
          />
          <InputOTPSlot
            index={2}
            className="w-12 h-12 rounded-md border border-input bg-background text-center text-2xl font-medium focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all"
          />
          <InputOTPSlot
            index={3}
            className="w-12 h-12 rounded-md border border-input bg-background text-center text-2xl font-medium focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all"
          />
          <InputOTPSlot
            index={4}
            className="w-12 h-12 rounded-md border border-input bg-background text-center text-2xl font-medium focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all"
          />
          <InputOTPSlot
            index={5}
            className="w-12 h-12 rounded-md border border-input bg-background text-center text-2xl font-medium focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all"
          />
        </InputOTPGroup>
      </InputOTP>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
};
