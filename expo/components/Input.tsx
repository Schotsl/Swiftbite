import React from "react";
import { Control, Controller } from "react-hook-form";
import { Text, TextInput, View } from "react-native";
import { ZodType } from "zod";

import Label from "./Label";

type Type =
  | "default"
  | "numeric"
  | "email-address"
  | "phone-pad"
  | "number-pad";

type InputProps = {
  name: string;
  type?: Type;
  value?: string;
  label?: string;
  password?: boolean;
  disabled?: boolean;
  placeholder: string;
  required?: boolean;
  multiline?: boolean;
  content?: string;
  error?: string;
  control?: Control<any>;
  schema?: ZodType<any>;
  onChange?: (text: string) => void;
};

export default function Input({
  name,
  type = "default",
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
        control={control}
        name={name}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          return (
            <View>
              {label && <Label label={label} required={required} />}

              <TextInput
                value={value ? value.toString() : ""}
                style={{
                  padding: 12,
                  paddingVertical: 14,

                  fontSize: 16,
                  fontFamily: "OpenSans_600SemiBold",

                  borderWidth: 2,
                  borderColor: error ? "#FF4141" : "#000",
                  borderRadius: 8,
                  backgroundColor: "#fff",

                  opacity: disabled ? 0.5 : 1,
                  minHeight: multiline ? 100 : undefined,
                }}
                editable={!disabled}
                multiline={multiline}
                placeholder={placeholder}
                keyboardType={type}
                secureTextEntry={password}
                selectTextOnFocus={!disabled}
                onChangeText={onChange}
              />

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
                  {error.message}
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
      {label && <Label label={label} />}

      <TextInput
        value={value}
        style={{
          padding: 12,
          paddingVertical: 14,

          fontSize: 16,
          fontWeight: "semibold",

          borderWidth: 2,
          borderColor: error ? "#FF4141" : "#000",
          borderRadius: 8,
          backgroundColor: "#fff",

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
          {error.message}
        </Text>
      )}
    </View>
  );
}
