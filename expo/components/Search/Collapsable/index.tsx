import ItemProduct from "@/components/Item/Product";
import SearchCollapsableEmpty from "./Empty";
import SearchCollapsableSkeleton from "./Skeleton";

import { FlatList } from "react-native-gesture-handler";
import { Product } from "@/types/product";
import { FontAwesome6 } from "@expo/vector-icons";
import { useState, useRef } from "react";
import { View, Text, Animated, TouchableOpacity } from "react-native";

type SearchCollapsableProps = {
  empty: string;
  title: string;
  loading: boolean;
  products?: Product[];
  onSelect: (product: string) => void;
};

export default function SearchCollapsable({
  empty,
  title,
  loading,
  products = [],
  onSelect,
}: SearchCollapsableProps) {
  const [open, setOpen] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggleOpen = () => {
    const toValue = open ? 0 : 1;

    Animated.spring(rotateAnim, {
      toValue,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();

    setOpen(!open);
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const isEmpty = products?.length === 0;

  return (
    <View style={{ borderColor: "#000", borderBottomWidth: 2 }}>
      <TouchableOpacity
        onPress={toggleOpen}
        activeOpacity={1}
        style={{
          backgroundColor: "#E5E5E5",
          paddingHorizontal: 32,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: "OpenSans_400Regular",
          }}
        >
          {title}
        </Text>

        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <FontAwesome6 name="chevron-down" size={16} color="#000" />
        </Animated.View>
      </TouchableOpacity>

      {open && (
        <View style={{ minHeight: !isEmpty ? "auto" : 180 }}>
          {loading ? (
            <SearchCollapsableSkeleton />
          ) : isEmpty ? (
            <SearchCollapsableEmpty empty={empty} />
          ) : (
            products && (
              <FlatList
                data={products}
                style={{ borderColor: "#000", borderTopWidth: 2 }}
                scrollEnabled={false}
                keyExtractor={(item) => item.uuid}
                renderItem={({ item, index }) => (
                  <ItemProduct
                    border={index !== products.length - 1}
                    product={item}
                    onSelect={() => onSelect(item.uuid)}
                  />
                )}
              />
            )
          )}
        </View>
      )}
    </View>
  );
}
