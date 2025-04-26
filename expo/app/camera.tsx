import CameraVision from "@/components/Camera/Vision";
import CameraControls from "@/components/Camera/Controls";
import CameraSelector from "@/components/Camera/Selector";
import CameraShortcuts from "@/components/Camera/Shortcuts";

import ImageResizer from "@bam.tech/react-native-image-resizer";

import { toBase64 } from "vision-camera-base64-v3";
import { useVision } from "@/context/VisionContext";
import { useRouter } from "expo-router";
import { useRunOnJS } from "react-native-worklets-core";
import { Alert, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { CameraSelected } from "@/types";
import { detectBarcodes } from "react-native-barcodes-detector";
import { useEffect, useRef, useState } from "react";

import {
  Camera,
  useCameraDevice,
  useFrameProcessor,
  useCameraPermission,
  useCodeScanner,
  runAtTargetFps,
  CameraPosition,
} from "react-native-vision-camera";

import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";

export default function AddAI() {
  const debug = false;

  const [flash, setFlash] = useState<boolean>(false);
  const [facing, setFacing] = useState<CameraPosition>("back");
  const [selected, setSelected] = useState(CameraSelected.Barcode);
  const [processing, setProcessing] = useState<boolean>(false);

  const camera = useRef<Camera>(null);
  const focus = useIsFocused();
  const router = useRouter();
  const device = useCameraDevice(facing);

  const { sendImage } = useVision();
  const { hasPermission } = useCameraPermission();

  const isBarcode = selected === CameraSelected.Barcode;
  const isEstimation = selected === CameraSelected.Estimation;

  function handleFlip() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  function handleFlash() {
    setFlash((current) => !current);
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

    const params = await camera.current.takePhoto({
      flash: flash ? "on" : "off",
    });

    if (!params) {
      return;
    }

    const pathname = "/add/add-estimation";

    router.push({
      pathname,
      params: { uri: params.path, width: params.width, height: params.height },
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

  const [previewUri, setPreviewUri] = useState<string>("");
  const [previewAspect, setPreviewAspect] = useState<number>(1);

  const handleResize = useRunOnJS(
    async (
      base64: string,
      width: number,
      height: number,
      orientation: number,
    ) => {
      const originalData = `data:image/jpeg;base64,${base64}`;
      const originalRatio = width / height;

      // If width is larger than width should be 512, if height is larger than height should be 512, mainting the ratio
      let newWidth = 0;
      let newHeight = 0;

      if (width > 1024) {
        newWidth = 1024;
        newHeight = 1024 / originalRatio;
      } else {
        newHeight = 1024;
        newWidth = 1024 * originalRatio;
      }

      const data = await ImageResizer.createResizedImage(
        originalData,
        newWidth,
        newHeight,
        "JPEG",
        50,
        orientation,
      );

      sendImage(data.uri);

      const adjustedRotation = Math.abs(orientation);
      const adjustedRatio =
        adjustedRotation === 90 ? height / width : originalRatio;

      setPreviewUri(data.uri);
      setPreviewAspect(adjustedRatio);
    },
    [],
  );

  const handleFrame = useFrameProcessor((frame) => {
    "worklet";

    const orientationCurrent = frame.orientation;

    let orientation = 0;

    if (orientationCurrent === "landscape-left") {
      orientation = -90;
    }

    if (orientationCurrent === "landscape-right") {
      orientation = 90;
    }

    const { width, height } = frame;

    runAtTargetFps(1, () => {
      const imageAsBase64 = toBase64(frame);

      handleResize(imageAsBase64, width, height, orientation);
    });
  }, []);

  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "ean-13", "ean-8", "code-128", "code-39"],
    onCodeScanned: (codes) => {
      const barcode = codes[0].value;

      router.push({
        pathname: "/add/add-product",
        params: { barcode },
      });
    },
  });

  if (!focus) {
    return null;
  }

  return (
    <View style={{ flex: 1, gap: 24, paddingBottom: 64 }}>
      {device && hasPermission ? (
        <Camera
          ref={camera}
          device={device!}
          isActive={true}
          pixelFormat="rgb"
          codeScanner={isBarcode ? codeScanner : undefined}
          frameProcessor={isEstimation ? handleFrame : undefined}
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            position: "absolute",
          }}
        />
      ) : (
        <View
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            position: "absolute",
            backgroundColor: "#000",
          }}
        />
      )}

      {debug && (
        <Image
          source={{
            uri: previewUri,
          }}
          style={{
            top: 80,
            left: 80,
            width: "auto",
            height: 100,
            position: "absolute",
            objectFit: "cover",
            aspectRatio: previewAspect,
          }}
        />
      )}

      <CameraShortcuts onFlash={handleFlash} flash={flash} />

      {isEstimation && <CameraVision />}

      <View style={{ marginTop: "auto", gap: 24 }}>
        <CameraSelector onSelect={setSelected} />

        <CameraControls
          onFlip={handleFlip}
          onTake={handleImage}
          onDocument={handleDocument}
        />
      </View>
    </View>
  );
}
