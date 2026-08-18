import { appColors } from "@/shared/colors";
import { TextInput } from "react-native";
import { InputProps } from "../types/Input";

export function InputPer(props: InputProps) {
  return (
    <TextInput
      {...props}
      className="w-full rounded-xl border text-slate-900 text-base "
      placeholderTextColor={appColors.placeholder}
    />
  );
}
