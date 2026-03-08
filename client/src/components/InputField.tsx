import React, { ChangeEvent, RefObject, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  refProp?: RefObject<HTMLInputElement>;
  prefix?: string;
  className?: string;
  id?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  refProp,
  prefix,
  className,
  id,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className={cn("flex flex-col items-start w-full min-w-0", className)}>
      <label htmlFor={id} className="mb-1 mt-3 text-sm font-medium">
        {label}
      </label>
      <div className="flex w-full min-w-0 relative">
        {prefix && (
          <span className="flex items-center px-2 rounded-l-lg border border-r-0 bg-muted/20 text-muted-foreground text-xs whitespace-nowrap">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          ref={refProp}
          className={`rounded-lg px-3 py-1.5 bg-muted/20 border focus:ring-white/20 focus:border-white/10 flex-1 min-w-0 placeholder-muted-foreground/50 transition-all duration-200 ${
            prefix ? "rounded-l-none" : ""
          } ${type === "password" ? "pr-10" : ""}`}
        />
        {type === "password" && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};
