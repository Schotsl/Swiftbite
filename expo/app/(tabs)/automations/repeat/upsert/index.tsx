import Button from "@/components/Button";
import { Divider } from "@/components/Divider";
import Header from "@/components/Header";
import Input from "@/components/Input";
import InputLabel from "@/components/Input/Label";
import InputTime from "@/components/Input/Time";
import InputWeekday from "@/components/Input/Weekday";
import ItemDelete from "@/components/Item/Delete";
import ItemProductWithServing from "@/components/Item/ProductWithServing";
import useInsertRepeat from "@/mutations/useInsertRepeat";
import useUpdateRepeat from "@/mutations/useUpdateRepeat";
import openfoodData from "@/queries/openfoodData";
import productData from "@/queries/productData";
import repeatData from "@/queries/repeatData";
import { RepeatData, repeatSchema } from "@/schemas/repeat";
import { ServingData } from "@/schemas/serving";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";

const paramsToServing = ({
  serving_gram,
  serving_option,
  serving_quantity,
}: {
  serving_gram?: string;
  serving_option?: string;
  serving_quantity?: string;
}): ServingData | null => {
  if (!serving_gram || !serving_option || !serving_quantity) {
    return null;
  }

  return {
    gram: parseFloat(serving_gram),
    option: serving_option,
    quantity: parseFloat(serving_quantity),
  };
};

export default function AutomationRepeatUpsert() {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const insertRepeat = useInsertRepeat();
  const updateRepeat = useUpdateRepeat();

  const {
    // I could store the time and weekdays in a local context but for now this is easier
    time: timeParam,
    weekdays: weekdaysParam,

    repeat: repeatId,

    product: productId,
    serving_gram,
    serving_option,
    serving_quantity,
  } = useLocalSearchParams<{
    time?: string;
    weekdays?: string;

    repeat?: string;

    product?: string;
    serving_gram?: string;
    serving_option?: string;
    serving_quantity?: string;
  }>();

  const { data: products } = useQuery({
    ...productData({ uuid: productId }),
    enabled: !!productId,
  });

  const { data: repeat } = useQuery({
    ...repeatData(),
    enabled: !!repeatId,
    select: (data) => data.find((repeat) => repeat.uuid === repeatId),
  });

  const product = repeat?.product || products?.[0];
  const serving =
    repeat?.serving ||
    paramsToServing({
      serving_gram,
      serving_option,
      serving_quantity,
    });

  // TODO: Since we're not using a context there's a lot of data to pick from
  const preferredTime =
    repeat?.time || (timeParam ? new Date(timeParam) : new Date());

  const preferredWeekdays =
    repeat?.weekdays || (weekdaysParam ? weekdaysParam.split(",") : []);

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RepeatData>({
    resolver: zodResolver(repeatSchema),
    defaultValues: {
      time: preferredTime,
      weekdays: preferredWeekdays,
    },
  });

  const timeLocal = watch("time");
  const weekdaysLocal = watch("weekdays");

  const handleSave = (data: RepeatData) => {
    console.log("handleSave", data);
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    if (repeat) {
      updateRepeat.mutate({
        ...repeat,
        ...data,
        product_id: productId!,
      });
    } else {
      insertRepeat.mutate({
        ...data,
        serving,
        meal_id: null,
        product_id: productId!,
      });
    }

    router.replace("/(tabs)/automations/repeat");

    setIsLoading(false);
  };

  const handleDelete = () => {
    console.log("handleDelete");
  };

  return (
    <View style={{ padding: 32 }}>
      <Header title={repeatId ? "Herhaling bewerken" : "Herhaling toevoegen"} />

      <View style={{ gap: 48 }}>
        <View style={{ gap: 32 }}>
          <InputWeekday name="weekdays" label="Herhalen op" control={control} />

          <InputTime name="time" label="Herhalen om" control={control} />

          <View>
            <InputLabel label="Ingrediënt" />
            {product && serving ? (
              <SwipeListView
                data={[product]}
                style={{
                  marginTop: 2,
                  borderWidth: 2,
                  borderColor: "#000",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
                keyExtractor={(item) => item.uuid}
                renderItem={() => {
                  // It might seem random to use a SwipeListView here but I like the animation when swiping to delete
                  return (
                    <ItemProductWithServing
                      small={true}
                      product={product}
                      serving={serving}
                      onPress={() => {
                        router.push({
                          pathname: "/(tabs)/automations/repeat/upsert/product",
                          params: {
                            time: timeLocal.toISOString(),
                            repeat: repeatId,
                            weekdays: weekdaysLocal,
                            product: repeat?.product_id,
                          },
                        });
                      }}
                      border={false}
                    />
                  );
                }}
                renderHiddenItem={({ item }) => (
                  <ItemDelete onDelete={() => {}} />
                )}
                onRowDidOpen={(rowKey, rowMap) => {
                  setTimeout(() => {
                    rowMap[rowKey]?.closeRow();
                  }, 500);
                }}
                rightOpenValue={-75}
                useNativeDriver
                disableRightSwipe
              />
            ) : (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/automations/repeat/upsert/search",
                    params: {
                      time: timeLocal.toISOString(),
                      weekdays: weekdaysLocal.join(","),
                    },
                  })
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

          <View style={{ width: "100%", gap: 24 }}>
            <Button
              title="Herhaling opslaan"
              onPress={handleSubmit(handleSave)}
              loading={isLoading}
              disabled={isLoading}
            />

            {/* <Divider />

            <Button
              title="Herhaling verwijderen"
              disabled={isSubmitting}
              loading={isSubmitting}
            /> */}
          </View>
        </View>
      </View>
    </View>
  );
}
