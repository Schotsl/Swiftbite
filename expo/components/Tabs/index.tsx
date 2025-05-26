import { Href, Link, useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { Fragment, useRef, useEffect } from "react";
import { Pressable, View, type LayoutChangeEvent } from "react-native";

import TextLarge from "@/components/Text/Large";
import ButtonSmall from "@/components/Button/Small";

import variables from "@/variables";

type TabLink = {
  href: Href;
  title: string;
};

type TabAction = {
  value: string;
  title: string;
};

type Tab = TabLink | TabAction;
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
  const router = useRouter();

  const scrollRef = useRef<ScrollView>(null);
  const scrollWidth = useRef<number>(0);

  const tabsLayouts = useRef<({ x: number; width: number } | null)[]>([]);

  // I've asked Gemini to write the API for centering on a tab when clicked although I do understand it it should be mentioned
  useEffect(() => {
    const tabsLength = tabs.length;
    const tabsUpdated = Array(tabsLength).fill(null);

    tabs.forEach((_, index) => {
      if (!tabsLayouts.current || !tabsLayouts.current[index]) {
        return;
      }

      tabsUpdated[index] = tabsLayouts.current[index];
    });
    tabsLayouts.current = tabsUpdated;
  }, [tabs]);

  const handleCenter = (index: number) => {
    const tabLayout = tabsLayouts.current[index];

    if (tabLayout && scrollWidth.current > 0 && scrollRef.current) {
      const tabCenter = tabLayout.x + tabLayout.width / 2;
      const tabPosition = tabCenter - scrollWidth.current / 2;

      scrollRef.current.scrollTo({ x: tabPosition, animated: true });
    }
  };

  return (
    <View>
      <View
        style={{
          height: variables.heightTab,
          alignItems: "center",
          paddingTop: 12,
          paddingBottom: 24,
          borderColor: variables.border.color,
          borderBottomWidth: variables.border.width,
          backgroundColor: "#fff",
        }}
      >
        <ScrollView
          ref={scrollRef}
          style={{ overflow: "visible" }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          onLayout={(event: LayoutChangeEvent) => {
            scrollWidth.current = event.nativeEvent.layout.width;
          }}
        >
          <View
            style={{
              gap: variables.padding.page,
              paddingHorizontal: variables.padding.page,

              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            {back && (
              <ButtonSmall
                icon="arrow-left"
                nano={true}
                onPress={() => router.back()}
              />
            )}

            {tabs.map((tab, index) => {
              const isLast = index === tabs.length - 1;
              const isActive =
                "href" in tab ? value === tab.href : value === tab.value;

              const tabVisualContent = (
                <TextLarge
                  weight="medium"
                  color={
                    isActive
                      ? variables.colors.text.primary
                      : variables.colors.greyDark
                  }
                >
                  {tab.title}
                </TextLarge>
              );

              const handleLayout = (event: LayoutChangeEvent) => {
                const { x, width } = event.nativeEvent.layout;

                if (index < tabsLayouts.current.length) {
                  tabsLayouts.current[index] = { x, width };
                } else {
                  const tabsUpdated = [...tabsLayouts.current];

                  while (tabsUpdated.length <= index) {
                    tabsUpdated.push(null);
                  }

                  tabsUpdated[index] = { x, width };
                  tabsLayouts.current = tabsUpdated;
                }
              };

              return (
                <Fragment key={index}>
                  {"href" in tab ? (
                    <Link href={tab.href} asChild>
                      <Pressable
                        onLayout={handleLayout}
                        onPress={() => {
                          handleCenter(index);
                        }}
                      >
                        {tabVisualContent}
                      </Pressable>
                    </Link>
                  ) : (
                    <Pressable
                      onLayout={handleLayout}
                      onPress={() => {
                        handleCenter(index);
                        onSelect?.(tab.value);
                      }}
                    >
                      {tabVisualContent}
                    </Pressable>
                  )}

                  {!isLast && (
                    <View
                      style={{
                        width: 2,
                        height: 18,

                        backgroundColor: variables.colors.greyDark,
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
        <ButtonSmall
          icon="plus"
          nano={true}
          style={{
            top: 12,
            right: variables.padding.page,
            position: "absolute",
          }}
          onPress={() => router.push(add)}
        />
      )}
    </View>
  );
}
