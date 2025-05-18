import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIsFocused } from "@react-navigation/native";
import { MealWithProduct } from "@/types/meal";
import { ScrollView, Text, View } from "react-native";
import { useEffect, useMemo, useState } from "react";
import {
  getMacrosFromMeal,
  getOptions,
  isMealFavorite,
  toggleMealFavorite,
} from "@/helper";
import { ServingData, ServingInput, servingSchema } from "@/schemas/serving";
import { useQuery } from "@tanstack/react-query";

import userData from "@/queries/userData";
import useUpdateUser from "@/mutations/useUpdateUser";

import variables from "@/variables";

import Header from "@/components/Header";
import Input from "@/components/Input";
import InputDropdown from "@/components/Input/Dropdown";
import ProductInfo from "@/components/Product/Info";
import ProductImpact from "@/components/Product/Impact";
import ButtonOverlay from "@/components/Button/Overlay";

export type PageMealProps = {
  meal: MealWithProduct;
  serving: ServingData;

  onSave: (serving: ServingData) => void;
  onDelete?: () => void;
  onRepeat?: (serving: ServingData) => void;
};

export default function PageMeal({
  serving: servingProp,
  meal,
  onSave,
  onDelete,
  onRepeat,
}: PageMealProps) {
  const focus = useIsFocused();

  const updateUser = useUpdateUser();

  const { data: user } = useQuery(userData());

  const [saving, setSaving] = useState(false);
  const [favorite, setFavorite] = useState(isMealFavorite(user, meal.uuid));

  const { watch, control, reset, setValue, handleSubmit } =
    useForm<ServingInput>({
      resolver: zodResolver(servingSchema),
      defaultValues: {
        option: servingProp?.option || "100-gram",
        quantity: servingProp?.quantity || 1,
      },
    });

  const option = watch("option");
  const quantity = watch("quantity");

  useEffect(() => {
    if (!focus) {
      return;
    }

    reset({
      option: servingProp?.option || "100-gram",
      quantity: servingProp?.quantity || 1,
    });
  }, [focus, servingProp, reset]);

  const handleSave = async (data: ServingInput) => {
    setSaving(true);

    onSave(serving);
  };

  const handleFavorite = () => {
    if (!user) {
      return;
    }

    setFavorite((previous) => {
      const favoriteInverted = !previous;
      const favoriteMeals = toggleMealFavorite(user, meal.uuid);

      updateUser.mutateAsync({
        ...user,
        favorite_meals: favoriteMeals,
      });

      return favoriteInverted;
    });
  };

  const info = useMemo(() => {
    const items = [];

    items.push({
      icon: "bowl-food",
      value: `${meal.meal_products?.length || 0} ingrediënten`,
    });

    items.push({
      icon: "weight-hanging",
      value: `${meal.quantity_gram} g`,
    });

    return items;
  }, [meal]);

  const options = useMemo(() => {
    const optionsObject = getOptions({ meal });

    setValue("option", "meal");

    return optionsObject;
  }, [meal, setValue]);

  const serving = useMemo(() => {
    const selected = options.find((object) => object.value === option)!;
    const gram = selected.gram * quantity;

    return { option, quantity, gram };
  }, [option, quantity, options]);

  const macros = getMacrosFromMeal(meal);

  return (
    <View>
      <ScrollView>
        <View
          style={{
            gap: variables.gapLarge,
            padding: variables.padding,
            paddingBottom: variables.paddingOverlay,
          }}
        >
          <View>
            <Header
              small={true}
              title={meal.title}
              favorite={favorite}
              onDelete={onDelete}
              onRepeat={onRepeat && (() => onRepeat(servingProp))}
              onFavorite={handleFavorite}
            />

            <ProductInfo items={info} />
          </View>

          <View style={{ gap: variables.gapSmall }}>
            <Text style={{ fontSize: 16, fontFamily: "OpenSans_600SemiBold" }}>
              Portie
            </Text>

            <InputDropdown
              name="option"
              label="Portie grote"
              options={options}
              control={control}
              placeholder="Selecteer een portie grote"
            />

            <Input
              name="quantity"
              type="numeric"
              label="Portie aantal"
              placeholder="Hoeveel porties heb je gegeten?"
              control={control}
            />
          </View>

          <ProductImpact {...macros} />
        </View>
      </ScrollView>

      <ButtonOverlay
        title={servingProp ? "Product wijzigen" : "Product opslaan"}
        onPress={handleSubmit(handleSave)}
        loading={saving}
        disabled={saving}
      />
    </View>
  );
}
