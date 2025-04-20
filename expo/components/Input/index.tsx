import { FontAwesome6 } from "@expo/vector-icons";
import { Control, Controller } from "react-hook-form";
import { Text, TextInput, View } from "react-native";

import React from "react";
import InputLabel from "./Label";

type Type =
  | "default"
  | "numeric"
  | "email-address"
  | "phone-pad"
  | "number-pad";

type InputProps = {
  name: string;
  type?: Type;
  icon?: keyof typeof FontAwesome6.glyphMap;
  value?: string;
  label?: string;
  content?: string;
  required?: boolean;
  password?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  placeholder: string;

  error?: string;
  control?: Control<any>;
  onChange?: (text: string) => void;
};

export default function Input({
  name,
  type = "default",
  icon,
  value,
  label,
  content,
  required = true,
  password = false,
  disabled = false,
  multiline = false,
  placeholder,
  error,
  control,
  onChange,
}: InputProps) {
  const handleChange = (text: string) => {
    if (disabled) {
      return;
    }

    onChange?.(text);
  };

  // If control is provided, use Controller from react-hook-form
  if (control) {
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

                <TextInput
                  value={value ? value.toString() : ""}
                  style={{
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
                  keyboardType={type}
                  onChangeText={handleChange}
                  secureTextEntry={password}
                  selectTextOnFocus={!disabled}
                />
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

  // Fallback to the standard input for non-form usage
  return (
    <View>
      {label && <InputLabel label={label} />}

      <View
        style={{
          position: "relative",
        }}
      >
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

        <TextInput
          value={value}
          style={{
            padding: 12,
            paddingLeft: icon ? 40 : 16,
            paddingHorizontal: 16,

            fontSize: 16,
            fontFamily: "OpenSans_600SemiBold",

            borderWidth: 2,
            borderColor: error ? "#FF4141" : "#000",
            borderRadius: 8,

            opacity: disabled ? 0.5 : 1,
            minHeight: multiline ? 100 : undefined,
          }}
          editable={!disabled}
          placeholder={placeholder}
          keyboardType={type}
          secureTextEntry={password}
          selectTextOnFocus={!disabled}
          onChangeText={handleChange}
        />
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

      {error && (
        <Text
          style={{
            fontSize: 14,
            fontFamily: "OpenSans_600SemiBold",

            color: "#FF4141",
            marginTop: 8,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
