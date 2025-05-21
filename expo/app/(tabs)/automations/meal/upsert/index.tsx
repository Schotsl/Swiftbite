import { useForm } from "react-hook-form";
import { Position } from "@/types";
import { rowTimeout } from "@/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditMeal } from "@/context/MealContext";
import { Modal, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { SwipeListView } from "react-native-swipe-list-view";
import { useEffect, useState } from "react";
import { MealData, mealSchema } from "@/schemas/serving";
import { useLocalSearchParams, useRouter } from "expo-router";

import Header from "@/components/Header";
import Input from "@/components/Input";
import EmptySmall from "@/components/Empty/Small";
import InputLabel from "@/components/Input/Label";
import ItemDelete from "@/components/Item/Delete";
import useDeleteMeal from "@/mutations/useDeleteMeal";
import ButtonOverlay from "@/components/Button/Overlay";
import ButtonSmall from "@/components/Button/Small";
import ItemProduct from "@/components/Item/Product";
import ModalBackground from "@/components/Modal/Background";
import NavigationAddList from "@/components/Navigation/Add/List";

export default function AutomationsMealUpsert() {
  const focus = useIsFocused();
  const router = useRouter();

  const deleteMeal = useDeleteMeal();

  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  const [isDeleting, setIsDeleting] = useState(false);

  const { meal: mealId } = useLocalSearchParams<{ meal: string }>();

  const {
    title,
    updating,
    mealProducts,
    removeMealProduct,
    updateTitle,
    saveChanges,
  } = useEditMeal();

  const {
    watch,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<MealData>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      title,
    },
  });

  const watchTitle = watch("title");

  useEffect(() => {
    updateTitle(watchTitle);
  }, [watchTitle, updateTitle]);

  const handleSave = async () => {
    await saveChanges();

    router.replace("/(tabs)/automations");
  };

  const handleDelete = async () => {
    if (isDeleting) {
      return;
    }

    setIsDeleting(true);

    if (updating) {
      await deleteMeal.mutateAsync(mealId);
    }

    router.replace("/(tabs)/automations");
  };

  const handleSelect = (product: string) => {
    router.push({
      pathname: `/(tabs)/automations/meal/upsert/product`,
      params: { product },
    });
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 32,
        alignItems: "flex-start",
        backgroundColor: "#fff",
      }}
    >
      <Header
        title={updating ? "Bewerk maaltijd" : "Maaltijd toevoegen"}
        content="Een maaltijd is een combinatie van producten die je opslaat om later in één keer toe te voegen."
        onDelete={handleDelete}
      />

      <View style={{ gap: 48, width: "100%" }}>
        <View style={{ gap: 32 }}>
          <Input
            name="title"
            control={control}
            label="Titel"
            placeholder="Maaltijd titel"
          />

          <View style={{ gap: 12 }}>
            <View>
              <InputLabel label="Ingrediënten" />

              <SwipeListView
                style={{
                  width: "100%",
                  flexDirection: "column",
                  borderWidth: 2,
                  borderColor: "#000000",
                  borderRadius: 8,
                }}
                data={mealProducts}
                keyExtractor={(item) => item.product.uuid}
                ListEmptyComponent={() => {
                  return (
                    <EmptySmall
                      content="Je hebt nog geen ingrediënten toegevoegd"
                      onPress={() => setOpen(true)}
                    />
                  );
                }}
                renderItem={({ item, index }) => {
                  return (
                    <ItemProduct
                      icon={false}
                      small={true}
                      border={index !== mealProducts.length - 1}
                      product={item.product}
                      serving={item.serving}
                      onSelect={handleSelect}
                    />
                  );
                }}
                renderHiddenItem={({ item, index }) => {
                  return (
                    <ItemDelete
                      border={index !== mealProducts.length - 1}
                      onDelete={() => removeMealProduct(item.product.uuid)}
                    />
                  );
                }}
                onRowDidOpen={rowTimeout}
                rightOpenValue={-75}
                useNativeDriver={true}
                disableRightSwipe={true}
              />
            </View>

            {focus && (
              <ButtonSmall
                icon="plus"
                title="Ingrediënt toevoegen"
                onPress={() => setOpen(true)}
                onPosition={setPosition}
              />
            )}

            <AutomationsMealUpsertAdd
              open={open}
              position={position}
              onClose={() => setOpen(false)}
            />
          </View>
        </View>
      </View>

      <ButtonOverlay
        title="Wijzigingen opslaan"
        onPress={handleSubmit(handleSave)}
        loading={isSubmitting}
        disabled={isSubmitting || isDeleting}
      />
    </View>
  );
}

type AutomationsMealUpsertAddProps = {
  open: boolean;
  position: Position;
  onClose: () => void;
};

function AutomationsMealUpsertAdd({
  open,
  position,
  onClose,
}: AutomationsMealUpsertAddProps) {
  return (
    <Modal
      visible={open}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <ModalBackground onPress={onClose} />

      <View
        style={{
          gap: 18,
          top: position.y - 87,
          left: position.x,
          position: "absolute",
        }}
      >
        <NavigationAddList
          camera="/automations/meal/upsert/camera"
          search="/automations/meal/upsert/search"
          onClose={onClose}
          style={{
            left: 88,
            bottom: 0,
            position: "relative",
          }}
        />

        <ButtonSmall
          icon={"plus"}
          title={"Ingrediënt toevoegen"}
          onPress={() => onClose()}
        />
      </View>
    </Modal>
  );
}
