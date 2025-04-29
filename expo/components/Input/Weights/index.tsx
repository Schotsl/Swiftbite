import Modal from "@/components/Modal";
import Label from "@/components/Input/Label";
import ButtonSmall from "@/components/Button/Small";

import { Picker } from "@react-native-picker/picker";
import { Weight } from "@/schemas/personal/health";
import { useState } from "react";
import { Text, View } from "react-native";
import { transformDate } from "@/helper";
import { Control, useController } from "react-hook-form";

type InputWeightsProps = {
  name: string;
  label: string;
  control: Control<any>;
};

export default function InputWeights({
  name,
  label,
  control,
}: InputWeightsProps) {
  const {
    field: { value, onChange },
  } = useController({
    name,
    control,
  });

  // TODO: Should be a type "normally" instead of having to cast
  const weights: Weight[] = value;

  const [visible, setVisible] = useState(false);
  const [temporary, setTemporary] = useState(75);

  const handleClose = () => {
    setVisible(false);
  };

  const handleOpen = () => {
    setTemporary(weights.length > 0 ? weights[0].weight : 75);
    setVisible(true);
  };

  const handleChange = (selectedWeight: number) => {
    setTemporary(selectedWeight);
  };

  const handleSave = () => {
    const newEntry = {
      date: new Date(),
      weight: temporary,
    };

    onChange([newEntry, ...weights]);

    setVisible(false);
  };

  const handleDelete = (indexToDelete: number) => {
    // Filter out the entry to delete
    onChange(weights.filter((_, index) => index !== indexToDelete));
  };

  const options = Array.from({ length: 2010 }, (_, i) => i / 10 + 50);
  const sorted = [...weights].reverse();

  return (
    <View>
      <Label label={label} />

      <View style={{ marginTop: -12 }}>
        {sorted.map((entry: Weight, index: number) => (
          <View
            key={index}
            style={{
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 12,

              borderColor: "#000",
              borderBottomWidth: 2,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: "OpenSans_400Regular",
              }}
            >
              {entry.weight.toFixed(1)} kg
            </Text>

            <Text
              style={{
                fontSize: 18,
                fontFamily: "OpenSans_400Regular",
              }}
            >
              {transformDate(entry.date)}
            </Text>

            <ButtonSmall
              icon="trash"
              onPress={() => handleDelete(index)}
              nano
            />
          </View>
        ))}

        <View
          style={{
            alignItems: "flex-end",
            paddingVertical: 12,
          }}
        >
          <ButtonSmall icon="plus" onPress={handleOpen} nano />
        </View>

        <Modal
          title="Gewicht toevoegen"
          button="Gewicht opslaan"
          visible={visible}
          onClose={handleClose}
          onButton={handleSave}
        >
          <Picker
            style={{ marginVertical: -20 }}
            selectedValue={temporary}
            onValueChange={handleChange}
          >
            {options.map((option) => (
              <Picker.Item
                key={option}
                value={option}
                label={`${option.toFixed(1)} kg`}
              />
            ))}
          </Picker>
        </Modal>
      </View>
    </View>
  );
}
