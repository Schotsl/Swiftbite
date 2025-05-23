// HAPPY

import { Modal, View } from "react-native";
import { useState } from "react";

import NavigationAddList from "./List";
import NavigationAddInner from "./Inner";

import ModalBackground from "@/components/Modal/Background";

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
        <ModalBackground onPress={() => setOpen(false)} />

        <NavigationAddList
          camera="/add/camera"
          search="/add/search"
          estimation="/add/estimation"
          onClose={() => setOpen(false)}
        />

        <View
          style={{
            left: "50%",
            bottom: 25,
            position: "absolute",
            transform: [{ translateX: -33 }],
          }}
        >
          <NavigationAddInner
            open={open}
            overlay={false}
            onPress={() => setOpen(false)}
          />
        </View>
      </Modal>

      <View
        style={{
          top: -16,
          left: "50%",
          position: "absolute",
          transform: [{ translateX: -33 }],
        }}
      >
        <NavigationAddInner
          open={open}
          overlay={true}
          onPress={() => setOpen(true)}
        />
      </View>
    </View>
  );
}
