import Header from "@/components/Header";
import ItemMeal from "@/components/Item/Meal";
import ItemActions from "@/components/Item/Actions";

import InputTime from "@/components/Input/Time";
import InputLabel from "@/components/Input/Label";
import EmptySmall from "@/components/Empty/Small";
import ButtonSmall from "@/components/Button/Small";
import ItemProduct from "@/components/Item/Product";
import InputWeekday from "@/components/Input/Weekday";
import ButtonOverlay from "@/components/Button/Overlay";
import useDeleteRepeat from "@/mutations/useDeleteRepeat";
import ModalBackground from "@/components/Modal/Background";
import NavigationAddList from "@/components/Navigation/Add/List";

import variables from "@/variables";
import language from "@/language";

import { Product } from "@/types/product";
import { Position } from "@/types";
import { ScrollView } from "react-native-gesture-handler";
import { ServingData } from "@/schemas/serving";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, View } from "react-native";
import { MealWithProduct } from "@/types/meal";
import { useEffect, useState } from "react";
import { RepeatData, repeatSchema } from "@/schemas/repeat";

import { useForm } from "react-hook-form";
import { rowTimeout } from "@/helper";
import { useIsFocused } from "@react-navigation/native";
import { useEditRepeat } from "@/context/RepeatContext";
import { SwipeListView } from "react-native-swipe-list-view";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function AutomationsRepeatUpsert() {
  const focus = useIsFocused();
  const router = useRouter();

  const deleteRepeat = useDeleteRepeat();

  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  const [isDeleting, setIsDeleting] = useState(false);

  const { repeat: repeatId } = useLocalSearchParams<{ repeat: string }>();

  const {
    time,
    meal,
    product,
    serving,
    weekdays,
    updating,
    remove,
    saveChanges,
    updateTime,
    updateWeekdays,
  } = useEditRepeat();

  const {
    watch,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<RepeatData>({
    resolver: zodResolver(repeatSchema),
    defaultValues: {
      time,
      weekdays,
    },
  });

  const watchTime = watch("time");
  const watchWeekdays = watch("weekdays");

  useEffect(() => {
    updateTime(watchTime);
  }, [watchTime, updateTime]);

  useEffect(() => {
    updateWeekdays(watchWeekdays);
  }, [watchWeekdays, updateWeekdays]);

  const handleSave = async () => {
    await saveChanges();

    router.replace("/(tabs)/automations/repeat");
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    if (updating) {
      await deleteRepeat.mutateAsync(repeatId);
    }

    router.replace("/(tabs)/automations/repeat");

    setIsDeleting(false);
  };

  const handleSelect = (product: string) => {
    router.push({
      pathname: `/(tabs)/automations/repeat/upsert/product`,
      params: { product },
    });
  };

  const isSet = !!product && !!serving;

  return (
    <View>
      <ScrollView>
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
                ? language.modifications.getEdit(language.types.repeat.single)
                : language.modifications.getSave(language.types.repeat.single)
            }
            content={language.types.repeat.explanation}
            onDelete={handleDelete}
          />

          <View style={{ gap: 32 }}>
            <InputWeekday
              name="weekdays"
              label={language.types.repeat.inputRepeatDate}
              control={control}
            />

            <InputTime
              name="time"
              label={language.types.repeat.inputRepeatTime}
              control={control}
            />

            <View style={{ gap: 12 }}>
              <View>
                <InputLabel label={language.types.ingredient.single} />

                <SwipeListView
                  style={{
                    width: "100%",
                    borderColor: variables.border.color,
                    borderWidth: variables.border.width,
                    borderRadius: variables.border.radius,
                  }}
                  // This is kinda hacky but I want consistent support for swiping
                  data={serving ? [serving] : []}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={() => {
                    return (
                      <AutomationsRepeatUpsertItem
                        meal={meal}
                        product={product}
                        serving={serving}
                        onOpen={() => setOpen(true)}
                        onSelect={handleSelect}
                      />
                    );
                  }}
                  renderHiddenItem={() => {
                    return <ItemActions onDelete={() => remove()} />;
                  }}
                  ListEmptyComponent={() => {
                    return (
                      <EmptySmall
                        content={language.empty.getSelected(
                          language.types.ingredient.single,
                        )}
                        onPress={() => setOpen(true)}
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
                  icon={isSet ? "pencil" : "plus"}
                  title={
                    isSet
                      ? language.modifications.getPick(
                          language.types.ingredient.single,
                        )
                      : language.modifications.getEdit(
                          language.types.ingredient.single,
                        )
                  }
                  onPress={() => setOpen(true)}
                  onPosition={setPosition}
                />
              )}

              <AutomationsRepeatUpsertAdd
                set={isSet}
                open={open}
                position={position}
                onClose={() => setOpen(false)}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <ButtonOverlay
        title={language.modifications.getSave(language.types.repeat.single)}
        onPress={handleSubmit(handleSave)}
        loading={isSubmitting}
        disabled={isSubmitting || isDeleting}
      />
    </View>
  );
}

type AutomationsRepeatUpsertItemProps = {
  meal?: MealWithProduct | null;
  product?: Product | null;
  serving?: ServingData | null;
  onOpen: () => void;
  onSelect: (product: string) => void;
};

function AutomationsRepeatUpsertItem({
  meal,
  product,
  serving,
  onOpen,
  onSelect,
}: AutomationsRepeatUpsertItemProps) {
  if (meal && serving) {
    return (
      <ItemMeal
        meal={meal}
        icon={false}
        small={true}
        border={false}
        serving={serving}
        onSelect={onSelect}
      />
    );
  }

  if (product && serving) {
    return (
      <ItemProduct
        icon={false}
        small={true}
        border={false}
        product={product}
        serving={serving}
        onSelect={onSelect}
      />
    );
  }
}

type AutomationsRepeatUpsertAddProps = {
  set: boolean;
  open: boolean;
  position: Position;
  onClose: () => void;
};

function AutomationsRepeatUpsertAdd({
  set,
  open,
  position,
  onClose,
}: AutomationsRepeatUpsertAddProps) {
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
          top: position.y - 133,
          left: position.x,
          position: "absolute",
        }}
      >
        <NavigationAddList
          search="/automations/repeat/upsert/search"
          camera="/automations/repeat/upsert/camera"
          onClose={onClose}
          style={{
            left: 100,
            bottom: 0,
            position: "relative",
          }}
        />

        <ButtonSmall
          icon={set ? "pencil" : "plus"}
          title={
            set
              ? language.modifications.getEdit(language.types.ingredient.single)
              : language.modifications.getPick(language.types.ingredient.single)
          }
          onPress={() => onClose()}
        />
      </View>
    </Modal>
  );
}
