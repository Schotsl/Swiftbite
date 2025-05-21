import Button from "@/components/Button";
import Header from "@/components/Header";

import { Alert, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function PersonalExport() {
  const handleExport = () => {
    Alert.alert(
      "Dit is helaas nog niet mogelijk",
      "De exporteer functie is onderweg, maar nog niet klaar. We werken hard aan deze en andere functionaliteiten.",
    );
  };

  return (
    <ScrollView>
      <View style={{ flex: 1, padding: 32 }}>
        <Header
          title="Exporteer gegevens"
          content="Klik op 'Exporteer gegevens' en ontvang binnen enkele minuten een e-mail met een CSV-bestand van al je voedingsdata."
        />

        <Button title="Exporteer gegevens" onPress={handleExport} />
      </View>
    </ScrollView>
  );
}
