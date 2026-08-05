import { PrimaryButton } from "@/src/presentation/components/PrimaryButton";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

import type { Listing } from "@/src/domain/entities/listing.entity";
import { getListingByIdUseCase } from "@/src/shared/container/container";

export default function ListingDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const [listing, setListing] = useState<Listing | null>(null);

    useEffect(() => {
        const load = async () => {
            if (!id) return;

            const data = await getListingByIdUseCase.execute(id);
            setListing(data);
        };

        load();
    }, [id]);

    return (
        <>
            <Stack.Screen
                options={{
                    title: listing?.title ?? "Detalle del servicio",
                }}
            />

            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {listing ? (
                    <>
                        <Image
                            source={{ uri: listing.imageUrl }}
                            style={styles.image}
                        />

                        <Text style={styles.title}>
                            {listing.title}
                        </Text>

                        <Text style={styles.price}>
                            {listing.price.amount} {listing.price.currency}
                        </Text>

                        <View style={styles.badges}>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    {listing.distance}
                                </Text>
                            </View>

                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    🟢 Disponible ahora
                                </Text>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                Acerca del servicio
                            </Text>

                            <Text style={styles.description}>
                                Profesional especializado en reparación de fugas,
                                instalación de tuberías, mantenimiento preventivo
                                y atención de emergencias.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                Servicios incluidos
                            </Text>

                            <Text style={styles.service}>✔ Reparación de fugas</Text>
                            <Text style={styles.service}>✔ Destape de tuberías</Text>
                            <Text style={styles.service}>✔ Instalación de sanitarios</Text>
                            <Text style={styles.service}>✔ Cambio de grifería</Text>
                        </View>

                        <View style={{ marginTop: 24 }}>
                            <PrimaryButton title="Solicitar servicio" />
                        </View>
                    </>
                ) : (
                    <Text>Cargando...</Text>
                )}
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7FAFC",
    },

    content: {
        padding: 20,
    },

    title: {
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 12,
        color: "#102A43",
    },

    image: {
        width: "100%",
        height: 260,
        borderRadius: 20,
        marginBottom: 20,
    },

    price: {
        fontSize: 20,
        fontWeight: "600",
        color: "#087F5B",
        marginBottom: 8,
    },

    badges: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 10,
        marginBottom: 24,
        gap: 10,
    },

    badge: {
        backgroundColor: "#EAF7F2",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
    },

    badgeText: {
        color: "#087F5B",
        fontWeight: "600",
        fontSize: 13,
    },

    section: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 18,
        marginBottom: 18,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#102A43",
        marginBottom: 10,
    },

    description: {
        fontSize: 15,
        lineHeight: 24,
        color: "#52606D",
    },

    service: {
        fontSize: 15,
        color: "#334E68",
        marginBottom: 8,
    },
});