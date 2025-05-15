import Item from "@/components/Item";
import ItemSkeleton from "../Skeleton";

import { Product } from "@/types/product";
import { ServingData } from "@/schemas/serving";
import { getMacrosFromProduct } from "@/helper";

type ItemProductProps = {
  border?: boolean;
  product: Product;
  serving?: ServingData | null;
  onSelect: (product: string) => void;
};

export default function ItemProduct({
  border = true,
  product,
  serving,
  onSelect,
}: ItemProductProps) {
  const macros = serving ? getMacrosFromProduct(product, serving) : null;

  const overwriteTop = macros?.calories ? `${macros.calories} kcal` : null;
  const overwriteBottom = macros?.gram ? `${macros.gram} g` : null;

  if (product.type === "search_generic") {
    const { processing } = product;

    const title = processing ? product.search.title : product.title;
    const subtitle = processing ? product.search.category : product.category;

    return (
      <Item
        title={title}
        border={border}
        subtitle={subtitle}
        subtitleIcon="apple-whole"
        rightTop={overwriteTop}
        rightBottom={overwriteBottom}
        onPress={() => onSelect(product.uuid)}
      />
    );
  }

  if (product.type === "search_product") {
    const { processing } = product;

    const title = processing ? product.search.title : product.title;
    const subtitle = processing ? product.search.brand : product.brand;

    const quantity = processing
      ? `${product.search?.quantity_original} ${product.search?.quantity_original_unit}`
      : `${product.quantity?.quantity} ${product.quantity?.option}`;

    return (
      <Item
        title={title}
        border={border}
        subtitle={subtitle}
        subtitleIcon={processing ? "globe" : undefined}
        rightTop={overwriteTop || quantity}
        rightBottom={overwriteBottom}
        onPress={() => onSelect(product.uuid)}
      />
    );
  }

  if (product.type === "generative") {
    const { processing, title } = product;

    // If we have no title we'll show a skeleton
    if (!title) {
      return <ItemSkeleton border={border} />;
    }

    const subtitleIcon = processing ? "spinner" : "wand-magic-sparkles";
    const subtitle = processing
      ? "Wordt geanalyseerd..."
      : "Automatische inschatting";

    return (
      <Item
        title={title}
        border={border}
        subtitle={subtitle}
        subtitleIcon={subtitleIcon}
        subtitleIconSpinning={processing}
        rightTop={overwriteTop}
        rightBottom={overwriteBottom}
        onPress={() => onSelect(product.uuid)}
      />
    );
  }

  if (product.type === "manual") {
    return (
      <Item
        title={product.title}
        border={border}
        subtitle={"Handmatige inschatting"}
        subtitleIcon="wand-magic-sparkles"
        rightTop={overwriteTop}
        onPress={() => onSelect(product.uuid)}
      />
    );
  }

  if (product.type === "barcode") {
    const title = product.title;
    const subtitle = product.brand || "Onbekend merk";
    return (
      <Item
        title={title}
        border={border}
        subtitle={subtitle}
        subtitleIcon="barcode"
        rightTop={overwriteTop}
        rightBottom={overwriteBottom}
        onPress={() => onSelect(product.uuid)}
      />
    );
  }

  return (
    <Item
      title={"Undefined state"}
      border={border}
      subtitle="Undefined state"
      onPress={() => {}}
    />
  );
}
