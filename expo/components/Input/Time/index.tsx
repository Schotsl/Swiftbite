import Modal from "@/components/Modal";
import Label from "@/components/Input/Label";
import ButtonSmall from "@/components/Button/Small";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { useState } from "react";
import { Text, View } from "react-native";
import { Control, useController } from "react-hook-form";

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
          {transformTime(value)}
        </Text>

        <ButtonSmall icon="pencil" onPress={handleOpen} nano />
      </View>

      <Modal
        title={label}
        button="Wijzigen opslaan"
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
