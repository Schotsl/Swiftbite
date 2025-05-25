import Input from "@/components/Input";
import Modal from "@/components/Modal";
import Label from "@/components/Input/Label";
import TextInput from "@/components/Text/Input";
import ButtonSmall from "@/components/Button/Small";

import language from "@/language";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TouchableOpacity, View } from "react-native";
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

      <TouchableOpacity onPress={handleOpen}>
        <View
          style={{
            marginTop: -4,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TextInput>
            {value} {language.macros.calories.short}
          </TextInput>

          <ButtonSmall icon="pencil" onPress={handleOpen} nano />
        </View>
      </TouchableOpacity>

      <Modal
        title={label}
        button={language.modifications.getEdit(label)}
        visible={visible}
        onClose={handleClose}
        onButton={handleSubmit(handleSave)}
      >
        <Input
          type="number-pad"
          name="calories"
          suffix={language.macros.calories.short}
          control={localControl}
          placeholder="0"
        />
      </Modal>
    </View>
  );
}
