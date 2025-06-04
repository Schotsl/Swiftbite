import Modal from "@/components/Modal";
import Label from "@/components/Input/Label";
import TextLarge from "@/components/Text/Large";
import EmptySmall from "@/components/Empty/Small";
import ButtonSmall from "@/components/Button/Small";

import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Weight } from "@/schemas/personal/health";
import { useState } from "react";
import { transformDate } from "@/helper";
import { useController, Control } from "react-hook-form";

import language from "@/language";
import variables from "@/variables";

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
  const weights: Weight[] = value || [];

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
        {sorted.length === 0 ? (
          <EmptySmall
            left={true}
            style={{ marginBottom: -12 }}
            content={language.input.weight.empty}
            onPress={handleOpen}
          />
        ) : (
          <InputWeightsList weights={sorted} onDelete={handleDelete} />
        )}

        <View
          style={{
            paddingVertical: 12,
          }}
        >
          <ButtonSmall
            icon="plus"
            nano={true}
            style={{ marginLeft: "auto" }}
            onPress={handleOpen}
          />
        </View>
      </View>

      <Modal
        title={language.input.weight.add}
        button={language.input.weight.button}
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
              label={`${option.toFixed(1)} ${language.measurement.metric.weight}`}
            />
          ))}
        </Picker>
      </Modal>
    </View>
  );
}

type InputWeightsListProps = {
  weights: Weight[];
  onDelete: (index: number) => void;
};

function InputWeightsList({ weights, onDelete }: InputWeightsListProps) {
  return (
    <View>
      {weights.map((entry: Weight, index: number) => (
        <View
          key={index}
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 12,

            borderColor: variables.border.color,
            borderBottomWidth: variables.border.width,
          }}
        >
          <TextLarge>
            {entry.weight.toFixed(1)} {language.measurement.metric.weight}
          </TextLarge>

          <TextLarge>{transformDate(entry.date)}</TextLarge>

          <ButtonSmall icon="trash" onPress={() => onDelete(index)} nano />
        </View>
      ))}
    </View>
  );
}
