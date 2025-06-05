import { ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Href, useRouter } from "expo-router";
import { Fragment, useRef, useEffect } from "react";
import { TouchableOpacity, View, type LayoutChangeEvent } from "react-native";

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

  // I've asked Gemini to write the API for centering on a tab when clicked
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
      {back && (
        <Fragment>
          <View
            style={{
              top: 12,
              left: 0,
              zIndex: 1,
              position: "absolute",
              flexDirection: "row",
              pointerEvents: "none",
            }}
          >
            <View
              style={{
                width:
                  variables.gap.small +
                  variables.padding.page +
                  variables.heightButtonNano,
                height: variables.heightButtonNano,
                backgroundColor: variables.colors.white,
              }}
            />

            <View
              style={{
                width: variables.gap.normal,
                height: "100%",
              }}
            >
              <LinearGradient
                end={{ x: 1, y: 0 }}
                start={{ x: 0, y: 0 }}
                style={{ flex: 1 }}
                colors={["rgba(255,255,255,1)", "rgba(255,255,255,0)"]}
              />
            </View>
          </View>

          <ButtonSmall
            icon="arrow-left"
            nano={true}
            style={{
              top: 12,
              left: variables.padding.page,
              zIndex: 2,
              position: "absolute",
            }}
            onPress={() => router.back()}
          />
        </Fragment>
      )}

      <View
        style={{
          height: variables.heightTab,
          alignItems: "center",
          paddingTop: 0,
          paddingBottom: 12,
          borderColor: variables.border.color,
          borderBottomWidth: variables.border.width,
        }}
      >
        <ScrollView
          ref={scrollRef}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          onLayout={(event: LayoutChangeEvent) => {
            scrollWidth.current = event.nativeEvent.layout.width;
          }}
        >
          <View
            style={{
              gap: variables.padding.page,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",

              paddingLeft: back
                ? 30 +
                  variables.padding.page +
                  variables.gap.small +
                  variables.gap.normal
                : variables.padding.page,
              paddingRight: add
                ? 30 +
                  variables.padding.page +
                  variables.gap.small +
                  variables.gap.normal
                : variables.padding.page,
            }}
          >
            {tabs.map((tab, index) => {
              const isLast = index === tabs.length - 1;
              const isActive =
                "href" in tab ? value === tab.href : value === tab.value;

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
                  <TouchableOpacity
                    style={{ padding: 4 }}
                    onLayout={handleLayout}
                    onPress={() => {
                      handleCenter(index);

                      if ("href" in tab) {
                        router.push(tab.href);
                      } else {
                        onSelect?.(tab.value);
                      }
                    }}
                  >
                    <TextLarge
                      weight="semibold"
                      color={
                        isActive
                          ? variables.colors.text.primary
                          : variables.colors.greyText
                      }
                    >
                      {tab.title}
                    </TextLarge>
                  </TouchableOpacity>

                  {!isLast && (
                    <View
                      style={{
                        width: 2,
                        height: 18,

                        backgroundColor: variables.colors.greyText,
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
        <Fragment>
          <View
            style={{
              top: 12,
              right: 0,
              zIndex: 1,
              position: "absolute",
              flexDirection: "row",
              pointerEvents: "none",
            }}
          >
            <View
              style={{
                width: variables.gap.normal,
                height: "100%",
              }}
            >
              <LinearGradient
                end={{ x: 1, y: 0 }}
                start={{ x: 0, y: 0 }}
                style={{ flex: 1 }}
                colors={["rgba(255,255,255,0)", "rgba(255,255,255,1)"]}
              />
            </View>

            <View
              style={{
                width:
                  variables.gap.small +
                  variables.padding.page +
                  variables.heightButtonNano,
                height: variables.heightButtonNano,
                backgroundColor: variables.colors.white,
              }}
            />
          </View>

          <ButtonSmall
            icon="plus"
            nano={true}
            style={{
              top: 12,
              right: variables.padding.page,
              zIndex: 2,
              position: "absolute",
            }}
            onPress={() => router.push(add)}
          />
        </Fragment>
      )}
    </View>
  );
}
