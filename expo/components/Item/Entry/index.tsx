import Item from "@/components/Item";

import { getOptions } from "@/helper";
import { EntryWithProduct } from "@/types";

type ItemEntryProps = {
  item: EntryWithProduct;
};

function getGrams(item: EntryWithProduct): number | null {
  const product = item.product;
  const options = getOptions(product);

  const optionSelected = item.consumed_option || "100-gram";
  const optionObject = options.find(
    (option) => option.value === optionSelected
  );

  return optionObject?.gram || null;
}

function getCalories(item: EntryWithProduct): number | string {
  const grams = getGrams(item) || 0;
  const product = item.product;

  const quantity = item.consumed_quantity || 0;
  const quantityGram = quantity * grams;

  const calories = product?.calorie_100g || 0;
  const caloriesCalculated = (calories / 100) * quantityGram;
  const caloriesRounded = Math.round(caloriesCalculated);

  return caloriesRounded;
}

export default function ItemEntry({ item }: ItemEntryProps) {
  const grams = getGrams(item);
  const calories = getCalories(item);

  const title = item.product.title || "Loading...";
  const brand = item.product.brand || "No brand";
  const subtitle = item.product.title ? brand : "Loading...";

  return (
    <Item
      title={title}
      iconId={item.product.icon_id}
      subtitle={subtitle}
      rightTop={calories ? `${calories} kcal` : null}
      rightBottom={grams ? `${grams} g` : null}
      onPress={() => {}}
    />
  );
}
