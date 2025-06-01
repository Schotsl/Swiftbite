import { User } from "@/types/user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIsFocused } from "@react-navigation/native";
import { MealWithProduct } from "@/types/meal";
import { ScrollView, View } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { MealPageData, mealPageSchema, ServingData } from "@/schemas/serving";
import { getOptions, isMealFavorite, toggleMealFavorite } from "@/helper";

import useUpdateUser from "@/mutations/useUpdateUser";

import language from "@/language";
import variables from "@/variables";

import Header from "@/components/Header";
import TextBody from "@/components/Text/Body";
import Input from "@/components/Input";
import InputTime from "@/components/Input/Time";
import InputDropdown from "@/components/Input/Dropdown";
import ProductInfo from "@/components/Product/Info";
import ProductImpact from "@/components/Product/Impact";
import ButtonOverlay from "@/components/Button/Overlay";
import ProductNutrition from "@/components/Product/Nutrition";

export type PageMealProps = {
  user: User;
  meal: MealWithProduct;
  serving?: ServingData | null;
  created?: Date | null;
  createdVisible?: boolean;

  onSave: (serving: ServingData, created: Date) => void;
  onDelete?: () => void;
  onRepeat?: (serving: ServingData) => void;
};

export default function PageMeal({
  user,
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

  const [saving, setSaving] = useState(false);
  const [favorite, setFavorite] = useState(isMealFavorite(user, meal.uuid));

  const { watch, control, reset, handleSubmit } = useForm<MealPageData>({
    resolver: zodResolver(mealPageSchema),
    defaultValues: {
      option: propServing?.option || "meal",
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
      option: propServing?.option || "meal",
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
    const length = meal.meal_products?.length || 0;

    items.push({
      key: "ingredients",
      icon: "bowl-food",
      value: language.types.ingredient.getCount(length),
    });

    items.push({
      key: "quantity",
      icon: "weight-hanging",
      value: `${meal.quantity_gram} g`,
    });

    return items;
  }, [meal]);

  const options = getOptions({ meal });
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
            gap: variables.gap.large,
            padding: variables.padding.page,
            paddingBottom: variables.paddingOverlay,
          }}
        >
          <View>
            <Header
              title={meal.title}
              favorite={favorite}
              onDelete={onDelete}
              onRepeat={onRepeat && (() => onRepeat(serving))}
              onFavorite={handleFavorite}
            />

            <ProductInfo items={info} />
          </View>

          <View style={{ gap: variables.gap.small }}>
            <TextBody weight="semibold">
              {language.input.serving.group}
            </TextBody>

            <InputDropdown
              name="option"
              label={language.input.serving.size.title}
              options={options}
              control={control}
              placeholder={language.input.serving.size.placeholder}
            />

            <Input
              name="quantity"
              type="decimal-pad"
              label={language.input.serving.amount.title}
              placeholder={language.input.serving.amount.placeholder}
              control={control}
            />
          </View>

          {createdVisible && (
            <View style={{ gap: variables.gap.small }}>
              <TextBody weight="semibold">{language.input.time.group}</TextBody>

              <InputTime
                name="created_at"
                label={language.input.time.title}
                control={control}
              />
            </View>
          )}

          <ProductImpact meal={meal} serving={serving} />

          <ProductNutrition meal={meal} serving={serving} />
        </View>
      </ScrollView>

      <ButtonOverlay
        loading={saving}
        disabled={saving}
        title={
          propServing
            ? language.modifications.getEdit(language.types.meal.single)
            : language.modifications.getSave(language.types.meal.single)
        }
        onPress={handleSubmit(handleSave)}
      />
    </View>
  );
}
