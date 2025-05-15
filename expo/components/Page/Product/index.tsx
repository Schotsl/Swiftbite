import { useForm } from "react-hook-form";
import { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIsFocused } from "@react-navigation/native";
import { ScrollView, Text, View } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { getMacrosFromProduct, getOptions } from "@/helper";
import { ServingData, ServingInput, servingSchema } from "@/schemas/serving";
import { isProductFavorite, toggleProductFavorite } from "@/helper";

import userData from "@/queries/userData";
import useUpdateUser from "@/mutations/useUpdateUser";

import variables from "@/variables";

import Header from "@/components/Header";
import Input from "@/components/Input";
import InputDropdown from "@/components/Input/Dropdown";
import ProductInfo from "@/components/Product/Info";
import ProductImpact from "@/components/Product/Impact";
import ButtonOverlay from "@/components/Button/Overlay";

export type PageProductProps = {
  product: Product;
  serving?: ServingData | null;

  onSave: (serving: ServingData) => void;
  onDelete?: () => void;
  onRepeat?: (serving: ServingData) => void;
};

export default function PageProduct({
  serving: servingProp,
  product,
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

  const { watch, control, reset, setValue, handleSubmit } =
    useForm<ServingInput>({
      resolver: zodResolver(servingSchema),
      defaultValues: {
        option: servingProp?.option || "100-gram",
        quantity: servingProp?.quantity || 1,
      },
    });

  const option = watch("option");
  const quantity = watch("quantity");

  useEffect(() => {
    if (!focus) {
      return;
    }

    reset({
      option: servingProp?.option || "100-gram",
      quantity: servingProp?.quantity || 1,
    });
  }, [focus, servingProp, reset]);

  const handleSave = async (data: ServingInput) => {
    setSaving(true);

    onSave(serving);
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

    if (product.quantity) {
      items.push({
        icon: "weight-hanging",
        value: `${product.quantity.gram} ${product.quantity.option}`,
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

  const macros = getMacrosFromProduct(product, serving);

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
              title={product.title!}
              content={product.brand || "No brand"}
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

          <ProductImpact {...macros} />
        </View>
      </ScrollView>

      <ButtonOverlay
        title={servingProp ? "Product wijzigen" : "Product opslaan"}
        onPress={handleSubmit(handleSave)}
        loading={saving}
        disabled={saving}
      />
    </View>
  );
}
