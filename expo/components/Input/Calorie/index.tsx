import Input from "@/components/Input";
import Modal from "@/components/Modal";
import Label from "@/components/Input/Label";
import ButtonSmall from "@/components/Button/Small";

import { useState } from "react";
import { Text, View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalorieData, calorieSchema } from "@/schemas/personal/goal";
import { Control, useController, useForm } from "react-hook-form";

type InputMacroProps = {
  name: string;
  label: string;
  control: Control<any>;
};

export default function InputMacro({ name, label, control }: InputMacroProps) {
  const [visible, setVisible] = useState(false);

  const {
    field: { value, onChange },
  } = useController({
    name,
    control,
  });

  const {
    control: localControl,
    setValue,
    handleSubmit,
  } = useForm<CalorieData>({
    resolver: zodResolver(calorieSchema),
  });

  const handleClose = () => {
    setVisible(false);
  };

  const handleOpen = () => {
    setValue("calories", value);

    setVisible(true);
  };

  const handleSave = (data: CalorieData) => {
    onChange(data.calories);

    setVisible(false);
  };

  return (
    <View>
      <Label label={label} />

      <View
        style={{
          marginTop: -4,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontFamily: "OpenSans_600SemiBold",
          }}
        >
          {value} kcal
        </Text>

        <ButtonSmall icon="pencil" onPress={handleOpen} nano />
      </View>

      <Modal
        title={label}
        button="Wijzigen opslaan"
        visible={visible}
        onClose={handleClose}
        onButton={handleSubmit(handleSave)}
      >
        <Input
          type="number-pad"
          name="calories"
          label="Caloriebudget"
          control={localControl}
          placeholder="0"
        />
      </Modal>
    </View>
  );
}
