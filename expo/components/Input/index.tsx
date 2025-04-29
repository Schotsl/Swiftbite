import { FontAwesome6 } from "@expo/vector-icons";
import { Control, Controller } from "react-hook-form";
import {
  View,
  Text,
  Keyboard,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";

import React from "react";
import InputLabel from "./Label";

type Type =
  | "default"
  | "numeric"
  | "email-address"
  | "phone-pad"
  | "number-pad"
  | "password";

type InputProps = {
  name: string;
  control: Control<any>;

  type?: Type;
  icon?: keyof typeof FontAwesome6.glyphMap;
  label?: string;
  content?: string;
  required?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  placeholder: string;

  error?: string;
};

export default function Input({
  name,
  control,

  type = "default",
  icon,
  label,
  content,
  required = true,
  disabled = false,
  multiline = false,
  placeholder,
  error,
}: InputProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState }) => {
        const handleChange = (text: string) => {
          if (disabled) {
            return;
          }

          if (type === "numeric") {
            const filtered = text.replace(/[^0-9]/g, "");

            onChange(filtered);

            return;
          }

          onChange(text);
        };

        return (
          <View>
            {label && <InputLabel label={label} required={required} />}

            <View style={{ position: "relative" }}>
              {icon && (
                <View
                  style={{
                    top: 16,
                    left: 16,
                    width: 20,
                    height: 20,
                    position: "absolute",
                  }}
                >
                  <FontAwesome6 name={icon} size={16} color="#000" />
                </View>
              )}

              <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <TextInput
                  value={value ? value.toString() : ""}
                  style={{
                    zIndex: 1,
                    padding: 12,
                    paddingLeft: icon ? 40 : 16,
                    paddingHorizontal: 16,

                    fontSize: 16,
                    fontFamily: "OpenSans_600SemiBold",

                    borderWidth: 2,
                    borderColor: fieldState.error || error ? "#FF4141" : "#000",
                    borderRadius: 8,

                    opacity: disabled ? 0.5 : 1,
                    minHeight: multiline ? 100 : undefined,
                  }}
                  editable={!disabled}
                  multiline={multiline}
                  placeholder={placeholder}
                  keyboardType={type === "password" ? "default" : type}
                  onChangeText={handleChange}
                  secureTextEntry={type === "password"}
                  selectTextOnFocus={!disabled}
                  placeholderTextColor={"#aba9a9"}
                />
              </TouchableWithoutFeedback>
            </View>

            {content && (
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "OpenSans_600SemiBold",

                  color: "#000",
                  marginTop: 8,
                }}
              >
                {content}
              </Text>
            )}

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
