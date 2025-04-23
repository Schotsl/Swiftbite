import CameraControls from "@/components/Camera/Controls";
import CameraSelector from "@/components/Camera/Selector";
import CameraShortcuts from "@/components/Camera/Shortcuts";

import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { CameraSelected } from "@/types";
import { detectBarcodes } from "react-native-barcodes-detector";
import { useEffect, useRef, useState } from "react";
import { BarcodeSettings, CameraType, CameraView } from "expo-camera";

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

  function handleFlip() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  function handleFlash() {
    setFlash((current) => !current);
  }

  async function handleImage() {
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

    const pathname = isBarcode ? "/add/add-product" : "/add/add-estimation";

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
    <CameraView
      ref={camera}
      flash={flash ? "on" : "off"}
      ratio="4:3"
      facing={facing}
      onBarcodeScanned={isBarcode ? handleImage : undefined}
      barcodeScannerSettings={isBarcode ? barcodeSetting : undefined}
      style={{
        gap: 24,
        flex: 1,
        paddingBottom: 64,
      }}
    >
      <CameraShortcuts onFlash={handleFlash} flash={flash} />

      <CameraSelector onSelect={setSelected} />

      <CameraControls
        onFlip={handleFlip}
        onTake={handleImage}
        onDocument={handleDocument}
      />
    </CameraView>
  );
}
