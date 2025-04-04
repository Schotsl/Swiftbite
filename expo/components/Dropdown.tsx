import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";

type Option = {
  id: string;
  label: string;
  value: any;
};

type DropdownProps = {
  label: string;
  options: Option[];
  selected: string;
  placeholder: string;

  disabled?: boolean;

  onSelect: (option: Option) => void;
};

export default function Dropdown({
  label,
  options,
  selected,
  placeholder,

  disabled = false,

  onSelect,
}: DropdownProps) {
  const [visible, setVisible] = useState(false);

  const selectedOptions = options.find((option) => option.id === selected);

  const handleSelect = (option: Option) => {
    onSelect(option);

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
      {label && (
        <Text style={{ fontSize: 16, color: "#000", marginBottom: 6 }}>
          {label}
        </Text>
      )}

      <TouchableOpacity
        style={{
          padding: 12,

          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 8,

          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",

          opacity: disabled ? 0.5 : 1,
        }}
        onPress={handleOpen}
      >
        <Text style={{ fontSize: 16, color: "#000" }}>
          {selectedOptions ? selectedOptions.label : placeholder}
        </Text>

        <Ionicons name="chevron-down" size={16} color="#000" />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent={true}
        animationType="none"
        onRequestClose={handleClose}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            padding: 12,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          onPress={handleClose}
          activeOpacity={1}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              padding: 12,
              paddingTop: 0,
              paddingBottom: 14,
              borderRadius: 12,
              backgroundColor: "#fff",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottomWidth: 1,
                borderBottomColor: "#eee",
              }}
            >
              <View
                style={{
                  padding: 16,
                  paddingHorizontal: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: "#000",
                  }}
                >
                  Select an Option
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleClose}
                style={{
                  padding: 16,
                  paddingHorizontal: 12,
                }}
              >
                <Ionicons name="close" size={22} color="#000" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "space-between",

                    padding: 16,
                    overflow: "hidden",
                    borderRadius: 12,

                    borderBottomColor: "#eee",
                    borderBottomWidth: index !== options.length - 1 ? 1 : 0,
                    backgroundColor:
                      selected === item.id ? "#405cf5" : "transparent",
                  }}
                  onPress={() => {
                    handleSelect(item);
                  }}
                >
                  <Text
                    style={{
                      color: selected === item.id ? "#fff" : "#000",
                      fontSize: 16,
                    }}
                  >
                    {item.label}
                  </Text>

                  {selected === item.id && (
                    <Ionicons name="checkmark" size={22} color="#fff" />
                  )}
                </TouchableOpacity>
              )}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
