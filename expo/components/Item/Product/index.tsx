import Item from "@/components/Item";
import ItemSkeleton from "../Skeleton";

import language from "@/language";

import { Alert } from "react-native";
import { Product } from "@/types/product";
import { ServingData } from "@/schemas/serving";
import { getMacrosFromProduct, getLabel } from "@/helper";

type ItemProductProps = {
  icon?: boolean;
  small?: boolean;
  border?: boolean;
  product: Product;
  serving?: ServingData | null;
  onSelect: (product: string) => void;
};

export default function ItemProduct({
  product,
  serving,
  onSelect,
  ...props
}: ItemProductProps) {
  const icon = props.icon === false ? undefined : product.icon_id;
  const macros = serving ? getMacrosFromProduct(product, serving) : null;

  const overwriteTop = macros?.calories ? `${macros.calories} kcal` : null;
  const overwriteBottom = macros?.gram ? `${macros.gram} g` : null;

  if (product.type === "search_generic") {
    const { processing } = product;

    const title = processing ? product.search.title : product.title;
    const subtitle = processing ? product.search.category : product.category;

    return (
      <Item
        {...props}
        iconId={icon}
        title={title}
        subtitle={subtitle}
        subtitleIcon="apple-whole"
        subtitleLoading={processing}
        rightTop={overwriteTop}
        rightBottom={overwriteBottom}
        onPress={() => onSelect(product.uuid)}
      />
    );
  }

  if (product.type === "search_product") {
    const { search, quantity, processing } = product;

    const title = processing ? product.search.title : product.title;
    const subtitle = processing ? product.search.brand : product.brand;
    const stringified = processing
      ? search.quantity_original && search.quantity_original_unit
        ? `${search.quantity_original} ${getLabel(search.quantity_original_unit!)}`
        : null
      : quantity && quantity.quantity
        ? `${quantity.quantity} ${getLabel(quantity.option)}`
        : null;

    return (
      <Item
        {...props}
        iconId={icon}
        title={title}
        subtitle={subtitle}
        subtitleIcon={processing ? "globe" : undefined}
        subtitleLoading={processing}
        rightTop={overwriteTop || stringified}
        rightBottom={overwriteBottom}
        onPress={() => onSelect(product.uuid)}
      />
    );
  }

  if (product.type === "generative") {
    const { processing, title } = product;

    // If we have no title we'll show a skeleton
    if (!title) {
      return <ItemSkeleton {...props} uuid={product.uuid} />;
    }

    const subtitleIcon = processing ? "spinner" : "wand-magic-sparkles";
    const subtitle = processing
      ? language.components.product.analyzing
      : language.components.product.automatic;

    const handlePress = () => {
      if (processing) {
        Alert.alert(
          language.alert.processing.title,
          language.alert.processing.subtitle,
        );

        return;
      }

      onSelect(product.uuid);
    };

    return (
      <Item
        {...props}
        iconId={icon}
        title={title}
        subtitle={subtitle}
        subtitleIcon={subtitleIcon}
        subtitleLoading={processing}
        rightTop={overwriteTop}
        rightBottom={overwriteBottom}
        onPress={handlePress}
      />
    );
  }

  if (product.type === "manual") {
    return (
      <Item
        {...props}
        iconId={icon}
        title={product.title}
        subtitle={language.components.product.manual}
        subtitleIcon="wand-magic-sparkles"
        rightTop={overwriteTop}
        onPress={() => onSelect(product.uuid)}
      />
    );
  }

  if (product.type === "barcode") {
    const title = product.title;
    const subtitle = product.brand || language.components.product.unknown;
    return (
      <Item
        {...props}
        iconId={icon}
        title={title}
        subtitle={subtitle}
        subtitleIcon="barcode"
        rightTop={overwriteTop}
        rightBottom={overwriteBottom}
        onPress={() => onSelect(product.uuid)}
      />
    );
  }

  throw new Error("Unknown product type");
}
