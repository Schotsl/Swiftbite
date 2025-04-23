import Item from "@/components/Item";

import { MealWithProduct } from "@/types";
import { getMacrosFromMeal } from "@/helper";

type ItemMealProps = {
  meal: MealWithProduct;
  icon?: boolean;
  border?: boolean;

  onPress: () => void;
};

export default function ItemMeal({
  meal,
  icon = true,
  border = true,

  onPress,
}: ItemMealProps) {
  const length = meal.meal_product.length;
  const macros = getMacrosFromMeal(meal);

  return (
    <Item
      title={meal.title}
      border={border}
      iconId={icon ? meal.icon_id : undefined}
      subtitle={`${length} ${length === 1 ? "ingrediënt" : "ingrediënten"}`}
      subtitleIcon="bowl-food"
      rightTop={macros.calories ? `${macros.calories} kcal` : null}
      rightBottom={macros.gram ? `${macros.gram} g` : null}
      onPress={onPress}
    />
  );
}
