import { StyleSheet, Text, TextInput, View } from "react-native";

export function SearchBar() {
  return (
    <View style={styles.container}>
      <Text accessibilityElementsHidden style={styles.icon}>
        ⌕
      </Text>
      <TextInput
        accessibilityLabel="Buscar un servicio"
        placeholder="Buscar un servicio..."
        placeholderTextColor="#94A3B8"
        returnKeyType="search"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 56,
    paddingHorizontal: 16,
    shadowColor: "#102A43",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  icon: {
    color: "#087F5B",
    fontSize: 27,
    lineHeight: 29,
    marginRight: 10,
    transform: [{ rotate: "-20deg" }],
  },
  input: {
    color: "#102A43",
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
});
