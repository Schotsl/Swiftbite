import Modal from "@/components/Modal";
import Label from "@/components/Input/Label";
import ButtonSmall from "@/components/Button/Small";

import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { useController, Control } from "react-hook-form";

import TextInput from "@/components/Text/Input";

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
  });

  const [visible, setVisible] = useState(false);
  const [temporary, setTemporary] = useState(0);

  const handleClose = () => {
    setVisible(false);
    setTemporary(value);
  };

  const handleOpen = () => {
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
        <TextInput>{value} cm</TextInput>

        <ButtonSmall icon="pencil" onPress={handleOpen} nano />
      </View>

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
  );
}
