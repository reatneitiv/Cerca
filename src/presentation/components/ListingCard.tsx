import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import type { Listing } from "@/src/domain/entities/listing.entity";

interface ListingCardProps {
  listing: Listing;
}

const priceFormatter = new Intl.NumberFormat("es-CO", {
  maximumFractionDigits: 0,
});

export function ListingCard({ listing }: ListingCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();

  const handlePress = () => {
    router.push(`/listing/${listing.id}`);
  };

  return (
    <Pressable
      accessibilityLabel={`Ver detalles de ${listing.title}`}
      accessibilityRole="button"
      onPress={handlePress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <Image source={{ uri: listing.imageUrl }} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.availability}>Profesional disponible</Text>
          <Pressable
            accessibilityLabel={isSaved ? "Quitar de guardados" : "Guardar servicio"}
            accessibilityRole="button"
            accessibilityState={{ selected: isSaved }}
            hitSlop={8}
            onPress={(event) => {
              event.stopPropagation();
              setIsSaved((currentValue) => !currentValue);
            }}
            style={({ pressed }) => [
              styles.saveButton,
              isSaved && styles.saveButtonActive,
              pressed && styles.saveButtonPressed,
            ]}
          >
            <Text style={[styles.saveIcon, isSaved && styles.saveIconActive]}>
              {isSaved ? "★" : "☆"}
            </Text>
          </Pressable>
        </View>
        <Text numberOfLines={1} style={styles.title}>
          {listing.title}
        </Text>

        <View style={styles.ratingRow} accessibilityLabel="Calificación con estrellas">
          <Text style={styles.stars}>★★★★★</Text>
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={styles.priceLabel}>DESDE</Text>
            <Text style={styles.price}>
              $ {priceFormatter.format(listing.price.amount)}
              <Text style={styles.currency}> {listing.price.currency}</Text>
            </Text>
          </View>

          <View style={styles.distanceBadge}>
            <Text style={styles.pin}>●</Text>
            <Text style={styles.distance}>{listing.distance}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#EDF2F7",
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    padding: 12,
    shadowColor: "#102A43",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.85,
  },
  image: {
    backgroundColor: "#E2E8F0",
    borderRadius: 15,
    height: 132,
    width: 112,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 14,
    paddingVertical: 2,
  },
  topRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  availability: {
    color: "#087F5B",
    flex: 1,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.25,
    textTransform: "uppercase",
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    height: 28,
    justifyContent: "center",
    marginLeft: 6,
    width: 28,
  },
  saveButtonActive: {
    backgroundColor: "#FFF4D6",
  },
  saveButtonPressed: {
    opacity: 0.65,
  },
  saveIcon: {
    color: "#64748B",
    fontSize: 17,
    lineHeight: 20,
  },
  saveIconActive: {
    color: "#F5A623",
  },
  title: {
    color: "#102A43",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.25,
  },
  ratingRow: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 6,
  },
  stars: {
    color: "#F5A623",
    fontSize: 14,
    letterSpacing: 1,
  },
  footer: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  priceLabel: {
    color: "#94A3B8",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  price: {
    color: "#102A43",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 1,
  },
  currency: {
    color: "#64748B",
    fontSize: 10,
    fontWeight: "700",
  },
  distanceBadge: {
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  pin: {
    color: "#087F5B",
    fontSize: 8,
    marginRight: 5,
  },
  distance: {
    color: "#475569",
    fontSize: 11,
    fontWeight: "700",
  },
});
