import React, { useState } from "react";

import { FontAwesome6 } from "@expo/vector-icons";
import { Control, Controller } from "react-hook-form";
import {
  View,
  Keyboard,
  TextInput,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

import InputLabel from "./Label";
import TextBody from "@/components/Text/Body";
import Text from "../Text";

import variables from "@/variables";

type Type = "default" | "decimal-pad" | "password";

type InputProps = {
  name: string;
  control: Control<any>;

  type?: Type;
  icon?: keyof typeof FontAwesome6.glyphMap;
  style?: StyleProp<ViewStyle>;
  label?: string;
  suffix?: string;
  content?: string;
  required?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  placeholder: string;

  error?: string;

  onBlur?: () => void;
  onFocus?: () => void;
  onSubmit?: () => void;
  onContent?: () => void;
};

export default function Input({
  name,
  control,

  type = "default",
  icon,
  style,
  label,
  suffix,
  content,
  required = true,
  disabled = false,
  multiline = false,
  placeholder,
  error,

  onBlur,
  onFocus,
  onSubmit,
  onContent,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState }) => {
        const handleChange = (text: string) => {
          if (disabled) {
            return;
          }

          if (type === "decimal-pad") {
            const filtered = text.replace(/[^0-9.,]/g, "");
            const transformed = filtered.replace(/,/g, ".");

            onChange(transformed);

            return;
          }

          onChange(text);
        };

        let border = variables.border.color;

        if (fieldState.error || error) {
          border = variables.colors.text.error;
        }

        if (isFocused) {
          border = variables.colors.text.focused;
        }

        return (
          <View style={style}>
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
                    zIndex: 2,
                  }}
                >
                  <FontAwesome6
                    name={icon}
                    size={16}
                    color={variables.colors.text.primary}
                  />
                </View>
              )}

              <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View
                  style={{
                    borderColor: border,
                    borderWidth: variables.border.width,
                    borderRadius: variables.border.radius,
                    flexDirection: "row",
                    opacity: disabled ? 0.5 : 1,
                    minHeight: multiline ? 100 : undefined,
                  }}
                >
                  <TextInput
                    value={value !== undefined ? value.toString() : ""}
                    style={{
                      flex: 1,
                      color: variables.colors.text.primary,
                      zIndex: 1,
                      paddingVertical: 12,
                      paddingLeft: icon ? 44 : 16,
                      paddingRight: suffix ? 0 : 16,
                      fontSize: 16,
                      fontFamily: "OpenSans_600SemiBold",
                      backgroundColor: variables.colors.transparent,
                    }}
                    editable={!disabled}
                    multiline={multiline}
                    placeholder={placeholder}
                    keyboardType={type === "password" ? "default" : type}
                    secureTextEntry={type === "password"}
                    selectTextOnFocus={!disabled}
                    placeholderTextColor={variables.border.color}
                    onBlur={() => {
                      setIsFocused(false);

                      onBlur?.();
                    }}
                    onFocus={() => {
                      setIsFocused(true);

                      onFocus?.();
                    }}
                    onChangeText={handleChange}
                    onSubmitEditing={onSubmit}
                  />

                  {suffix && (
                    <View
                      style={{
                        minWidth: 70,
                        paddingHorizontal: 10,
                        height: "100%",
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                        backgroundColor: "#EEEEEE",
                        borderLeftWidth: 1,
                        borderColor: border,
                        borderTopRightRadius: 7,
                        borderBottomRightRadius: 7,
                      }}
                    >
                      <TextBody weight="semibold" color="#555555">
                        {suffix}
                      </TextBody>
                    </View>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>

            {content && (
              <InputContent content={content} onContent={onContent} />
            )}

            {(fieldState.error || error) && (
              <Text
                size={12}
                color={variables.colors.text.error}
                style={{ marginTop: variables.input.margin }}
                weight="semibold"
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

type InputContentProps = {
  content: string;
  onContent?: () => void;
};

export function InputContent({ content, onContent }: InputContentProps) {
  if (onContent) {
    return (
      <TouchableOpacity onPress={onContent}>
        <Text
          size={14}
          color={variables.colors.text.secondary}
          style={{
            marginTop: variables.input.margin,
            textDecorationLine: "underline",
          }}
          weight="semibold"
        >
          {content}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <Text
      size={14}
      color={variables.colors.text.secondary}
      style={{ marginTop: variables.input.margin }}
      weight="semibold"
    >
      {content}
    </Text>
  );
}
