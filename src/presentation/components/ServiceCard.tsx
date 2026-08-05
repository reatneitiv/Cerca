import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Service } from "../../domain/models/Service";

interface ServiceCardProps {
  service: Service;
  onPress?: () => void;
}

export default function ServiceCard({
  service,
  onPress,
}: ServiceCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: service.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.name}>{service.name}</Text>

        <Text style={styles.category}>{service.category}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.rating}>⭐ {service.rating}</Text>

          <Text style={styles.distance}>
             {service.distance} km
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginVertical: 10,
    overflow: "hidden",
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 170,
  },

  content: {
    padding: 15,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },

  category: {
    marginTop: 5,
    fontSize: 14,
    color: "#666",
  },

  infoRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  rating: {
    fontSize: 15,
    color: "#F4B400",
    fontWeight: "600",
  },

  distance: {
    fontSize: 15,
    color: "#555",
  },
});