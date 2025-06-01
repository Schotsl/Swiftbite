import Item from "@/components/Item";

import { Repeat } from "@/types/repeat";
import { getMacrosFromMeal, getMacrosFromProduct } from "@/helper";

import language from "@/language";

type RepeatRepeatProps = {
  item: Repeat;
  onSelect: (repeat: string) => void;
};

export default function ItemRepeat({ item, onSelect }: RepeatRepeatProps) {
  const translationsArray = item.weekdays.map((day) => {
    const translationKey = day as keyof typeof language.weekdays;
    const translationValue = language.weekdays[translationKey];
    const translationLetters = translationValue.slice(0, 2);
    const translationLower = translationLetters.toLowerCase();

    return translationLower;
  });

  const translationsJoined = translationsArray.join(", ");

  const { product, meal, serving } = item;

  const title = product
    ? product.title || language.components.product.unknown
    : meal.title;

  const macros = product
    ? getMacrosFromProduct(product, serving)
    : getMacrosFromMeal(meal, serving);

  return (
    <Item
      title={title}
      subtitle={language.item.repeat.subtitle(translationsJoined)}
      subtitleIcon="repeat"
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
      onPress={() => onSelect(item.uuid)}
    />
  );
}
