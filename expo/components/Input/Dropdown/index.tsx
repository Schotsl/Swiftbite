import { Option } from "@/types";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Control, useController } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";

import Modal from "@/components/Modal";
import InputLabel from "../Label";
import InputDropdownRadio from "./Radio";
import TextSmall from "@/components/Text/Small";
import TextBody from "@/components/Text/Body";

import variables from "@/variables";

type DropdownProps = {
  name: string;
  label: string;
  control: Control<any>;
  options: Option[];
  placeholder: string;

  error?: string;
  required?: boolean;
  disabled?: boolean;
};

export default function InputDropdown({
  name,
  label,
  options,
  placeholder,

  error,
  required = true,
  disabled = false,
  control,
}: DropdownProps) {
  const {
    field: { value, onChange },
    fieldState,
  } = useController({
    name,
    control,
  });

  const [visible, setVisible] = useState(false);
  const [temporary, setTemporary] = useState("test");

  const extended = options.length > 6;
  const selected = options.find((option) => option.value === value);

  const handleClose = () => {
    setVisible(false);
  };

  const handleOpen = () => {
    if (disabled) {
      return;
    }

    if (extended) {
      setTemporary(value);
    }

    setVisible(true);
  };

  const handleChange = (value: string) => {
    if (extended) {
      setTemporary(value);
    } else {
      onChange(value);

      setVisible(false);
    }
  };

  const handleSave = () => {
    onChange(temporary);

    setVisible(false);
  };

  return (
    <View>
      {label && <InputLabel label={label} required={required} />}

      <TouchableOpacity
        style={{
          borderWidth: variables.border.width,
          borderColor:
            fieldState.error || error ? "#FF4141" : variables.border.color,
          borderRadius: 8,

          flexDirection: "row",
          backgroundColor: "#fff",

          opacity: disabled ? 0.5 : 1,
        }}
        onPress={handleOpen}
      >
        <TextBody
          color={selected ? "#000" : "#aba9a9"}
          style={{ flex: 1, padding: 12, paddingHorizontal: 16 }}
          weight="semibold"
        >
          {selected ? selected.title : placeholder}
        </TextBody>

        <View
          style={{
            width: 46,
            height: 46,

            alignItems: "center",
            justifyContent: "center",

            borderColor: "#000",
            borderLeftWidth: 2,
          }}
        >
          <Ionicons name="chevron-down" size={20} color="#000" />
        </View>
      </TouchableOpacity>

      {(fieldState.error || error) && (
        <TextSmall color="#FF4141" weight="semibold" style={{ marginTop: 8 }}>
          {fieldState.error?.message || error}
        </TextSmall>
      )}

      <Modal
        title={label}
        visible={visible}
        onClose={handleClose}
        button={extended ? "Wijzigen opslaan" : undefined}
        onButton={handleSave}
      >
        {extended ? (
          <Picker
            style={{ marginVertical: -20 }}
            selectedValue={temporary}
            onValueChange={handleChange}
          >
            {options.map((option) => (
              <Picker.Item
                key={option.value}
                value={option.value}
                label={option.title}
              />
            ))}
          </Picker>
        ) : (
          <View style={{ gap: 16 }}>
            {options.map((option) => (
              <InputDropdownRadio
                key={option.value}
                label={option.title}
                selected={option.value === value}
                onSelect={() => handleChange(option.value)}
              />
            ))}
          </View>
        )}
      </Modal>
    </View>
  );
}
