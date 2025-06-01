import Modal from "@/components/Modal";
import Label from "@/components/Input/Label";
import TextInput from "@/components/Text/Input";
import ButtonSmall from "@/components/Button/Small";

import { useState } from "react";
import { useController, Control } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";
import DateTimePicker, {
  DateType,
  useDefaultStyles,
} from "react-native-ui-datepicker";

import language from "@/language";

type DateRange = {
  startDate: DateType;
  endDate: DateType;
};

type InputRangeProps = {
  name: string;
  label: string;
  control: Control<any>;
};

export default function InputRange({ name, label, control }: InputRangeProps) {
  const defaultStyles = useDefaultStyles();

  const {
    field: { value, onChange },
  } = useController({
    name,
    control,
  });

  const [temporary, setTemporary] = useState<DateRange>(value);
  const [visible, setVisible] = useState(false);

  const handleClose = () => {
    setVisible(false);
  };

  const handleOpen = () => {
    setTemporary(value);
    setVisible(true);
  };

  const handleSave = () => {
    onChange(temporary);
    setVisible(false);
  };

  const formatShort = (date: Date) => {
    return `${date.getDate()} ${date.toLocaleString("nl-NL", { month: "long" })}`;
  };

  const displayDateRange = (range: DateRange) => {
    const dateStart = range.startDate as Date;
    const dateEnd = range.endDate as Date;

    const yearEnd = dateEnd.getFullYear();
    const yearStart = dateStart.getFullYear();
    const yearCurrent = new Date().getFullYear();

    const shortEnd = formatShort(dateEnd);
    const shortStart = formatShort(dateStart);

    if (yearStart === yearCurrent && yearEnd !== yearCurrent) {
      return `${shortStart} t/m ${shortEnd} ${yearEnd}`;
    } else if (yearStart !== yearCurrent && yearEnd === yearCurrent) {
      return `${shortStart} ${yearStart} t/m ${shortEnd}`;
    } else if (yearStart !== yearEnd) {
      return `${shortStart} t/m ${shortEnd}`;
    } else if (yearStart === yearEnd && yearStart !== yearCurrent) {
      return `${shortStart} t/m ${shortEnd}`;
    }

    return `${shortStart} t/m ${shortEnd}`;
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
          <TextInput>{displayDateRange(value)}</TextInput>

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
          mode="range"
          startDate={temporary?.startDate}
          endDate={temporary?.endDate}
          onChange={({ startDate, endDate }) =>
            setTemporary({ startDate, endDate })
          }
          styles={defaultStyles}
        />
      </Modal>
    </View>
  );
}
