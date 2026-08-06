import { StyleSheet, Text, View } from "react-native";

export function Header() {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.eyebrow}>SERVICIOS CERCA DE TI</Text>
        <Text style={styles.title}>Cerca</Text>
      </View>

      <View style={styles.avatar}>
        <Text style={styles.avatarText}>C</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  eyebrow: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 3,
  },
  title: {
    color: "#102A43",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -1,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: "#DDF5ED",
    borderRadius: 23,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  avatarText: {
    color: "#087F5B",
    fontSize: 18,
    fontWeight: "800",
  },
});
