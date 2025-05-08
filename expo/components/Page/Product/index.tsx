import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getMacrosFromProduct, getOptions } from "@/helper";
import { useIsFocused } from "@react-navigation/native";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product, ProductInsert } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { ServingData, ServingInput, servingSchema } from "@/schemas/serving";

import Button from "@/components/Button";
import Header from "@/components/Header";
import HeaderLoading from "@/components/Header/Loading";
import openfoodData from "@/queries/openfoodData";

import ProductStatus from "@/components/Product/Status";
import ProductInfo from "@/components/Product/Info";

import Input from "@/components/Input";
import InputDropdown from "@/components/Input/Dropdown";
import ProductImpact from "@/components/Product/Impact";
import useUpdateProduct from "@/mutations/useUpdateProduct";

export type PageProductProps = {
  serving?: ServingData | null;
  // TODO: Could probably be null instead of undefined also
  product: Product;

  onSave: (product: Product | ProductInsert, serving: ServingData) => void;
  onDelete?: () => void;
  onRepeat?: () => void;
};

export default function PageProduct({
  serving: servingLocal,
  product: productLocal,
  onSave,
  onDelete,
  onRepeat,
}: PageProductProps) {
  const focus = useIsFocused();
  const updateProduct = useUpdateProduct();

  const { title, brand, quantity_original, quantity_original_unit, barcode } =
    useLocalSearchParams<{
      uuid?: string;
      entry?: string;
      title?: string;
      brand?: string;
      barcode?: string;
      quantity_original?: string;
      quantity_original_unit?: string;
    }>();

  const { data: productOpenfood, isLoading } = useQuery({
    ...openfoodData({
      barcode,
      title,
      brand,
      quantity_original,
      quantity_original_unit,
    }),
    enabled: !productLocal,
  });

  const product = productLocal || productOpenfood!;

  const [saving, setSaving] = useState(false);
  const [favorite, setFavorite] = useState(product.favorite);

  const { watch, control, handleSubmit, reset, setValue } =
    useForm<ServingInput>({
      resolver: zodResolver(servingSchema),
      defaultValues: {
        option: servingLocal?.option || "100-gram",
        quantity: servingLocal?.quantity || 1,
      },
    });

  useEffect(() => {
    if (focus) {
      reset({
        option: servingLocal?.option || "100-gram",
        quantity: servingLocal?.quantity || 1,
      });
    }
  }, [focus, reset, servingLocal]);

  const handleFavorite = () => {
    setFavorite((previous) => {
      updateProduct.mutate({
        ...product,
        favorite: !previous,
      });

      return !previous;
    });
  };

  const handleSave = async (data: ServingInput) => {
    setSaving(true);

    const selected = options.find((option) => option.value === data.option)!;
    const gram = selected.gram * data.quantity;

    onSave(product!, { ...data, gram });
  };

  const info = useMemo(() => {
    const items = [];

    if (product?.barcode) {
      items.push({ icon: "barcode", value: product.barcode });
    }

    if (product?.quantity_original) {
      items.push({
        icon: "cube",
        value: `${product.quantity_original} ${product.quantity_original_unit}`,
      });
    }

    return items;
  }, [product]);

  const options = useMemo(() => {
    const optionsObject = getOptions(product);
    const optionsQuantity = optionsObject.find(
      (option) => option.value === "quantity"
    );

    const optionsServing = optionsObject.find(
      (option) => option.value === "serving"
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

  const option = watch("option");
  const quantity = watch("quantity");

  const macros = useMemo(() => {
    const selected = options.find(({ value }) => value === option)!;
    const gram = selected.gram * quantity;

    return getMacrosFromProduct(product!, {
      gram,
      option,
      quantity,
    });
  }, [option, quantity, options, product]);

  if (isLoading) {
    return (
      <View style={{ padding: 32, minHeight: "100%" }}>
        <HeaderLoading />

        <ProductStatus status="We zijn het product in onze database aan het zoeken" />
      </View>
    );
  }

  return (
    <ScrollView style={{ minHeight: "100%" }}>
      <View style={{ padding: 32, gap: 48 }}>
        <View>
          <Header
            small={true}
            title={product!.title!}
            content={product?.brand || "No brand"}
            favorite={favorite}
            onDelete={onDelete}
            onRepeat={onRepeat}
            onFavorite={handleFavorite}
          />

          <ProductInfo items={info} />
        </View>

        <View style={{ gap: 16 }}>
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

        <Button
          title={servingLocal ? "Product wijzigen" : "Product opslaan"}
          onPress={handleSubmit(handleSave)}
          loading={saving}
          disabled={saving}
        />
      </View>
    </ScrollView>
  );
}
