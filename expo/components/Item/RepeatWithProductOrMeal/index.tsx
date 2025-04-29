import Item from "@/components/Item";

import { getMacrosFromProduct } from "@/helper";
import { RepeatWithProductOrMeal } from "@/types";

type RepeatWithProductOrMealProps = {
  item: RepeatWithProductOrMeal;
  onPress: () => void;
};

export default function ItemRepeatWithProductOrMeal({
  item,
  onPress,
}: RepeatWithProductOrMealProps) {
  const translations = {
    monday: "ma",
    sunday: "zo",
    friday: "vr",
    tuesday: "di",
    thursday: "do",
    saturday: "za",
    wednesday: "wo",
  };

  const translationsArray = item.weekdays.map((day) => {
    const translationKey = day as keyof typeof translations;
    const translationValue = translations[translationKey];

    return translationValue;
  });

  const translationsJoined = translationsArray.join(", ");

  const macros = getMacrosFromProduct(item.product!, item.serving);

  return (
    <Item
      iconId={item.product?.icon_id ?? item.meal?.icon_id}
      title={item.product?.title ?? item.meal?.title ?? ""}
      subtitle={`Herhaald elke ${translationsJoined}`}
      subtitleIcon="repeat"
      rightTop={macros.calories ? `${macros.calories} kcal` : null}
      rightBottom={macros.gram ? `${macros.gram} g` : null}
      onPress={onPress}
    />
  );
}
