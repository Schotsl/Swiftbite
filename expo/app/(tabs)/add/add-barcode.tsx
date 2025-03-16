import { CameraType, CameraView } from "expo-camera";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BarcodeScreen() {
  const router = useRouter();
  const camera = useRef<CameraView>(null);

  const [facing, setFacing] = useState<CameraType>("back");

  function flipImage() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const handleScanned = ({ data }: { data: string }) => {
    console.log("Scanned barcode:", data);
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={camera}
        facing={facing}
        style={styles.camera}
        onBarcodeScanned={handleScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "ean13", "ean8", "code128", "code39"],
        }}
      >
        <View style={styles.controls}>
          <TouchableOpacity style={styles.button} onPress={flipImage}>
            <Text style={styles.buttonText}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  controls: {
    flex: 1,
    margin: 64,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  button: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 15,
    borderRadius: 10,
    minWidth: 120,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  scanText: {
    fontSize: 16,
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 15,
    borderRadius: 10,
  },
});
