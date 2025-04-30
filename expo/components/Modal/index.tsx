import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { Fragment, ReactNode, useState } from "react";
import { Modal as ReactModal } from "react-native";

import Button from "@/components/Button";

import ModalBackground from "./Background";

type ModalBaseProps = {
  title: string;
  visible: boolean;
  children: ReactNode;
  onClose: () => void;
};

type ModalWithButtonProps = ModalBaseProps & {
  button: string;
  onButton: () => void;
};

type ModalWithoutButtonProps = ModalBaseProps & {
  button?: undefined;
  onButton?: () => void;
};

export type ModalProps = ModalWithButtonProps | ModalWithoutButtonProps;

export default function Modal({
  title,
  button,
  visible,
  children,
  onClose,
  onButton,
}: ModalProps) {
  const [height, setHeight] = useState(0);

  return (
    <Fragment>
      <ReactModal
        visible={visible}
        transparent={true}
        animationType="none"
        onRequestClose={onClose}
      >
        <ModalBackground onPress={onClose} />

        <View
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;

            setHeight(height);
          }}
          style={{
            top: "50%",
            left: 32,
            right: 32,
            position: "absolute",
            transform: [{ translateY: -height / 2 }],

            padding: 24,
            paddingBottom: button ? 24 : 32,

            minHeight: 100,
            borderRadius: 16,
            backgroundColor: "white",
          }}
        >
          <View
            style={{
              marginBottom: 32,
              paddingBottom: 24,
              borderBottomWidth: 1,
              borderColor: "#A6A6A6",

              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontFamily: "OpenSans_600SemiBold",
              }}
            >
              {title}
            </Text>

            <TouchableOpacity onPress={onClose}>
              <FontAwesome6 name="xmark" size={22} color="#000" />
            </TouchableOpacity>
          </View>

          {children}

          {button && (
            <View
              style={{
                marginTop: 32,

                borderTopWidth: 1,
                borderColor: "#A6A6A6",
              }}
            >
              <Button title={button} onPress={onButton} />
            </View>
          )}
        </View>
      </ReactModal>
    </Fragment>
  );
}
