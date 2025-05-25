import { useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { Control, Controller } from "react-hook-form";
import {
  View,
  Keyboard,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";

import React from "react";
import InputLabel from "./Label";
import TextBody from "@/components/Text/Body";
import TextSmall from "@/components/Text/Small";

import variables from "@/variables";
import Text from "../Text";

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
};

export default function Input({
  name,
  control,

  type = "default",
  icon,
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

          if (type === "numeric") {
            const filtered = text.replace(/[^0-9]/g, "");

            onChange(filtered);

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
                    placeholderTextColor={"#999999"}
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
              <Text
                size={12}
                color={variables.colors.text.secondary}
                style={{ marginTop: variables.input.margin }}
                weight="semibold"
              >
                {content}
              </Text>
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
