import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIsFocused } from "@react-navigation/native";
import { MealWithProduct } from "@/types/meal";
import { ScrollView, Text, View } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { MealPageData, mealPageSchema, ServingData } from "@/schemas/serving";
import { getOptions, isMealFavorite, toggleMealFavorite } from "@/helper";

import userData from "@/queries/userData";
import useUpdateUser from "@/mutations/useUpdateUser";

import variables from "@/variables";

import Header from "@/components/Header";
import Input from "@/components/Input";
import InputDropdown from "@/components/Input/Dropdown";
import ProductInfo from "@/components/Product/Info";
import ProductImpact from "@/components/Product/Impact";
import ButtonOverlay from "@/components/Button/Overlay";
import InputTime from "@/components/Input/Time";

export type PageMealProps = {
  meal: MealWithProduct;
  serving: ServingData;
  created: Date;
  createdVisible?: boolean;

  onSave: (serving: ServingData, created: Date) => void;
  onDelete?: () => void;
  onRepeat?: (serving: ServingData) => void;
};

export default function PageMeal({
  meal,
  serving: propServing,
  created: propCreated,
  createdVisible = false,
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
    useForm<MealPageData>({
      resolver: zodResolver(mealPageSchema),
      defaultValues: {
        option: propServing?.option || "100-gram",
        quantity: propServing?.quantity || 1,
        created_at: propCreated || new Date(),
      },
    });

  const option = watch("option");
  const quantity = watch("quantity");

  useEffect(() => {
    if (!focus) {
      return;
    }

    reset({
      option: propServing?.option || "100-gram",
      quantity: propServing?.quantity || 1,
      created_at: propCreated || new Date(),
    });
  }, [focus, propServing, propCreated, reset]);

  const handleSave = async (data: MealPageData) => {
    setSaving(true);

    onSave(serving, data.created_at);
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
              onRepeat={onRepeat && (() => onRepeat(propServing))}
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

          {createdVisible && (
            <View style={{ gap: variables.gapSmall }}>
              <Text
                style={{ fontSize: 16, fontFamily: "OpenSans_600SemiBold" }}
              >
                Tijd
              </Text>

              <InputTime name="created_at" label="Tijd" control={control} />
            </View>
          )}

          <ProductImpact meal={meal} serving={serving} />
        </View>
      </ScrollView>

      <ButtonOverlay
        title={propServing ? "Product wijzigen" : "Product opslaan"}
        onPress={handleSubmit(handleSave)}
        loading={saving}
        disabled={saving}
      />
    </View>
  );
}
