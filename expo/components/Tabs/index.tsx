import { Fragment } from "react";
import { Href, Link } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { FontAwesome6 } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type LinkTab = {
  href: Href;
  title: string;
};

type ActionTab = {
  value: string;
  title: string;
};

type Tab = LinkTab | ActionTab;

type TabsProps = {
  add?: Href;
  back?: boolean;
  tabs: Tab[];
  value: string;
  onSelect?: (value: string) => void;
};

export default function Tabs({
  add,
  back = false,
  tabs,
  value,
  onSelect,
}: TabsProps) {
  return (
    <View>
      <View
        style={{
          alignItems: "center",
          paddingTop: 12,
          paddingBottom: 24,
          borderBottomWidth: 2,
          borderColor: "#000000",
          backgroundColor: "#fff",
        }}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View
            style={{
              gap: 32,
              paddingHorizontal: 32,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            {back && (
              <Link
                href={"/(tabs)/add"}
                style={{
                  width: 28,
                  height: 28,

                  borderWidth: 2,
                  borderColor: "#000000",
                  borderRadius: 100,

                  alignItems: "center",
                  justifyContent: "center",
                }}
                asChild
              >
                <Pressable>
                  <FontAwesome6 name="arrow-left" size={12} color="#000000" />
                </Pressable>
              </Link>
            )}

            {tabs.map((tab, index) => {
              const isLast = index === tabs.length - 1;
              const isActive =
                "href" in tab ? value === tab.href : value === tab.value;

              const tabContent = (
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: "OpenSans_400Regular",

                    textShadowColor: "#000000",
                    textShadowOffset: { width: 0, height: 0 },

                    opacity: isActive ? 1 : 0.25,
                  }}
                >
                  {tab.title}
                </Text>
              );

              return (
                <Fragment key={index}>
                  {"href" in tab ? (
                    <Link href={tab.href}>{tabContent}</Link>
                  ) : (
                    <Pressable onPress={() => onSelect?.(tab.value)}>
                      {tabContent}
                    </Pressable>
                  )}

                  {!isLast && (
                    <View
                      style={{
                        width: 2,
                        height: 18,
                        opacity: 0.25,
                        backgroundColor: "#000000",
                      }}
                    />
                  )}
                </Fragment>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {add && (
        <Link
          href={add}
          style={{
            top: 12,
            right: 32,
            position: "absolute",

            width: 28,
            height: 28,

            borderWidth: 2,
            borderColor: "#000000",
            borderRadius: 100,

            alignItems: "center",
            justifyContent: "center",
          }}
          asChild
        >
          <Pressable>
            <FontAwesome6 name="plus" size={12} color="#000000" />
          </Pressable>
        </Link>
      )}
    </View>
  );
}
