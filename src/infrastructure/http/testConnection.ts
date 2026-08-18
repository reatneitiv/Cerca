const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/health/live`);

console.log("STATUS:", response.status);
console.log("BODY:", await response.json());
