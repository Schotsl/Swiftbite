import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Control, Controller } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";

import Modal from "@/components/Modal";
import InputLabel from "../Label";
import InputDropdownRadio from "./Radio";

type Option = {
  id: string;
  label: string;
  value: string;
};

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

export default function Dropdown({
  name,
  label,
  options,
  placeholder,

  error,
  required = true,
  disabled = false,
  control,
}: DropdownProps) {
  const [visible, setVisible] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState }) => {
        const selectedOption = options.find((option) => option.id === value);

        const handleSelect = (option: Option) => {
          onChange(option.id);
          setVisible(false);
        };

        const handleClose = () => {
          setVisible(false);
        };

        const handleOpen = () => {
          if (disabled) {
            return;
          }
          setVisible(true);
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
                  fontSize: 16,
                  fontFamily: "OpenSans_600SemiBold",

                  padding: 12,
                  paddingHorizontal: 14,
                }}
              >
                {selectedOption ? selectedOption.label : placeholder}
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

            <Modal title={label} visible={visible} onClose={handleClose}>
              <View style={{ gap: 16 }}>
                {options.map((option) => (
                  <InputDropdownRadio
                    key={option.id}
                    label={option.label}
                    selected={option.id === value}
                    onSelect={() => handleSelect(option)}
                  />
                ))}
              </View>
            </Modal>

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
          </View>
        );
      }}
    />
  );
}
