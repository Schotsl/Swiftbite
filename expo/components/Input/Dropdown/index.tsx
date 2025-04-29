import { Option } from "@/types";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Control, Controller, useController } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";

import Modal from "@/components/Modal";
import InputLabel from "../Label";
import InputDropdownRadio from "./Radio";
import { Picker } from "@react-native-picker/picker";

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
          borderWidth: 2,
          borderColor: fieldState.error || error ? "#FF4141" : "#000",
          borderRadius: 8,

          flexDirection: "row",
          backgroundColor: "#fff",

          opacity: disabled ? 0.5 : 1,
        }}
        onPress={handleOpen}
      >
        <Text
          style={{
            flex: 1,
            color: selected ? "#000" : "#aba9a9",
            fontSize: 16,
            fontFamily: "OpenSans_600SemiBold",

            padding: 12,
            paddingHorizontal: 16,
          }}
        >
          {selected ? selected.title : placeholder}
        </Text>

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
        <Text
          style={{
            fontSize: 14,
            fontFamily: "OpenSans_600SemiBold",
            color: "#FF4141",
            marginTop: 8,
          }}
        >
          {fieldState.error?.message || error}
        </Text>
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
