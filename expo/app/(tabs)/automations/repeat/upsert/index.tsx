import Header from "@/components/Header";
import InputLabel from "@/components/Input/Label";
import InputTime from "@/components/Input/Time";
import InputWeekday from "@/components/Input/Weekday";
import ButtonOverlay from "@/components/Button/Overlay";
import ItemProductWithServing from "@/components/Item/ProductWithServing";

import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditRepeat } from "@/context/RepeatContext";
import { useEffect, useState } from "react";
import { RepeatData, repeatSchema } from "@/schemas/repeat";
import { Text, TouchableOpacity, View } from "react-native";
import ButtonSmall from "@/components/Button/Small";

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

              {product && serving ? (
                <View
                  style={{
                    marginTop: 2,
                    borderWidth: 2,
                    borderColor: "#000",
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  <ItemProductWithServing
                    icon={false}
                    small={true}
                    border={false}
                    product={product}
                    serving={serving}
                    onPress={() => {
                      router.push("/(tabs)/automations/repeat/upsert/product");
                    }}
                  />
                </View>
              ) : (
                // TODO: Make a empty state component
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() =>
                    router.push("/(tabs)/automations/repeat/upsert/search")
                  }
                  style={{
                    height: 80,
                    borderWidth: 2,
                    borderColor: "#000",
                    borderRadius: 8,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      opacity: 0.25,
                      maxWidth: 200,
                      textAlign: "center",

                      fontSize: 14,
                      fontWeight: "semibold",
                    }}
                  >
                    Nog geen ingrediënt geselecteerd
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <ButtonSmall
              icon={product && serving ? "pencil" : "plus"}
              title={
                product && serving ? "Ingrediënt wijzigen" : "Ingrediënt kiezen"
              }
              onPress={() => {
                router.push("/(tabs)/automations/repeat/upsert/search");
              }}
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
