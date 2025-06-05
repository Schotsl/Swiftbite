import { useForm } from "react-hook-form";
import { Position } from "@/types";
import { rowTimeout } from "@/helper";
import {
  ScrollView,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditMeal } from "@/context/MealContext";

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
import { Product } from "@/types/product";
import { Meal, MealProduct } from "@/types/meal";
import ProductImpact from "@/components/Product/Impact";
import ProductNutrition from "@/components/Product/Nutrition";

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
    watch,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<MealData>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      title: "",
    },
  });

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScroll(event.nativeEvent.contentOffset.y);
  };

  const handleSave = async () => {
    // await saveChanges();

    router.replace("/(tabs)/automations");
  };

  const handleDelete = async () => {
    // if (isDeleting) {
    //   return;
    // }
    // setIsDeleting(true);
    // if (updating) {
    //   await deleteMeal.mutateAsync(mealId);
    // }
    // router.replace("/(tabs)/automations");
  };

  const handleSelect = (product: string) => {
    router.push({
      pathname: `/(tabs)/automations/meal/upsert/product`,
      params: { product },
    });
  };

  const meal = JSON.parse(`{
  "uuid": "5fc93e28-3ffa-4cff-b7d6-3b2e61ab5fef",
  "title": "Ontbijt",
  "user_id": "e26f8795-74f0-411f-acb2-560c6fd80a83",
  "icon_id": "2fb7ac17-5584-46c1-8421-b57babedbffa",
  "updated_at": null,
  "created_at": "2025-05-31T10:42:01.050311+00:00",
  "meal_products": [
    {
      "meal_id": "5fc93e28-3ffa-4cff-b7d6-3b2e61ab5fef",
      "product": {
        "type": "search_generic",
        "uuid": "fd1a12f1-e076-5fa9-9efb-71291add3a16",
        "brand": null,
        "other": [
          {
            "name": "Vitamin A (RAE µg)",
            "quantity": 290
          },
          {
            "name": "Vitamin B12 (µg)",
            "quantity": 1.5
          }
        ],
        "title": "Sesambagel",
        "search": {
          "title": "Sesambagel",
          "category": "Kaas"
        },
        "barcode": null,
        "icon_id": "8912195b-3d32-4288-93cd-32178876dbce",
        "options": [
          {
            "gram": 95,
            "title": "Plakje",
            "value": "plakje"
          },
          {
            "gram": 30,
            "title": "Dik plakje",
            "value": "dik-plakje"
          },
          {
            "gram": 100,
            "title": "Stukje",
            "value": "stukje"
          }
        ],
        "serving": null,
        "user_id": null,
        "category": "Brood",
        "fat_100g": 30.2,
        "quantity": null,
        "estimated": false,
        "iron_100g": 0.1,
        "created_at": "2025-06-05T14:00:32.554+00:00",
        "fiber_100g": 0,
        "processing": false,
        "updated_at": null,
        "sodium_100g": 0.699,
        "calcium_100g": 789,
        "calorie_100g": 277,
        "protein_100g": 23,
        "fat_trans_100g": 1.11,
        "potassium_100g": 91,
        "cholesterol_100g": 86,
        "carbohydrate_100g": 0,
        "fat_saturated_100g": 19.98,
        "fat_unsaturated_100g": 9.11,
        "carbohydrate_sugar_100g": 0
      },
      "serving": {
        "gram": 95,
        "option": "plakje",
        "quantity": "1"
      },
      "user_id": "e26f8795-74f0-411f-acb2-560c6fd80a83",
      "created_at": "2025-06-05T14:01:37.617763+00:00",
      "product_id": "fd1a12f1-e076-5fa9-9efb-71291add3a16",
      "updated_at": null
    }
  ],
  "quantity_gram": 135
}`) as any;

  return (
    <View>
      <ScrollView style={{ minHeight: "100%" }} onScroll={handleScroll}>
        <View
          style={{
            minHeight: "100%",

            gap: variables.gap.large,
            padding: variables.padding.page,
            paddingBottom: variables.paddingOverlay,
          }}
        >
          <Header
            title={"Sesambagel"}
            content={
              "Dit is de schatting van je maaltijd. Wijzig ingrediënten door erop te tikken of voeg iets extra's toe."
            }
            onDelete={handleDelete}
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
                data={meal.meal_products as MealProduct[]}
                keyExtractor={(item) => item.product.uuid}
                renderItem={({ item, index }) => {
                  return (
                    <ItemProduct
                      icon={false}
                      small={true}
                      border={index !== meal.length - 1}
                      product={item.product}
                      serving={item.serving}
                      onSelect={handleSelect}
                    />
                  );
                }}
                renderHiddenItem={({ item }) => {
                  return <ItemActions onDelete={() => {}} />;
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
                  language.types.ingredient.single
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

          <ProductImpact
            meal={meal}
            serving={{
              gram: 135,
              option: "plakje",
              quantity: 1,
            }}
          />

          <ProductNutrition
            meal={meal}
            serving={{
              gram: 135,
              option: "plakje",
              quantity: 1,
            }}
          />
        </View>
      </ScrollView>

      <ButtonOverlay
        title={language.modifications.getSave("Inschatting")}
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
            language.types.ingredient.single
          )}
          onPress={() => onClose()}
        />
      </View>
    </Modal>
  );
}
