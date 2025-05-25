import Empty from "@/components/Empty";
import TextBody from "@/components/Text/Body";
import ItemProduct from "@/components/Item/Product";
import ItemSkeleton from "@/components/Item/Skeleton";

import { useRef } from "react";
import { Product } from "@/types/product";
import { FlatList } from "react-native-gesture-handler";
import { FontAwesome6 } from "@expo/vector-icons";
import { TouchableOpacity, View, Animated } from "react-native";

import variables from "@/variables";

type PageSearchProductCollapsableProps = {
  empty: string;
  emoji: string;
  title: string;
  opened: string | null;
  loading: boolean;
  products?: Product[];

  onOpen: (title: string | null) => void;
  onSelect: (product: string) => void;
};

export default function PageSearchProductCollapsable({
  empty,
  emoji,
  title,
  opened,
  loading,
  products = [],
  onOpen,
  onSelect,
}: PageSearchProductCollapsableProps) {
  const isOpen = opened === title;
  const isEmpty = products?.length === 0;

  const height = isEmpty ? 180 : "auto";
  const animation = useRef(new Animated.Value(0)).current;

  const toggleOpen = () => {
    const toValue = isOpen ? 0 : 1;

    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();

    onOpen(isOpen ? null : title);
  };

  const spin = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View>
      <TouchableOpacity
        onPress={toggleOpen}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",

          paddingHorizontal: variables.padding.page,
          paddingVertical: variables.padding.small.vertical,

          backgroundColor: variables.colors.background.secondary,

          borderBottomWidth: variables.border.width,
          borderBottomColor: isOpen
            ? variables.colors.grey
            : variables.colors.text.secondary,
        }}
      >
        <TextBody color={variables.colors.text.secondary}>{title}</TextBody>

        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <FontAwesome6
            name="chevron-down"
            size={16}
            color={variables.colors.text.secondary}
          />
        </Animated.View>
      </TouchableOpacity>

      {isOpen && (
        <View style={{ minHeight: height }}>
          {loading ? (
            <SearchCollapsableSkeleton />
          ) : isEmpty ? (
            <SearchCollapsableEmpty empty={empty} emoji={emoji} />
          ) : (
            products && (
              <FlatList
                data={products}
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

function SearchCollapsableSkeleton() {
  return (
    <View>
      <ItemSkeleton />
      <ItemSkeleton />
      <ItemSkeleton />
      <ItemSkeleton />
    </View>
  );
}

type SearchCollapsableEmptyProps = {
  empty: string;
  emoji: string;
};

function SearchCollapsableEmpty({ empty, emoji }: SearchCollapsableEmptyProps) {
  return (
    <View
      style={{
        minHeight: 180,
        backgroundColor: variables.colors.greyLight,
        borderBottomWidth: variables.border.width,
        borderBottomColor: variables.border.color,
      }}
    >
      <Empty content={empty} emoji={emoji} />
    </View>
  );
}
