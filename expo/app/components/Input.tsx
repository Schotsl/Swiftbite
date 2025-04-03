import React from "react";
import { Text, TextInput, View } from "react-native";
import { ZodType } from "zod";
import { Controller, Control } from "react-hook-form";

type Type =
  | "default"
  | "numeric"
  | "email-address"
  | "phone-pad"
  | "number-pad";

type InputProps = {
  type?: Type;
  value?: string;
  label?: string;
  password?: boolean;
  disabled?: boolean;
  placeholder: string;
  error?: string;
  name: string;
  control?: Control<any>;
  schema?: ZodType<any>;
  onChange?: (text: string) => void;
};

export default function Input({
  type = "default",
  value,
  label,
  password = false,
  disabled = false,
  placeholder,
  error,
  name,
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
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View>
            {label && (
              <Text style={{ fontSize: 16, color: "#000", marginBottom: 6 }}>
                {label}
              </Text>
            )}

            <TextInput
              value={value}
              style={{
                padding: 12,
                fontSize: 16,
                borderWidth: 1,
                borderColor: error ? "#FF4141" : "#ddd",
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
        )}
      />
    );
  }

  // Fallback to the standard input for non-form usage
  return (
    <View>
      {label && (
        <Text style={{ fontSize: 16, color: "#000", marginBottom: 6 }}>
          {label}
        </Text>
      )}

      <TextInput
        value={value}
        style={{
          padding: 12,
          fontSize: 16,
          borderWidth: 1,
          borderColor: error ? "#FF4141" : "#ddd",
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
