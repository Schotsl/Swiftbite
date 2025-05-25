import Modal from "@/components/Modal";
import Label from "@/components/Input/Label";
import TextInput from "@/components/Text/Input";
import ButtonSmall from "@/components/Button/Small";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { useState } from "react";
import { useController, Control } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";

import language from "@/language";

type InputTimeProps = {
  name: string;
  label: string;
  control: Control<any>;
};

export default function InputTime({ name, label, control }: InputTimeProps) {
  const {
    field: { value, onChange },
  } = useController({
    name,
    control,
  });

  const [visible, setVisible] = useState(false);
  const [temporary, setTemporary] = useState<Date>(value);

  const handleClose = () => {
    setVisible(false);
  };

  const handleOpen = () => {
    setTemporary(value);
    setVisible(true);
  };

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    const currentDate = selected || temporary;

    setTemporary(currentDate);
  };

  const handleSave = () => {
    onChange(temporary);

    setVisible(false);
  };

  const transformTime = (date: Date) => {
    return date.toLocaleTimeString("nl-NL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
          <TextInput>{transformTime(value)}</TextInput>

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
        <DateTimePicker
          mode="time"
          value={temporary}
          style={{ marginVertical: -16 }}
          display="spinner"
          onChange={handleChange}
        />
      </Modal>
    </View>
  );
}
