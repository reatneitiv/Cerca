import { TextInput } from "react-native";
import { InputProps } from "../types/Input";

export function InputPer(props: InputProps) {
  return (
    <TextInput
      {...props}
      className="w-full rounded-xl border border-gray-600 bg-gray-900 px-4 py-4 text-base text-white"
      placeholderTextColor="#9CA3AF"
    />
  );
}
