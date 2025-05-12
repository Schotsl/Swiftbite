import Item from "@/components/Item";

import { useQuery } from "@tanstack/react-query";
import { ServingData } from "@/schemas/serving";
import { getMacrosFromProduct } from "@/helper";

import productData from "@/queries/productData";

type ItemProductWithServingProps = {
  icon?: boolean;
  small?: boolean;
  border?: boolean;
  product: string;
  serving: ServingData | null;
  onPress: () => void;
};

export default function ItemProductWithServing({
  icon = true,
  small = false,
  border = true,
  product: productId,
  serving,
  onPress,
}: ItemProductWithServingProps) {
  const { data: product, isLoading } = useQuery({
    ...productData({}),
    select: (data) => data.find((p) => p.uuid === productId),
  });

  if (isLoading) {
    return (
      <Item
        title="Loading..."
        subtitle="Loading..."
        small={small}
        border={border}
        onPress={onPress}
      />
    );
  }

  // If serving is still missing then we're still processing AI data
  if (!product || !serving) {
    return (
      <Item
        title="Product niet gevonden"
        subtitle="Product niet gevonden"
        small={small}
        border={border}
        onPress={onPress}
      />
    );
  }

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
