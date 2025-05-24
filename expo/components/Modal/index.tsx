import { View } from "react-native";
import { Modal as ReactModal } from "react-native";
import { Fragment, ReactNode, useState } from "react";

import Button from "@/components/Button";
import ButtonSmall from "../Button/Small";
import TextInput from "../Text/Input";
import ModalBackground from "./Background";

import variables from "@/variables";

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
            left: variables.padding.page,
            right: variables.padding.page,
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
              marginBottom: variables.gap.large,
              paddingBottom: 24,

              borderColor: variables.colors.grey,
              borderBottomWidth: variables.border.width,
              backgroundColor: "red",

              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TextInput>{title}</TextInput>

            <ButtonSmall icon="xmark" onPress={onClose} />
          </View>

          {children}

          {button && (
            <View
              style={{
                marginTop: variables.gap.large,
                paddingTop: variables.gap.large,

                borderTopWidth: variables.border.width,
                borderColor: variables.colors.grey,
              }}
            >
              <Button title={button} action="primary" onPress={onButton} />
            </View>
          )}
        </View>
      </ReactModal>
    </Fragment>
  );
}
