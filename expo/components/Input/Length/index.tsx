import Modal from "@/components/Modal";
import Label from "@/components/Input/Label";
import ButtonSmall from "@/components/Button/Small";

import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { useController, Control } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";

import TextInput from "@/components/Text/Input";
import language from "@/language";

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
  const [temporary, setTemporary] = useState(value);

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

      <TouchableOpacity onPress={handleOpen}>
        <View
          style={{
            marginTop: -4,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TextInput>
            {value} {language.measurement.metric.distance}
          </TextInput>

          <ButtonSmall icon="pencil" onPress={handleOpen} nano />
        </View>
      </TouchableOpacity>

      <Modal
        title={label}
        button={language.modifications.getEdit(label)}
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
            <Picker.Item
              key={option}
              value={option}
              label={`${option} ${language.measurement.metric.distance}`}
            />
          ))}
        </Picker>
      </Modal>
    </View>
  );
}
