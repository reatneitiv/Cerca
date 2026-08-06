import type { Listing } from "@/src/domain/entities/listing.entity";

export const listingsMock: Listing[] = [
  {
    id: "1",
    title: "Plomero Profesional",
    price: {
      amount: 50000,
      currency: "COP",
    },
    distance: "2 km",
    imageUrl: "https://picsum.photos/400/300?random=1",
  },
  {
    id: "2",
    title: "Electricista",
    price: {
      amount: 80000,
      currency: "COP",
    },
    distance: "1.5 km",
    imageUrl: "https://picsum.photos/400/300?random=2",
  },
  {
    id: "3",
    title: "Paseador de Perros",
    price: {
      amount: 30000,
      currency: "COP",
    },
    distance: "800 m",
    imageUrl: "https://picsum.photos/400/300?random=3",
  },
  {
    id: "4",
    title: "Profesor de Inglés",
    price: {
      amount: 60000,
      currency: "COP",
    },
    distance: "3 km",
    imageUrl: "https://picsum.photos/400/300?random=4",
  },
  {
    id: "5",
    title: "Jardinero",
    price: {
      amount: 45000,
      currency: "COP",
    },
    distance: "950 m",
    imageUrl: "https://picsum.photos/400/300?random=5",
  },
];