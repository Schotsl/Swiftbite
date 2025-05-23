import Modal from "@/components/Modal";
import Label from "@/components/Input/Label";
import InputMacroItem from "./Item";
import InputMacroSlider from "./Slider";

import { View } from "react-native";
import { useState } from "react";
import { MacroData } from "@/schemas/personal/goal";
import { Control, useController } from "react-hook-form";
import language from "@/language";

type MacroDataKey = keyof MacroData;

type InputMacroProps = {
  name: string;
  label: string;
  control: Control<any>;
  calories: number;
};

export default function InputMacro({
  name,
  label,
  control,
  calories,
}: InputMacroProps) {
  const {
    field: { value, onChange },
  } = useController({
    name,
    control,
  });
  const [order, setOrder] = useState<MacroDataKey[]>([
    "fat",
    "carbs",
    "protein",
  ]);

  const [visible, setVisible] = useState(false);
  const [temporary, setTemporary] = useState<MacroData>(value);

  const macro = value as MacroData;

  const handleClose = () => {
    setVisible(false);
  };

  const handleOpen = () => {
    setOrder(["carbs", "protein", "fat"]);
    setTemporary(macro);

    setVisible(true);
  };

  // NOTE: Almost all of this code was written using Gemini-2.5-Pro so I am taking no credit for it
  const handleChange = (name: MacroDataKey, value: number) => {
    // Clamp the input value between 0 and 1
    value = Math.max(0, Math.min(1, value));

    // Calculate the new adjustment order first
    const orderFiltered = order.filter((item) => item !== name);
    const orderUpdated = [...orderFiltered, name];

    // Update the order state
    setOrder(orderUpdated);

    // Update the macro values based on the new order
    setTemporary((prev) => {
      const oldValues = { ...prev };
      const currentValues = { ...prev };
      currentValues[name] = value;

      // Determine which sliders to adjust based on the NEW order
      const [leastRecentKey, secondRecentKey] = orderUpdated;

      let remainingDelta = value - oldValues[name];

      // 1. Adjust least recently adjusted
      const leastRecentValue = currentValues[leastRecentKey];
      const leastRecentValuePotential = leastRecentValue - remainingDelta;
      const leastRecentValueUpdated = Math.max(
        0,
        Math.min(1, leastRecentValuePotential)
      );

      const leastRecentValueDelta = leastRecentValue - leastRecentValueUpdated;

      currentValues[leastRecentKey] = leastRecentValueUpdated;

      remainingDelta -= leastRecentValueDelta;

      // 2. Adjust second least recently adjusted with any leftover delta
      if (Math.abs(remainingDelta) > 1e-10) {
        const secondLeastRecentValue = currentValues[secondRecentKey];
        const secondLeastRecentValuePotential =
          secondLeastRecentValue - remainingDelta;

        const newSecondLeastRecentValue = Math.max(
          0,
          Math.min(1, secondLeastRecentValuePotential)
        );

        currentValues[secondRecentKey] = newSecondLeastRecentValue;
      }

      // We don't do a final correction here to force sum = 1 as it can lead to jerky behavior during sliding.
      return currentValues;
    });
  };

  // NOTE: This is also written using Gemini-2.5-Pro I barely understand it but it works
  const handleModalSave = () => {
    let { fat, carbs, protein } = temporary;

    const sum = fat + carbs + protein;

    if (Math.abs(sum - 1) > 1e-9 && sum > 1e-9) {
      // Normalize if sum is significantly different from 1 and not zero
      carbs /= sum;
      protein /= sum;
      fat = 1 - carbs - protein;
    } else if (Math.abs(sum - 1) > 1e-9) {
      // Handle edge case where sum is near zero (set default distribution)
      fat = 1 / 3;
      carbs = 1 / 3;
      protein = 1 / 3;
    }

    // Ensure no value is negative after potential floating point issues in normalization
    carbs = Math.max(0, carbs);
    protein = Math.max(0, protein);

    fat = Math.max(0, 1 - carbs - protein);

    onChange({
      fat: fat,
      carbs: carbs,
      protein: protein,
    });

    setVisible(false);
  };

  return (
    <View>
      <Label label={label} />

      <View style={{ gap: 32 }}>
        <InputMacroItem
          label={language.macros.carbs.short}
          percentage={macro.carbs}
          description={language.macros.carbs.explanation}
          onPress={handleOpen}
        />

        <InputMacroItem
          label={language.macros.protein.short}
          percentage={macro.protein}
          description={language.macros.protein.explanation}
          onPress={handleOpen}
        />

        <InputMacroItem
          label={language.macros.fats.short}
          percentage={macro.fat}
          description={language.macros.fats.explanation}
          onPress={handleOpen}
        />
      </View>

      <Modal
        title={label}
        button={language.macros.button}
        visible={visible}
        onClose={handleClose}
        onButton={handleModalSave}
      >
        <View style={{ gap: 32 }}>
          <InputMacroSlider
            type="carbs"
            label={language.macros.carbs.long}
            value={temporary.carbs}
            calories={calories}
            onChange={(value) => handleChange("carbs", value)}
          />

          <InputMacroSlider
            type="protein"
            label={language.macros.protein.long}
            value={temporary.protein}
            calories={calories}
            onChange={(value) => handleChange("protein", value)}
          />

          <InputMacroSlider
            type="fat"
            label={language.macros.fats.long}
            value={temporary.fat}
            calories={calories}
            onChange={(value) => handleChange("fat", value)}
          />
        </View>
      </Modal>
    </View>
  );
}
