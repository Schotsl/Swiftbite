import Item from "@/components/Item";

import { ServingData } from "@/schemas/serving";
import { getMacrosFromProduct } from "@/helper";
import { Product, ProductInsert } from "@/types";

type ItemProductWithServingProps = {
  icon?: boolean;
  small?: boolean;
  border?: boolean;
  product: Product | ProductInsert;
  serving: ServingData;
  onPress: () => void;
};

export default function ItemProductWithServing({
  icon = true,
  small = false,
  border = true,
  product,
  serving,
  onPress,
}: ItemProductWithServingProps) {
  const macros = getMacrosFromProduct(product, serving);

  const title = product.title || "Loading...";
  const brand = product.brand || "No brand";
  const subtitle = product.title ? brand : "Loading...";

  return (
    <Item
      title={title}
      small={small}
      border={border}
      iconId={icon ? product.icon_id : undefined}
      subtitle={subtitle}
      rightTop={macros.calories ? `${macros.calories} kcal` : null}
      rightBottom={macros.gram ? `${macros.gram} g` : null}
      onPress={onPress}
    />
  );
}
