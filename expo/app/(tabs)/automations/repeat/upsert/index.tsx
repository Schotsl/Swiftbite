import Header from "@/components/Header";
import ItemMeal from "@/components/Item/Meal";
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

import { Product } from "@/types/product";
import { useForm } from "react-hook-form";
import { Position } from "@/types";
import { ServingData } from "@/schemas/serving";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useEditRepeat } from "@/context/RepeatContext";
import { MealWithProduct } from "@/types/meal";
import { useEffect, useState } from "react";
import { RepeatData, repeatSchema } from "@/schemas/repeat";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function AutomationRepeatUpsert() {
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
    <View style={{ padding: 32 }}>
      <Header
        title={updating ? "Herhaling bewerken" : "Herhaling toevoegen"}
        content="Een herhaling is een product dat automatisch toevoegt wordt op de dagen en tijden die jij kiest"
        onDelete={handleDelete}
      />

      <View style={{ gap: 48 }}>
        <View style={{ gap: 32 }}>
          <InputWeekday name="weekdays" label="Herhalen op" control={control} />

          <InputTime name="time" label="Herhalen om" control={control} />

          <View style={{ gap: 12 }}>
            <View>
              <InputLabel label="Ingrediënt" />

              <View
                style={{
                  overflow: "hidden",
                  marginTop: 2,
                  borderWidth: 2,
                  borderColor: "#000",
                  borderRadius: 8,
                }}
              >
                <AutomationRepeatUpsertItem
                  meal={meal}
                  product={product}
                  serving={serving}
                  onOpen={() => setOpen(true)}
                  onSelect={handleSelect}
                />
              </View>
            </View>

            {focus && (
              <ButtonSmall
                icon={isSet ? "pencil" : "plus"}
                title={isSet ? "Ingrediënt wijzigen" : "Ingrediënt kiezen"}
                onPress={() => setOpen(true)}
                onPosition={setPosition}
              />
            )}

            <AutomationRepeatUpsertAdd
              set={isSet}
              open={open}
              position={position}
              onClose={() => setOpen(false)}
            />
          </View>
        </View>
      </View>

      <ButtonOverlay
        title="Herhaling opslaan"
        onPress={handleSubmit(handleSave)}
        loading={isSubmitting}
        disabled={isSubmitting || isDeleting}
      />
    </View>
  );
}

type AutomationRepeatUpsertItemProps = {
  meal?: MealWithProduct | null;
  product?: Product | null;
  serving?: ServingData | null;
  onOpen: () => void;
  onSelect: (product: string) => void;
};

function AutomationRepeatUpsertItem({
  meal,
  product,
  serving,
  onOpen,
  onSelect,
}: AutomationRepeatUpsertItemProps) {
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

  return (
    <EmptySmall
      content="Je hebt nog geen ingrediënt geselecteerd"
      onPress={onOpen}
    />
  );
}

type AutomationRepeatUpsertAddProps = {
  set: boolean;
  open: boolean;
  position: Position;
  onClose: () => void;
};

function AutomationRepeatUpsertAdd({
  set,
  open,
  position,
  onClose,
}: AutomationRepeatUpsertAddProps) {
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
          search="/automations/repeat/upsert/search"
          camera="/automations/repeat/upsert/product"
          onClose={onClose}
          style={{ position: "relative", bottom: 0 }}
        />

        <ButtonSmall
          icon={set ? "pencil" : "plus"}
          title={set ? "Ingrediënt wijzigen" : "Ingrediënt kiezen"}
          onPress={() => onClose()}
        />
      </View>
    </Modal>
  );
}
