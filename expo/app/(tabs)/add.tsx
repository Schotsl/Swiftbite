import { CameraType, CameraView } from "expo-camera";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function App() {
  const router = useRouter();
  const camera = useRef<CameraView>(null);

  const [facing, setFacing] = useState<CameraType>("back");

  function flipImage() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const takeImage = async () => {
    if (!camera.current) {
      return;
    }

    console.log("[DEVICE] Taking picture...");

    const picture = await camera.current.takePictureAsync({
      skipProcessing: true,
      base64: true,
    });

    if (!picture) {
      return;
    }

    const { uri, width, height } = picture;

    router.push({ pathname: "/add/preview", params: { uri, width, height } });
  };

  return (
    <CameraView
      ref={camera}
      facing={facing}
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          flex: 1,
          margin: 64,
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          style={{ flex: 1, alignSelf: "flex-end", alignItems: "center" }}
          onPress={flipImage}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>
            Flip
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ flex: 1, alignSelf: "flex-end", alignItems: "center" }}
          onPress={takeImage}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>
            Snap
          </Text>
        </TouchableOpacity>
      </View>
    </CameraView>
  );
}
