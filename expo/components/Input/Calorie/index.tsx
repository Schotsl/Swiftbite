import Input from "@/components/Input";
import Modal from "@/components/Modal";
import Label from "@/components/Input/Label";
import ButtonSmall from "@/components/Button/Small";

import { View } from "react-native";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalorieData, calorieSchema } from "@/schemas/personal/goal";
import { Control, useController, useForm } from "react-hook-form";
import TextInput from "@/components/Text/Input";

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
        <TextInput>{value} kcal</TextInput>

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
          suffix="kcal"
          control={localControl}
          placeholder="0"
        />
      </Modal>
    </View>
  );
}
