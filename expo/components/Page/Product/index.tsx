import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIsFocused } from "@react-navigation/native";
import { Product, ProductInsert } from "@/types";
import { ScrollView, Text, View } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { getMacrosFromProduct, getOptions } from "@/helper";
import { ServingData, ServingInput, servingSchema } from "@/schemas/serving";

import variables from "@/variables";

import useUpdateProduct from "@/mutations/useUpdateProduct";

import Header from "@/components/Header";
import Input from "@/components/Input";
import InputDropdown from "@/components/Input/Dropdown";
import ProductInfo from "@/components/Product/Info";
import ProductImpact from "@/components/Product/Impact";
import ButtonOverlay from "@/components/Button/Overlay";

export type PageProductProps = {
  product: Product;
  serving?: ServingData | null;

  onSave: (product: Product | ProductInsert, serving: ServingData) => void;
  onDelete?: () => void;
  onRepeat?: () => void;
};

export default function PageProduct({
  serving,
  product,
  onSave,
  onDelete,
  onRepeat,
}: PageProductProps) {
  const focus = useIsFocused();

  const updateProduct = useUpdateProduct();

  const [saving, setSaving] = useState(false);
  const [favorite, setFavorite] = useState(product.favorite);

  const { watch, control, reset, setValue, handleSubmit } =
    useForm<ServingInput>({
      resolver: zodResolver(servingSchema),
      defaultValues: {
        option: serving?.option || "100-gram",
        quantity: serving?.quantity || 1,
      },
    });

  const option = watch("option");
  const quantity = watch("quantity");

  useEffect(() => {
    if (!focus) {
      return;
    }

    reset({
      option: serving?.option || "100-gram",
      quantity: serving?.quantity || 1,
    });
  }, [focus, serving, reset]);

  const handleFavorite = () => {
    setFavorite((previous) => {
      const favorite = !previous;

      updateProduct.mutate({
        ...product,
        favorite,
      });

      return favorite;
    });
  };

  const handleSave = async (data: ServingInput) => {
    setSaving(true);

    const selected = options.find((option) => option.value === data.option)!;
    const gram = selected.gram * data.quantity;

    onSave(product, { ...data, gram });
  };

  const info = useMemo(() => {
    const items = [];

    if (product.barcode) {
      items.push({ icon: "barcode", value: product.barcode });
    }

    if (product.quantity_original) {
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

  const macros = useMemo(() => {
    const selected = options.find(({ value }) => value === option)!;
    const gram = selected.gram * quantity;

    return getMacrosFromProduct(product!, {
      gram,
      option,
      quantity,
    });
  }, [option, quantity, options, product]);

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
        </View>
      </ScrollView>

      <ButtonOverlay
        title={serving ? "Product wijzigen" : "Product opslaan"}
        onPress={handleSubmit(handleSave)}
        loading={saving}
        disabled={saving}
      />
    </View>
  );
}
