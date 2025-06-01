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
  end: DateType;
  start: DateType;
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

  const [visible, setVisible] = useState(false);
  const [temporary, setTemporary] = useState<DateRange>(value);

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
    const dateEnd = range.end as Date;
    const dateStart = range.start as Date;

    const yearEnd = dateEnd.getFullYear();
    const yearStart = dateStart.getFullYear();
    const yearCurrent = new Date().getFullYear();

    const shortEnd = formatShort(dateEnd);
    const shortStart = formatShort(dateStart);

    const separator = language.estimation.dateRange.to;

    if (yearStart === yearCurrent && yearEnd !== yearCurrent) {
      return `${shortStart} ${separator} ${shortEnd} ${yearEnd}`;
    } else if (yearStart !== yearCurrent && yearEnd === yearCurrent) {
      return `${shortStart} ${yearStart} ${separator} ${shortEnd}`;
    } else if (yearStart !== yearEnd) {
      return `${shortStart} ${yearStart} ${separator} ${shortEnd} ${yearEnd}`;
    } else if (yearStart === yearEnd && yearStart !== yearCurrent) {
      return `${shortStart} ${separator} ${shortEnd} ${yearStart}`;
    }
    return `${shortStart} ${separator} ${shortEnd}`;
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
        <View style={{ height: 310 }}>
          <DateTimePicker
            mode="range"
            locale="nl"
            styles={{
              ...defaultStyles,
              selected: { backgroundColor: "#EF6262" },
            }}
            endDate={temporary?.end}
            startDate={temporary?.start}
            onChange={({ startDate, endDate }) =>
              setTemporary({ start: startDate, end: endDate })
            }
          />
        </View>
      </Modal>
    </View>
  );
}
