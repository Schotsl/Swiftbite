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
import language from "@/language";

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
            fieldState.error || error
              ? variables.colors.text.error
              : variables.border.color,

          borderRadius: variables.border.radius,
          backgroundColor: variables.colors.white,
          flexDirection: "row",

          opacity: disabled ? variables.input.disabled.opacity : 1,
        }}
        onPress={handleOpen}
      >
        <TextBody
          weight="semibold"
          style={{ flex: 1, padding: 12, paddingHorizontal: 16 }}
          color={
            selected ? variables.colors.text.primary : variables.border.color
          }
        >
          {selected ? selected.title : placeholder}
        </TextBody>

        <View
          style={{
            width: 46,
            height: 46,

            alignItems: "center",
            justifyContent: "center",

            borderColor: variables.border.color,
            borderLeftWidth: variables.border.width,
          }}
        >
          <Ionicons
            size={20}
            name="chevron-down"
            color={variables.colors.text.primary}
          />
        </View>
      </TouchableOpacity>

      {(fieldState.error || error) && (
        <TextSmall
          color={variables.colors.text.error}
          style={{ marginTop: variables.input.margin }}
          weight="semibold"
        >
          {fieldState.error?.message || error}
        </TextSmall>
      )}

      <Modal
        title={label}
        visible={visible}
        onClose={handleClose}
        button={extended ? language.modifications.getEdit(label) : undefined}
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
          <View style={{ gap: 16, marginTop: -16 }}>
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
