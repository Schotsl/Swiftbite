import Item from "@/components/Item";

import { MealWithProduct } from "@/types/meal";
import { getMacrosFromMeal } from "@/helper";
import { ServingData } from "@/schemas/serving";
import language from "@/language";

type ItemMealProps = {
  meal: MealWithProduct;
  serving?: ServingData | null;

  icon?: boolean;
  small?: boolean;
  border?: boolean;

  onSelect: (meal: string) => void;
};

export default function ItemMeal({
  meal,
  serving,
  icon = true,
  small = false,
  border = true,
  onSelect,
}: ItemMealProps) {
  const length = meal.meal_products?.length || 0;
  const adjusted = serving
    ? serving
    : {
        gram: meal.quantity_gram,
        quantity: 1,
        option: "meal",
      };

  const macros = getMacrosFromMeal(meal, adjusted);

  return (
    <Item
      small={small}
      title={meal.title}
      border={border}
      iconId={icon ? meal.icon_id : undefined}
      subtitle={language.types.ingredient.getCount(length)}
      subtitleIcon="bowl-food"
      rightTop={
        macros.calories
          ? `${macros.calories} ${language.macros.calories.short}`
          : null
      }
      rightBottom={
        macros.gram
          ? `${macros.gram} ${language.measurement.units.gram.short}`
          : null
      }
      onPress={() => onSelect(meal.uuid)}
    />
  );
}
