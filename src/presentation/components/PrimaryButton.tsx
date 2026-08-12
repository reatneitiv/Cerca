import { Pressable, Text } from "react-native";

interface PrimaryButtonProps {
  title: string;
  onPress?: () => void;
}

export function PrimaryButton({
  title,
  onPress,
}: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="min-h-14 flex-row items-center justify-center rounded-2xl bg-primary shadow-md active:opacity-90"
    >
      <Text className="text-base font-bold text-white">
        {title}
      </Text>
    </Pressable>
  );
}