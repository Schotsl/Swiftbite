import { useForm } from "react-hook-form";
import { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { getOptions } from "@/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIsFocused } from "@react-navigation/native";
import { ScrollView, Text, View } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { isProductFavorite, toggleProductFavorite } from "@/helper";
import {
  ProductPageData,
  productPageSchema,
  ServingData,
} from "@/schemas/serving";

import userData from "@/queries/userData";
import useUpdateUser from "@/mutations/useUpdateUser";

import variables from "@/variables";

import Header from "@/components/Header";
import Input from "@/components/Input";
import InputDropdown from "@/components/Input/Dropdown";
import ProductInfo from "@/components/Product/Info";
import ProductImpact from "@/components/Product/Impact";
import ProductNutrition from "@/components/Product/Nutrition";
import ButtonOverlay from "@/components/Button/Overlay";
import InputTime from "@/components/Input/Time";

export type PageProductProps = {
  product: Product;
  serving?: ServingData | null;
  created?: Date | null;
  createdVisible?: boolean;

  onSave: (serving: ServingData, created: Date) => void;
  onDelete?: () => void;
  onRepeat?: (serving: ServingData) => void;
};

export default function PageProduct({
  product,
  serving: propServing,
  created: propCreated,
  createdVisible = false,
  onSave,
  onDelete,
  onRepeat,
}: PageProductProps) {
  const focus = useIsFocused();

  const updateUser = useUpdateUser();

  const { data: user } = useQuery(userData());

  const [saving, setSaving] = useState(false);
  const [favorite, setFavorite] = useState(
    isProductFavorite(user, product.uuid),
  );

  const isGeneric = product.type === "search_generic";
  const isProcessing = product.processing;

  const { watch, control, reset, setValue, handleSubmit } =
    useForm<ProductPageData>({
      resolver: zodResolver(productPageSchema),
      defaultValues: {
        option: propServing?.option || "100-gram",
        quantity: propServing?.quantity || 1,
        created_at: propCreated || new Date(),
      },
    });

  const option = watch("option");
  const quantity = watch("quantity");

  useEffect(() => {
    if (!focus) {
      return;
    }

    reset({
      option: propServing?.option || "100-gram",
      quantity: propServing?.quantity || 1,
      created_at: propCreated || new Date(),
    });
  }, [focus, propServing, propCreated, reset]);

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
      items.push({ icon: "barcode", value: product.barcode });
    }

    if (product.serving) {
      items.push({
        icon: "plate-wheat",
        value: `${product.serving.gram} ${product.serving.option}`,
      });
    }

    if (product.quantity) {
      items.push({
        icon: "weight-hanging",
        value: `${product.quantity.gram} ${product.quantity.option}`,
      });
    } else if (product.search?.quantity_original) {
      items.push({
        icon: "weight-hanging",
        value: `${product.search.quantity_original} ${product.search.quantity_original_unit}`,
      });
    }

    return items;
  }, [product]);

  const options = useMemo(() => {
    const optionsObject = getOptions({ product });
    const optionsQuantity = optionsObject.find(
      (option) => option.value === "quantity",
    );

    const optionsServing = optionsObject.find(
      (option) => option.value === "serving",
    );

    if (optionsServing) {
      setValue("option", optionsServing.value);
    } else if (optionsQuantity) {
      setValue("option", optionsQuantity.value);
    } else {
      setValue("option", "100-gram");
    }

    return optionsObject;
  }, [product, setValue]);

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
      <ScrollView>
        <View
          style={{
            gap: variables.gapLarge,
            padding: variables.padding,
            paddingBottom: variables.paddingOverlay,
          }}
        >
          <View>
            <Header
              small={true}
              title={`${title}`}
              content={content}
              favorite={favorite}
              onDelete={onDelete}
              onRepeat={onRepeat && (() => onRepeat(serving))}
              onFavorite={handleFavorite}
            />

            <ProductInfo items={info} />
          </View>

          <View style={{ gap: variables.gapSmall }}>
            <Text style={{ fontSize: 16, fontFamily: "OpenSans_600SemiBold" }}>
              Portie
            </Text>

            <InputDropdown
              name="option"
              label="Portie grote"
              options={options}
              control={control}
              placeholder="Selecteer een portie grote"
            />

            <Input
              name="quantity"
              type="numeric"
              label="Portie aantal"
              placeholder="Hoeveel porties heb je gegeten?"
              control={control}
            />
          </View>

          {createdVisible && (
            <View style={{ gap: variables.gapSmall }}>
              <Text
                style={{ fontSize: 16, fontFamily: "OpenSans_600SemiBold" }}
              >
                Overige informatie
              </Text>

              <InputTime name="created_at" label="Tijd" control={control} />
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
        title={propServing ? "Product wijzigen" : "Product opslaan"}
        onPress={handleSubmit(handleSave)}
        loading={saving}
        disabled={saving}
      />
    </View>
  );
}
