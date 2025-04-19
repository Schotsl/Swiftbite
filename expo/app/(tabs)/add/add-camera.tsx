import CameraControls from "@/components/Camera/Controls";
import CameraSelector from "@/components/Camera/Selector";
import CameraShortcuts from "@/components/Camera/Shortcuts";

import { useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { CameraSelected } from "@/types";
import { useEffect, useRef, useState } from "react";
import { BarcodeSettings, CameraType, CameraView } from "expo-camera";

export default function AddAI() {
  const focus = useIsFocused();
  const router = useRouter();
  const camera = useRef<CameraView>(null);

  const [flash, setFlash] = useState<boolean>(false);
  const [facing, setFacing] = useState<CameraType>("back");
  const [selected, setSelected] = useState(CameraSelected.Barcode);

  const isBarcode = selected === CameraSelected.Barcode;

  function handleFlip() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  function handleFlash() {
    setFlash((current) => !current);
  }

  async function handleImage() {
    console.log("[DEVICE] Handling image...");
    if (!camera.current) {
      return;
    }

    console.log("[DEVICE] Taking picture...");

    const params = await camera.current.takePictureAsync();

    if (!params) {
      return;
    }

    const pathname = isBarcode ? "/add/add-barcode" : "/add/add-estimation";
    console.log(pathname);
    router.push({
      pathname,
      params,
    });
  }

  console.log(selected);

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

      <CameraControls onFlip={handleFlip} onTake={handleImage} />
    </CameraView>
  );
}
