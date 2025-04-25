import CameraVision from "@/components/Camera/Vision";
import CameraControls from "@/components/Camera/Controls";
import CameraSelector from "@/components/Camera/Selector";
import CameraShortcuts from "@/components/Camera/Shortcuts";

import { Alert, View } from "react-native";
import { useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { CameraSelected } from "@/types";
import { detectBarcodes } from "react-native-barcodes-detector";
import { VisionProvider } from "@/context/VisionContext";
import { useEffect, useRef, useState } from "react";
import {
  BarcodeScanningResult,
  BarcodeSettings,
  CameraType,
  CameraView,
} from "expo-camera";

import * as ImagePicker from "expo-image-picker";

export default function AddAI() {
  const focus = useIsFocused();
  const router = useRouter();
  const camera = useRef<CameraView>(null);

  const [flash, setFlash] = useState<boolean>(false);
  const [facing, setFacing] = useState<CameraType>("back");
  const [selected, setSelected] = useState(CameraSelected.Barcode);
  const [processing, setProcessing] = useState<boolean>(false);

  const isBarcode = selected === CameraSelected.Barcode;
  const isEstimation = selected === CameraSelected.Estimation;

  function handleFlip() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  function handleFlash() {
    setFlash((current) => !current);
  }

  async function handleBarcode(data: BarcodeScanningResult) {
    const barcode = data.data;

    router.push({
      pathname: "/add/add-product",
      params: { barcode },
    });
  }

  async function handleImage() {
    if (isBarcode) {
      Alert.alert("We hebben geen barcode in deze afbeelding gevonden.");

      return;
    }

    if (processing) {
      return;
    }

    setProcessing(true);

    console.log("[DEVICE] Handling image...");

    if (!camera.current) {
      return;
    }

    console.log("[DEVICE] Taking picture...");

    const params = await camera.current.takePictureAsync();

    if (!params) {
      return;
    }

    const pathname = "/add/add-estimation";

    router.push({
      pathname,
      params,
    });

    setProcessing(false);
  }

  async function handleDocument() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (result.canceled) {
      return;
    }

    if (!result.assets || result.assets.length === 0) {
      return;
    }

    const asset = result.assets[0];

    if (isBarcode) {
      console.log("[DEVICE] Scanning barcode...");

      const detected = await detectBarcodes(asset.uri, []);
      const barcode = detected[0]?.rawValue;

      if (!barcode) {
        Alert.alert("We hebben geen barcode in deze afbeelding gevonden.");

        return;
      }

      router.push({
        pathname: "/add/add-product",
        params: { barcode },
      });

      return;
    }

    router.push({
      pathname: "/add/add-estimation",
      params: { uri: asset.uri, width: asset.width, height: asset.height },
    });
  }

  // Reset the page's state when is the screen is unfocused
  useEffect(() => {
    if (focus) {
      return;
    }

    setFacing("back");
  }, [focus]);

  if (!focus) {
    return null;
  }

  const barcodeTypes = ["qr", "ean13", "ean8", "code128", "code39"];
  const barcodeSetting = { barcodeTypes } as BarcodeSettings;

  return (
    <VisionProvider>
      <CameraView
        ref={camera}
        flash={flash ? "on" : "off"}
        ratio="4:3"
        facing={facing}
        barcodeScannerSettings={isBarcode ? barcodeSetting : undefined}
        onBarcodeScanned={(data) => {
          if (!isBarcode) {
            return;
          }

          handleBarcode(data);
        }}
        style={{
          gap: 24,
          flex: 1,
          paddingBottom: 64,
        }}
      >
        <CameraShortcuts onFlash={handleFlash} flash={flash} />

        {isEstimation && <CameraVision camera={camera} />}

        <View style={{ marginTop: "auto", gap: 24 }}>
          <CameraSelector onSelect={setSelected} />

          <CameraControls
            onFlip={handleFlip}
            onTake={handleImage}
            onDocument={handleDocument}
          />
        </View>
      </CameraView>
    </VisionProvider>
  );
}
