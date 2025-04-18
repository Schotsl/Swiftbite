import { Modal, View } from "react-native";
import { useState } from "react";

import NavigationAddList from "./List";
import NavigationAddInner from "./Inner";

export default function NavigationAdd() {
  const [open, setOpen] = useState(false);

  return (
    <View>
      <Modal
        visible={open}
        transparent={true}
        animationType="none"
        onRequestClose={() => setOpen(false)}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.75)" }} />

        <NavigationAddList onClose={() => setOpen(false)} />

        <View
          style={{
            left: "50%",
            bottom: 46,
            position: "absolute",
            transform: [{ translateX: -32 }],
          }}
        >
          <NavigationAddInner
            open={open}
            background={false}
            onPress={() => setOpen(false)}
          />
        </View>
      </Modal>

      <View
        style={{
          top: -49,
          left: "50%",
          position: "absolute",
          transform: [{ translateX: -32 }],
        }}
      >
        <NavigationAddInner open={open} onPress={() => setOpen(true)} />
      </View>
    </View>
  );
}
