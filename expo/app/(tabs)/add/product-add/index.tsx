import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollView, Alert, View } from "react-native";
import { ManualData, manualSchema } from "@/schemas/insert/manual";

import variables from "@/variables";
import language from "@/language";

import Input from "@/components/Input";
import Header from "@/components/Header";
import Divider from "@/components/Divider";
import TextBody from "@/components/Text/Body";
import ButtonOverlay from "@/components/Button/Overlay";

export default function ProductAdd() {
  useEffect(() => {
    Alert.alert(language.alert.demo.title, language.alert.demo.subtitle);
  }, []);

  const { control, handleSubmit } = useForm<ManualData>({
    resolver: zodResolver(manualSchema),
    defaultValues: {
      title: "",
      created_at: new Date(),
      calorie_100g: 0,
      protein_100g: 0,
      carbohydrate_100g: 0,
      carbohydrate_sugar_100g: 0,
      fat_100g: 0,
      fat_trans_100g: 0,
      fat_saturated_100g: 0,
      fat_unsaturated_100g: 0,
      iron_100g: 0,
      fiber_100g: 0,
      sodium_100g: 0,
      calcium_100g: 0,
      potassium_100g: 0,
      cholesterol_100g: 0,
    },
  });

  return (
    <View>
      <ScrollView style={{ minHeight: "100%" }}>
        <View
          style={{
            minHeight: "100%",

            gap: variables.gap.large,
            padding: variables.padding.page,
            paddingBottom: variables.paddingOverlay,
          }}
        >
          <Header
            title={"Product toevoegen"}
            content={`Voeg hier een product toe. Daarna kun je het makkelijk opnieuw gebruiken, herhalen en aan maaltijden toevoegen.`}
          />

          <View style={{ gap: variables.gap.normal }}>
            <TextBody weight="semibold">Productinformatie</TextBody>
            <Input
              name="title"
              label={language.page.estimation.input.title.title}
              control={control}
              placeholder={language.page.estimation.input.title.placeholder}
            />

            <Input
              name="title"
              label={"Barcode"}
              control={control}
              required={false}
              placeholder={"8710400418023"}
            />

            <Input
              name="title"
              label={"Merk"}
              control={control}
              required={false}
              placeholder={"Calvé"}
            />

            <View style={{ gap: 18, flexDirection: "row" }}>
              <Input
                name="quantity"
                type="decimal-pad"
                style={{ flex: 1 }}
                label="Inhoud"
                suffix={language.macros.calories.short}
                control={control}
                required={false}
                placeholder="100"
              />

              <Input
                name="serving"
                type="decimal-pad"
                style={{ flex: 1 }}
                label="Servering"
                suffix={language.measurement.units.gram.long}
                control={control}
                required={false}
                placeholder="25"
              />
            </View>
          </View>

          <View style={{ gap: 24 }}>
            <View style={{ gap: variables.gap.normal }}>
              <TextBody weight="semibold">Voedingswaarden</TextBody>

              <View style={{ gap: 18, flexDirection: "row" }}>
                <Input
                  type="decimal-pad"
                  name="calorie_100g"
                  style={{ flex: 1 }}
                  label={language.macros.calories.long}
                  suffix={language.macros.calories.short}
                  control={control}
                  placeholder="0"
                />

                <Input
                  type="decimal-pad"
                  name="protein_100g"
                  style={{ flex: 1 }}
                  label={language.macros.protein.long}
                  suffix={language.measurement.units.gram.long}
                  control={control}
                  placeholder="0"
                />
              </View>

              <View style={{ gap: 18, flexDirection: "row" }}>
                <Input
                  type="decimal-pad"
                  name="carbohydrate_100g"
                  style={{ flex: 1 }}
                  label={language.macros.carbs.long}
                  suffix={language.measurement.units.gram.long}
                  control={control}
                  placeholder="0"
                />

                <Input
                  type="decimal-pad"
                  name="fat_100g"
                  style={{ flex: 1 }}
                  label={language.macros.fats.long}
                  suffix={language.measurement.units.gram.long}
                  control={control}
                  placeholder="0"
                />
              </View>
            </View>

            <Divider label="En" />

            <View style={{ gap: variables.gap.normal, marginTop: -8 }}>
              <Input
                type="decimal-pad"
                name="fat_saturated_100g"
                label={language.macros.nutrients.fats.saturated}
                suffix={language.measurement.units.gram.long}
                control={control}
                placeholder="0"
              />

              <Input
                type="decimal-pad"
                name="fat_unsaturated_100g"
                label={language.macros.nutrients.fats.unsaturated}
                suffix={language.measurement.units.gram.long}
                control={control}
                placeholder="0"
              />

              <Input
                type="decimal-pad"
                name="fat_trans_100g"
                label={language.macros.nutrients.fats.trans}
                suffix={language.measurement.units.gram.long}
                control={control}
                placeholder="0"
              />

              <Input
                type="decimal-pad"
                name="carbohydrate_sugar_100g"
                label={language.macros.nutrients.carbs.sugar}
                suffix={language.measurement.units.gram.long}
                control={control}
                placeholder="0"
              />

              <Input
                type="decimal-pad"
                name="fiber_100g"
                label={language.macros.nutrients.carbs.fiber}
                suffix={language.measurement.units.gram.long}
                control={control}
                placeholder="0"
              />

              <Input
                type="decimal-pad"
                name="sodium_100g"
                label={language.macros.nutrients.salt}
                suffix={language.measurement.units.gram.long}
                control={control}
                placeholder="0"
              />

              <Input
                type="decimal-pad"
                name="potassium_100g"
                label={language.macros.nutrients.potassium}
                suffix={language.measurement.units.gram.long}
                control={control}
                placeholder="0"
              />

              <Input
                type="decimal-pad"
                name="calcium_100g"
                label={language.macros.nutrients.calcium}
                suffix={language.measurement.units.gram.long}
                control={control}
                placeholder="0"
              />

              <Input
                type="decimal-pad"
                name="iron_100g"
                label={language.macros.nutrients.iron}
                suffix={language.measurement.units.milligram.long}
                control={control}
                placeholder="0"
              />

              <Input
                type="decimal-pad"
                name="cholesterol_100g"
                label={language.macros.nutrients.cholesterol}
                suffix={language.measurement.units.milligram.long}
                control={control}
                placeholder="0"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <ButtonOverlay
        title={"Product toevoegen"}
        onPress={handleSubmit(() => {})}
        loading={false}
        disabled={false}
      />
    </View>
  );
}
