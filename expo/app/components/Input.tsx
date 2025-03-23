import React from "react";
import { Text, TextInput, View } from "react-native";

type Type =
  | "default"
  | "numeric"
  | "email-address"
  | "phone-pad"
  | "number-pad";

type InputProps = {
  type?: Type;
  value: string;
  label?: string;
  disabled?: boolean;
  placeholder: string;

  onChange: (text: string) => void;
};

export default function Input({
  type = "default",
  value,
  label,
  disabled = false,
  placeholder,

  onChange,
}: InputProps) {
  const handleChange = (text: string) => {
    if (disabled) {
      return;
    }

    onChange(text);
  };

  return (
    <View style={{ marginBottom: 10 }}>
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
          borderColor: "#ddd",
          borderRadius: 8,
          backgroundColor: "#fff",

          opacity: disabled ? 0.5 : 1,
        }}
        editable={!disabled}
        placeholder={placeholder}
        keyboardType={type}
        selectTextOnFocus={!disabled}
        onChangeText={handleChange}
      />
    </View>
  );
}
