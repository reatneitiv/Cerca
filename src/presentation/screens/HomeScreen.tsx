import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { Listing } from "@/src/domain/entities/listing.entity";
import { Header } from "@/src/presentation/components/Header";
import { ListingCard } from "@/src/presentation/components/ListingCard";
import { PrimaryButton } from "@/src/presentation/components/PrimaryButton";
import { SearchBar } from "@/src/presentation/components/SearchBar";
import { getListingsUseCase } from "@/src/shared/container/container";

function normalize(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // quita tildes para que "electricista" matchee con "eléctrico", etc.
}

export default function HomeScreen() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadListings = async () => {
      const data = await getListingsUseCase.execute();
      setListings(data);
    };

    loadListings();
  }, []);

  const normalizedQuery = normalize(searchQuery);
  const filteredListings = normalizedQuery
    ? listings.filter((listing) => normalize(listing.title).startsWith(normalizedQuery))
    : listings;

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <FlatList
        contentContainerStyle={styles.content}
        data={filteredListings}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(listing) => listing.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No encontramos servicios que empiecen por "{searchQuery}".
          </Text>
        }
        ListHeaderComponent={
          <View>
            <Header />
            <Text style={styles.intro}>
              Encuentra el servicio que necesitas, justo donde estás.
            </Text>

            <View style={styles.searchSection}>
              <SearchBar onChangeText={setSearchQuery} value={searchQuery} />
              <View style={styles.buttonSpacing}>
                <PrimaryButton title="Solicitar servicio" />
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Servicios disponibles</Text>
                <Text style={styles.sectionSubtitle}>Profesionales cerca de ti</Text>
              </View>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{filteredListings.length}</Text>
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => <ListingCard listing={item} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#F7FAFC",
    flex: 1,
  },
  content: {
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  intro: {
    color: "#64748B",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
    maxWidth: 300,
  },
  searchSection: {
    backgroundColor: "#EAF8F3",
    borderRadius: 24,
    marginTop: 24,
    padding: 14,
  },
  buttonSpacing: {
    marginTop: 12,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    marginTop: 30,
  },
  sectionTitle: {
    color: "#102A43",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  sectionSubtitle: {
    color: "#94A3B8",
    fontSize: 13,
    marginTop: 3,
  },
  countBadge: {
    alignItems: "center",
    backgroundColor: "#DDF5ED",
    borderRadius: 14,
    height: 28,
    justifyContent: "center",
    minWidth: 28,
    paddingHorizontal: 8,
  },
  countText: {
    color: "#087F5B",
    fontSize: 12,
    fontWeight: "800",
  },
  separator: {
    height: 14,
  },
  emptyText: {
    color: "#64748B",
    fontSize: 14,
    marginTop: 24,
    textAlign: "center",
  },
});
