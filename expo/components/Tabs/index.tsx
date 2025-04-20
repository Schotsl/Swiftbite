import { FontAwesome6 } from "@expo/vector-icons";
import { Href, Link } from "expo-router";
import { Fragment } from "react";
import { Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

type Tab = {
  href: Href;
  title: string;
};

type TabsProps = {
  add?: Href;
  tabs: Tab[];
  value: string;
};

export default function Tabs({ add, tabs, value }: TabsProps) {
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
            {tabs.map((tab, index) => {
              const isLast = tab.href === tabs[tabs.length - 1].href;
              const isActive = value === tab.href;

              return (
                <Fragment key={index}>
                  <Link href={tab.href}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "regular",

                        textShadowColor: "#000000",
                        textShadowOffset: { width: 0, height: 0 },

                        opacity: isActive ? 1 : 0.25,
                      }}
                    >
                      {tab.title}
                    </Text>
                  </Link>

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
            top: 10,
            right: 22,
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
