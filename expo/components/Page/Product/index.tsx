import { User } from "@/types/user";
import { useForm } from "react-hook-form";
import { Product } from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollView, View } from "react-native";
import { useMemo, useState } from "react";
import {
  ProductPageData,
  productPageSchema,
  ServingData,
} from "@/schemas/serving";

import {
  getLabel,
  getOption,
  getOptions,
  isProductFavorite,
  toggleProductFavorite,
} from "@/helper";

import useUpdateUser from "@/mutations/useUpdateUser";

import variables from "@/variables";
import language from "@/language";

import InputDropdown from "@/components/Input/Dropdown";
import ButtonOverlay from "@/components/Button/Overlay";
import ProductNutrition from "@/components/Product/Nutrition";
import ProductImpact from "@/components/Product/Impact";
import ProductInfo from "@/components/Product/Info";
import InputTime from "@/components/Input/Time";
import TextBody from "@/components/Text/Body";
import Header from "@/components/Header";
import Input from "@/components/Input";

export type PageProductProps = {
  user: User;
  product: Product;
  favorite?: boolean;

  serving?: ServingData | null;
  created?: Date | null;
  createdVisible?: boolean;

  onSave: (serving: ServingData, created: Date) => void;
  onDelete?: () => void;
  onDuplicate?: (serving: ServingData) => void;
};

export default function PageProduct({
  user,
  product,
  favorite: propFavorite = true,
  serving: propServing,
  created: propCreated,
  createdVisible = false,
  onSave,
  onDelete,
  onDuplicate,
}: PageProductProps) {
  const updateUser = useUpdateUser();

  const [saving, setSaving] = useState(false);
  const [favorite, setFavorite] = useState(
    isProductFavorite(user, product.uuid),
  );

  const isGeneric = product.type === "search_generic";
  const isProcessing = product.processing;

  const { watch, control, handleSubmit } = useForm<ProductPageData>({
    resolver: zodResolver(productPageSchema),
    defaultValues: {
      option: propServing?.option || getOption(product),
      quantity: propServing?.quantity || 1,
      created_at: propCreated || new Date(),
    },
  });

  const option = watch("option");
  const quantity = watch("quantity");

  const handleSave = async (data: ProductPageData) => {
    setSaving(true);

    onSave(serving, data.created_at);
  };

  const handleFavorite = async () => {
    if (!user) {
      return;
    }

    setFavorite((previous) => {
      const favoriteInverted = !previous;
      const favoriteProducts = toggleProductFavorite(user, product.uuid);

      updateUser.mutateAsync({
        ...user,
        favorite_products: favoriteProducts,
      });

      return favoriteInverted;
    });
  };

  const info = useMemo(() => {
    const items = [];

    if (product.barcode) {
      items.push({ key: "barcode", icon: "barcode", value: product.barcode });
    }

    if (product.serving) {
      items.push({
        key: "serving",
        icon: "plate-wheat",
        value: `${product.serving.quantity} ${getLabel(product.serving.option)}`,
      });
    }

    if (product.quantity) {
      items.push({
        key: "quantity",
        icon: "weight-hanging",
        value: `${product.quantity.quantity} ${getLabel(product.quantity.option)}`,
      });
    } else if (product.search?.quantity_original) {
      const { quantity_original, quantity_original_unit } = product.search;

      items.push({
        key: "quantity",
        icon: "weight-hanging",
        value: `${quantity_original} ${getLabel(quantity_original_unit!)}`,
      });
    }

    return items;
  }, [product]);

  const options = getOptions({ product });
  const serving = useMemo(() => {
    const selected = options.find((object) => object.value === option)!;
    const gram = selected.gram * quantity;

    return { option, quantity, gram };
  }, [option, quantity, options]);

  const title = isProcessing ? product.search.title : product.title;
  const content = isProcessing
    ? isGeneric
      ? product.search.category
      : product.search.brand
    : isGeneric
      ? product.category
      : product.brand;

  return (
    <View>
      <ScrollView style={{ minHeight: "100%" }}>
        <View
          style={{
            minHeight: "100%",

            gap: variables.gap.large,
            padding: variables.padding.page,
            paddingBottom: variables.paddingOverlay,
          }}
        >
          <View>
            <Header
              title={`${title}`}
              content={content}
              favorite={favorite}
              onDelete={onDelete}
              onDuplicate={onDuplicate && (() => onDuplicate(serving))}
              onFavorite={propFavorite ? handleFavorite : undefined}
            />

            <ProductInfo items={info} />
          </View>

          <View style={{ gap: variables.gap.small }}>
            <TextBody weight="semibold">
              {language.input.serving.group}
            </TextBody>

            <InputDropdown
              name="option"
              label={language.input.serving.size.title}
              options={options}
              control={control}
              placeholder={language.input.serving.size.placeholder}
            />

            <Input
              name="quantity"
              type="decimal-pad"
              label={language.input.serving.amount.title}
              placeholder={language.input.serving.amount.placeholder}
              control={control}
            />
          </View>

          {createdVisible && (
            <View style={{ gap: variables.gap.small }}>
              <TextBody weight="semibold">{language.input.time.group}</TextBody>

              <InputTime
                name="created_at"
                label={language.input.time.title}
                control={control}
              />
            </View>
          )}

          <ProductImpact
            product={product}
            serving={serving}
            processing={isProcessing}
          />

          <ProductNutrition
            product={product}
            serving={serving}
            processing={isProcessing}
          />
        </View>
      </ScrollView>

      <ButtonOverlay
        title={
          propServing
            ? language.modifications.getEdit(language.types.product.single)
            : language.modifications.getSave(language.types.product.single)
        }
        onPress={handleSubmit(handleSave)}
        loading={saving}
        disabled={saving}
      />
    </View>
  );
}
