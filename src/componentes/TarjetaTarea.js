import { View, Text } from "react-native";

export default function TarjetaTarea({ titulo, frecuencia }) {
  return (
    <View>
      <Text>{titulo}</Text>
      <Text>{frecuencia}</Text>
    </View>
  );
}
