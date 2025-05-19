import Header from "@/components/Header";
import InputTime from "@/components/Input/Time";
import InputLabel from "@/components/Input/Label";
import EmptySmall from "@/components/Empty/Small";
import ButtonSmall from "@/components/Button/Small";
import ItemProduct from "@/components/Item/Product";
import InputWeekday from "@/components/Input/Weekday";
import ButtonOverlay from "@/components/Button/Overlay";

import { View } from "react-native";
import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditRepeat } from "@/context/RepeatContext";
import { useEffect, useState } from "react";
import { RepeatData, repeatSchema } from "@/schemas/repeat";

export default function AutomationRepeatUpsert() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    time,
    product,
    serving,
    weekdays,
    updating,
    removeRepeat,
    updateTime,
    updateWeekdays,
    saveChanges,
  } = useEditRepeat();

  const { control, watch, handleSubmit } = useForm<RepeatData>({
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

  const handleSave = () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    saveChanges();

    router.replace("/(tabs)/automations/repeat");

    setIsLoading(false);
  };

  const handleDelete = () => {
    setIsDeleting(true);

    removeRepeat();

    router.replace("/(tabs)/automations/repeat");

    setIsDeleting(false);
  };

  const handleSelect = (product: string) => {
    router.push({
      pathname: `/(tabs)/automations/repeat/upsert/product`,
      params: { product },
    });
  };

  const handleSearch = () => {
    router.push({
      pathname: `/(tabs)/automations/repeat/upsert/search`,
    });
  };

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
                {product && serving ? (
                  <ItemProduct
                    icon={false}
                    small={true}
                    border={false}
                    product={product}
                    serving={serving}
                    onSelect={handleSelect}
                  />
                ) : (
                  <EmptySmall
                    content="Je hebt nog geen ingrediënt geselecteerd"
                    onPress={handleSearch}
                  />
                )}
              </View>
            </View>

            <ButtonSmall
              icon={product && serving ? "pencil" : "plus"}
              title={
                product && serving ? "Ingrediënt wijzigen" : "Ingrediënt kiezen"
              }
              onPress={handleSearch}
            />
          </View>
        </View>
      </View>

      <ButtonOverlay
        title="Herhaling opslaan"
        onPress={handleSubmit(handleSave)}
        loading={isLoading}
        disabled={isLoading || isDeleting}
      />
    </View>
  );
}
