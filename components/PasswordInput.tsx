import { Eye, EyeOff } from "lucide-react";
import React from "react";

const PasswordInput = (props: {
  setPassword: (value: string) => null;
  password: string;
}) => {
  const [showPassword, setShowPassword] = React.useState<Boolean>(false);
  return (
    <>
      <input
        type={showPassword ? "text" : "password"}
        required
        className="block w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-500 transition-all"
        placeholder="••••••••"
        value={props.password}
        onChange={(e) => props.setPassword(e.target.value)}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </button>
    </>
  );
};

export default PasswordInput;
