import Item from "@/components/Item";
import ItemSkeleton from "../Skeleton";

import language from "@/language";

import { Alert } from "react-native";
import { Product } from "@/types/product";
import { ServingData } from "@/schemas/serving";
import { getLabel, getMacrosFromProduct } from "@/helper";

type ItemProductProps = {
  icon?: boolean;
  small?: boolean;
  search?: boolean;
  border?: boolean;
  product: Product;
  serving?: ServingData | null;
  onSelect: (product: string) => void;
};

export default function ItemProduct({
  search = false,
  product,
  serving,
  onSelect,
  ...props
}: ItemProductProps) {
  const icon = props.icon === false ? undefined : product.icon_id;
  const macros = serving ? getMacrosFromProduct(product, serving) : null;

  const overwriteTop = macros !== null ? `${macros.calories} kcal` : null;
  const overwriteBottom = macros !== null ? `${macros.gram} g` : null;

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

    // I really don't like this solution but it's a day before the deadline
    const metadata = processing
      ? search.quantity_original && search.quantity_original_unit
        ? `${search.quantity_original} ${getLabel(search.quantity_original_unit!)}`
        : null
      : quantity && quantity.quantity
        ? `${quantity.quantity} ${getLabel(quantity.option)}`
        : null;

    const metadataSafe = search ? metadata : null;

    return (
      <Item
        {...props}
        iconId={icon}
        title={title}
        subtitle={subtitle}
        subtitleIcon={processing ? "globe" : undefined}
        rightTop={processing ? metadataSafe : overwriteTop}
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
          language.alert.processing.subtitle
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
