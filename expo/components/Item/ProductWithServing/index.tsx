import Item from "@/components/Item";

import { ServingData } from "@/schemas/serving";
import { Product, ProductInsert } from "@/types";

type ItemProductWithServingProps = {
  icon?: boolean;
  border?: boolean;
  product: Product | ProductInsert;
  serving: ServingData;
  onPress: () => void;
};

function getCalories(
  product: Product | ProductInsert,
  serving: ServingData,
): number | string {
  const grams = serving.gram || 0;
  const calories = product?.calorie_100g || 0;
  const caloriesCalculated = (calories / 100) * grams;
  const caloriesRounded = Math.round(caloriesCalculated);

  return caloriesRounded;
}

export default function ItemProductWithServing({
  icon = true,
  border = true,
  product,
  serving,
  onPress,
}: ItemProductWithServingProps) {
  const grams = serving.gram || 0;
  const calories = getCalories(product, serving);

  const title = product.title || "Loading...";
  const brand = product.brand || "No brand";
  const subtitle = product.title ? brand : "Loading...";

  return (
    <Item
      title={title}
      border={border}
      iconId={icon ? product.icon_id : undefined}
      subtitle={subtitle}
      rightTop={calories ? `${calories} kcal` : null}
      rightBottom={grams ? `${grams} g` : null}
      onPress={onPress}
    />
  );
}
