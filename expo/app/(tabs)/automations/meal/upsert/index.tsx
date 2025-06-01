import { useForm } from "react-hook-form";
import { Position } from "@/types";
import { rowTimeout } from "@/helper";
import { ScrollView } from "react-native-gesture-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditMeal } from "@/context/MealContext";
import {
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from "react-native";

import { useIsFocused } from "@react-navigation/native";
import { SwipeListView } from "react-native-swipe-list-view";
import { useEffect, useState } from "react";
import { MealData, mealSchema } from "@/schemas/serving";
import { useLocalSearchParams, useRouter } from "expo-router";

import Header from "@/components/Header";
import Input from "@/components/Input";
import EmptySmall from "@/components/Empty/Small";
import InputLabel from "@/components/Input/Label";
import ItemActions from "@/components/Item/Actions";
import useDeleteMeal from "@/mutations/useDeleteMeal";
import ButtonOverlay from "@/components/Button/Overlay";
import ButtonSmall from "@/components/Button/Small";
import ItemProduct from "@/components/Item/Product";
import ModalBackground from "@/components/Modal/Background";
import NavigationAddList from "@/components/Navigation/Add/List";

import language from "@/language";
import variables from "@/variables";

export default function AutomationsMealUpsert() {
  const focus = useIsFocused();
  const router = useRouter();

  const deleteMeal = useDeleteMeal();

  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState(0);
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

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScroll(event.nativeEvent.contentOffset.y);
  };

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
    <View>
      <ScrollView onScroll={handleScroll}>
        <View
          style={{
            gap: variables.gap.large,
            padding: variables.padding.page,
            paddingBottom: variables.paddingOverlay,
          }}
        >
          <Header
            title={
              updating
                ? language.modifications.getEdit(language.types.meal.single)
                : language.modifications.getSave(language.types.meal.single)
            }
            content={language.types.meal.explanation}
            onDelete={handleDelete}
          />

          <View style={{ gap: 32 }}>
            <Input
              name="title"
              label={language.types.meal.inputTitle}
              control={control}
              placeholder={language.types.meal.inputTitlePlaceholder}
            />

            <View style={{ gap: 12 }}>
              <View>
                <InputLabel label={language.types.ingredient.plural} />

                <SwipeListView
                  style={{
                    width: "100%",
                    flexDirection: "column",
                    borderColor: variables.border.color,
                    borderWidth: variables.border.width,
                    borderRadius: variables.border.radius,
                  }}
                  data={mealProducts}
                  keyExtractor={(item) => item.product.uuid}
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
                  renderHiddenItem={({ item }) => {
                    return (
                      <ItemActions
                        onDelete={() => removeMealProduct(item.product.uuid)}
                      />
                    );
                  }}
                  ListEmptyComponent={() => {
                    return (
                      <EmptySmall
                        onPress={() => setOpen(true)}
                        content={language.empty.getAdded(
                          language.functions.getJoin([
                            language.types.product.plural,
                            language.types.basic.plural,
                          ])
                        )}
                      />
                    );
                  }}
                  onRowDidOpen={rowTimeout}
                  scrollEnabled={false}
                  rightOpenValue={-75}
                  closeOnRowOpen={true}
                  disableRightSwipe={true}
                />
              </View>

              {focus && (
                <ButtonSmall
                  icon="plus"
                  title={language.modifications.getInsert(
                    language.types.ingredient.plural
                  )}
                  onPress={() => setOpen(true)}
                  onPosition={setPosition}
                />
              )}

              <AutomationsMealUpsertAdd
                open={open}
                scroll={scroll}
                position={position}
                onClose={() => setOpen(false)}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <ButtonOverlay
        title={language.modifications.getSave(language.types.meal.single)}
        onPress={handleSubmit(handleSave)}
        loading={isSubmitting}
        disabled={isSubmitting || isDeleting}
      />
    </View>
  );
}

type AutomationsMealUpsertAddProps = {
  open: boolean;
  scroll: number;
  position: Position;
  onClose: () => void;
};

function AutomationsMealUpsertAdd({
  open,
  scroll,
  position,
  onClose,
}: AutomationsMealUpsertAddProps) {
  const border = variables.border.width;
  const offset = 133;
  const positionY = position.y;

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
          top: positionY - offset - scroll - border,
          left: position.x,
          position: "absolute",
        }}
      >
        <NavigationAddList
          camera="/automations/meal/upsert/camera"
          search="/automations/meal/upsert/search"
          onClose={onClose}
          style={{
            left: 100,
            bottom: 0,
            position: "relative",
          }}
        />

        <ButtonSmall
          icon={"plus"}
          shadow={false}
          title={language.modifications.getInsert(
            language.types.ingredient.plural
          )}
          onPress={() => onClose()}
        />
      </View>
    </Modal>
  );
}
