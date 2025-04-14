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
  password = false,
  disabled = false,
  placeholder,
  error,
  control,
  schema,
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
              {label && <Label label={label} />}

              <TextInput
                value={value.toString()}
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
                }}
                editable={!disabled}
                placeholder={placeholder}
                keyboardType={type}
                secureTextEntry={password}
                selectTextOnFocus={!disabled}
                onChangeText={onChange}
              />

              {error && (
                <Text style={{ fontSize: 14, color: "#FF4141", marginTop: 4 }}>
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
        }}
        editable={!disabled}
        placeholder={placeholder}
        keyboardType={type}
        secureTextEntry={password}
        selectTextOnFocus={!disabled}
        onChangeText={handleChange}
      />

      {error && (
        <Text style={{ fontSize: 14, color: "#FF4141", marginTop: 4 }}>
          {error}
        </Text>
      )}
    </View>
  );
}
