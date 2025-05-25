import Item from "@/components/Item";

import { Repeat } from "@/types/repeat";
import { getMacrosFromProduct } from "@/helper";

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

  const macros = getMacrosFromProduct(item.product!, item.serving);

  return (
    <Item
      title={item.product?.title ?? item.meal?.title ?? ""}
      subtitle={`Herhaald elke ${translationsJoined}`}
      subtitleIcon="repeat"
      rightTop={macros.calories ? `${macros.calories} kcal` : null}
      rightBottom={macros.gram ? `${macros.gram} g` : null}
      onPress={() => onSelect(item.uuid)}
    />
  );
}
