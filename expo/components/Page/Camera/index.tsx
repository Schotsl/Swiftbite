import CameraVision from "@/components/Page/Camera/Vision";
import CameraControls from "@/components/Page/Camera/Controls";
import CameraSelector from "@/components/Page/Camera/Selector";
import CameraShortcuts from "@/components/Page/Camera/Shortcuts";

import ImageResizer from "@bam.tech/react-native-image-resizer";

import { Image } from "expo-image";
import { useVision } from "@/context/VisionContext";
import { useRunOnJS } from "react-native-worklets-core";
import { Alert, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { CameraSelected } from "@/types";
import { detectBarcodes } from "react-native-barcodes-detector";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";

// TODO: vision-camera-base64-v3 is a GitHub fork of mine
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { toBase64 } from "vision-camera-base64-v3";

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

import variables from "@/variables";

type PageCameraProps = {
  initial?: CameraSelected;
  onBarcode: (barcode: string) => void;
  onEstimation?: (uri: string, width: number, height: number) => void;
};

export default function PageCamera({
  initial = CameraSelected.Barcode,

  onBarcode,
  onEstimation,
}: PageCameraProps) {
  const debug = false;

  const estimationEnabled = !!onEstimation;

  const [flash, setFlash] = useState<boolean>(false);
  const [facing, setFacing] = useState<CameraPosition>("back");
  const [selected, setSelected] = useState(initial);
  const [processing, setProcessing] = useState<boolean>(false);

  const focus = useIsFocused();
  const camera = useRef<Camera>(null);
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
      // TODO: language
      Alert.alert("We hebben geen barcode in deze afbeelding gevonden.");

      return;
    }

    if (!estimationEnabled) {
      return;
    }

    if (processing) {
      return;
    }

    setProcessing(true);

    console.log("[DEVICE] Handling image...");

    if (!camera.current) {
      setProcessing(false);

      return;
    }

    console.log("[DEVICE] Taking picture...");

    const params = await camera.current.takePhoto({
      flash: flash ? "on" : "off",
    });

    if (!params) {
      setProcessing(false);

      return;
    }

    onEstimation(params.path, params.width, params.height);

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

      onBarcode(barcode);

      return;
    }

    if (!estimationEnabled) {
      return;
    }

    const { uri, width, height } = asset;

    onEstimation(uri, width, height);
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
      orientation: number
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
        orientation
      );

      sendImage(data.uri);

      const adjustedRotation = Math.abs(orientation);
      const adjustedRatio =
        adjustedRotation === 90 ? height / width : originalRatio;

      setPreviewUri(data.uri);
      setPreviewAspect(adjustedRatio);
    },
    []
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
    codeTypes: ["ean-13", "ean-8", "code-128", "code-39"],
    onCodeScanned: (codes) => {
      if (codes.length > 1) {
        Alert.alert(
          "We hebben meerdere barcodes gevonden in deze afbeelding, scan één voor één."
        );

        return;
      }

      const code = codes[0];
      const barcode = code.value!;

      onBarcode(barcode);
    },
  });

  if (!focus) {
    return null;
  }

  return (
    <View
      style={{
        flex: 1,
        gap: 24,
        backgroundColor: variables.colors.black,
      }}
    >
      {device && hasPermission && (
        <Camera
          ref={camera}
          photo={true}
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

      <View
        style={{
          gap: 24,
          marginTop: "auto",
          alignItems: "center",

          paddingTop: 16,
          paddingBottom: 48,
          backgroundColor: "rgba(0, 0, 0, 0.35)",
        }}
      >
        <CameraSelector
          initial={initial}
          estimation={estimationEnabled}
          onSelect={setSelected}
        />

        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={[
            "rgba(255, 255, 255, .25)",
            "rgba(255, 255, 255, .75)",
            "rgba(255, 255, 255, .75)",
            "rgba(255, 255, 255, .25)",
          ]}
          style={{
            width: 264,
            height: 2,
            marginTop: -12,
            borderRadius: 2,
            marginBottom: 4,
          }}
        />

        <CameraControls
          onFlip={handleFlip}
          onTake={handleImage}
          onDocument={handleDocument}
        />
      </View>
    </View>
  );
}
