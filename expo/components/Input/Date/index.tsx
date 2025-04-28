import Modal from "@/components/Modal";
import Label from "@/components/Input/Label";
import ButtonSmall from "@/components/Button/Small";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { useState } from "react";
import { Text, View } from "react-native";
import { Control, useController } from "react-hook-form";

type InputDateProps = {
  name: string;
  label: string;
  control: Control<any>;
};

export default function InputDate({ name, label, control }: InputDateProps) {
  const {
    field: { value, onChange },
  } = useController({
    name,
    control,
    defaultValue: new Date(),
  });

  const [visible, setVisible] = useState(false);
  const [temporary, setTemporary] = useState<Date>(new Date(value));

  const handleClose = () => {
    setVisible(false);
    setTemporary(new Date(value));
  };

  const handleOpen = () => {
    setTemporary(new Date(value));
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

  const transformDate = (date: Date | string | number): string => {
    const dateObject = new Date(date);
    return dateObject.toLocaleDateString("nl-NL", {
      day: "2-digit",
      month: "long",
      year: "numeric",
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
          {transformDate(value)}
        </Text>

        <ButtonSmall icon="pencil" onPress={handleOpen} nano />

        <Modal
          title={label}
          button="Wijzigen opslaan"
          visible={visible}
          onClose={handleClose}
          onButton={handleSave}
        >
          <DateTimePicker
            mode="date"
            value={temporary}
            style={{ marginVertical: -16 }}
            display="spinner"
            onChange={handleChange}
          />
        </Modal>
      </View>
    </View>
  );
}
