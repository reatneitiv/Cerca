import { useEffect } from "react";
import { Text, View } from "react-native";

export default function TestScreen() {
  useEffect(() => {
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/health/live`)
      .then(async (response) => {
        console.log("STATUS:", response.status);
        console.log("BODY:", await response.json());
      })
      .catch((error) => {
        console.error("ERROR:", error);
      });
  }, []);

  return (
    <View>
      <Text>Testing API...</Text>
    </View>
  );
}
