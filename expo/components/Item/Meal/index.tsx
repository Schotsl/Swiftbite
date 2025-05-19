import Item from "@/components/Item";

import { MealWithProduct } from "@/types/meal";
import { getMacrosFromMeal } from "@/helper";
import { ServingData } from "@/schemas/serving";

type ItemMealProps = {
  meal: MealWithProduct;
  serving?: ServingData | null;

  icon?: boolean;
  border?: boolean;

  onSelect: (meal: string) => void;
};

export default function ItemMeal({
  meal,
  serving,
  icon = true,
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
      title={meal.title}
      border={border}
      iconId={icon ? meal.icon_id : undefined}
      subtitle={`${length} ${length === 1 ? "ingrediënt" : "ingrediënten"}`}
      subtitleIcon="bowl-food"
      rightTop={macros.calories ? `${macros.calories} kcal` : null}
      rightBottom={macros.gram ? `${macros.gram} g` : null}
      onPress={() => onSelect(meal.uuid)}
    />
  );
}
