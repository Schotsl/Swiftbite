import Modal from "@/components/Modal";
import Label from "@/components/Input/Label";
import ButtonSmall from "@/components/Button/Small";

import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { Text, View } from "react-native";
import { Control, useController } from "react-hook-form";

type InputLengthProps = {
  name: string;
  label: string;
  control: Control<any>;
};

export default function InputLength({
  name,
  label,
  control,
}: InputLengthProps) {
  const {
    field: { value, onChange },
  } = useController({
    name,
    control,
    defaultValue: 0,
  });

  const [visible, setVisible] = useState(false);
  const [temporary, setTemporary] = useState(0);

  const handleClose = () => {
    setVisible(false);
    setTemporary(value);
  };

  const handleOpen = () => {
    setTemporary(value);
    setVisible(true);
  };

  const handleChange = (selected: number) => {
    setTemporary(selected);
  };

  const handleSave = () => {
    onChange(temporary);

    setVisible(false);
  };

  // Start at 50 cm and go up to 250 cm
  const options = Array.from({ length: 200 }, (_, i) => i + 50);

  return (
    <View>
      <Label label={label} />

      <View
        style={{
          marginTop: -4,
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
          {value} cm
        </Text>

        <ButtonSmall icon="pencil" onPress={handleOpen} nano />

        <Modal
          title={label}
          button="Wijzigen opslaan"
          visible={visible}
          onClose={handleClose}
          onButton={handleSave}
        >
          <Picker
            style={{ marginVertical: -20 }}
            selectedValue={temporary}
            onValueChange={handleChange}
          >
            {options.map((option) => (
              <Picker.Item key={option} label={`${option} cm`} value={option} />
            ))}
          </Picker>
        </Modal>
      </View>
    </View>
  );
}
