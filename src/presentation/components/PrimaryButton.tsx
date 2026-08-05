import { Pressable, StyleSheet, Text } from "react-native";

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
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.label}>{title}</Text>
      <Text style={styles.arrow}>→</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#087F5B",
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 56,
    shadowColor: "#087F5B",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 4,
  },
  pressed: {
    opacity: 0.9,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  arrow: {
    color: "#FFFFFF",
    fontSize: 21,
    marginLeft: 10,
    marginTop: -1,
  },
});