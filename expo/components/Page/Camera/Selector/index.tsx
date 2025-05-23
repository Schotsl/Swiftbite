import { GestureResponderEvent, useWindowDimensions, View } from "react-native";
import { useState, useRef } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { CameraSelected } from "@/types";

import MaskedView from "@react-native-masked-view/masked-view";
import CameraSelectorItem from "./Item";
import CameraSelectorGradient from "./Gradient";
import language from "@/language";

type CameraSelectorProps = {
  estimation: boolean;
  onSelect: (item: CameraSelected) => void;
};

export default function CameraSelector({
  estimation,
  onSelect,
}: CameraSelectorProps) {
  const { width } = useWindowDimensions();

  const [isDragging, setIsDragging] = useState(false);

  const widthItem = 150;

  const [activeItem, setActiveItem] = useState(CameraSelected.Barcode);

  const scrollMaskedRef = useRef<ScrollView>(null);
  const scrollOverlayRef = useRef<ScrollView>(null);

  const containerWidth = width + widthItem * 2;
  const containerPadding = width / 2 - widthItem / 2;

  const snapPoints = estimation
    ? {
        [CameraSelected.Estimation]: widthItem * 0,
        [CameraSelected.Barcode]: widthItem * 1,
        [CameraSelected.Label]: widthItem * 2,
      }
    : {
        [CameraSelected.Barcode]: widthItem * 0,
        [CameraSelected.Label]: widthItem * 1,
      };

  const handleOverlayScroll = (event: any) => {
    const x = event.nativeEvent.contentOffset.x;

    // Update the scroll position of the masked view
    scrollMaskedRef.current?.scrollTo({ x, animated: false });

    let closestItem = CameraSelected.Barcode;
    let closestDifference = Infinity;

    for (const [title, point] of Object.entries(snapPoints)) {
      const difference = Math.abs(x - point);

      if (difference < closestDifference) {
        closestDifference = difference;
        closestItem = title as CameraSelected;
      }
    }

    if (closestItem !== activeItem) {
      setActiveItem(closestItem);

      onSelect(closestItem);
    }
  };

  const handleTouch = (event: GestureResponderEvent) => {
    if (isDragging) return;

    const leftHalf = width / 2 - widthItem / 2;
    const rightHalf = width / 2 + widthItem / 2;

    const order = Object.entries(snapPoints);
    const index = order.findIndex(([key]) => key === activeItem);

    if (event.nativeEvent.pageX < leftHalf) {
      const leftItem = order[index - 1];

      if (leftItem) {
        scrollMaskedRef.current?.scrollTo({ x: leftItem[1], animated: true });
        scrollOverlayRef.current?.scrollTo({ x: leftItem[1], animated: true });

        const item = leftItem[0] as CameraSelected;

        setActiveItem(item);
        onSelect(item);
      }
    }

    if (event.nativeEvent.pageX > rightHalf) {
      const rightItem = order[index + 1];

      if (rightItem) {
        scrollMaskedRef.current?.scrollTo({ x: rightItem[1], animated: true });
        scrollOverlayRef.current?.scrollTo({ x: rightItem[1], animated: true });

        const item = rightItem[0] as CameraSelected;

        setActiveItem(item);
        onSelect(item);
      }
    }
  };

  return (
    <View style={{ height: 60, width: width }}>
      <MaskedView
        style={{
          width: width,
          height: 60,
        }}
        maskElement={
          <View style={{ flex: 1 }}>
            <ScrollView
              ref={scrollMaskedRef}
              style={{
                width: width,
                height: 60,
              }}
              horizontal={true}
              scrollEnabled={false}
              contentOffset={{ x: estimation ? widthItem : 0, y: 0 }}
              contentContainerStyle={{ alignItems: "center", height: 60 }}
            >
              <View style={{ width: containerPadding }} />

              {estimation && (
                <CameraSelectorItem
                  width={widthItem}
                  title={language.page.camera.options.estimation}
                  active={activeItem === CameraSelected.Estimation}
                />
              )}

              <CameraSelectorItem
                width={widthItem}
                title={language.page.camera.options.barcode}
                active={activeItem === CameraSelected.Barcode}
              />

              <CameraSelectorItem
                width={widthItem}
                title={language.page.camera.options.label}
                active={activeItem === CameraSelected.Label}
              />

              <View style={{ width: containerPadding }} />
            </ScrollView>
          </View>
        }
      >
        <CameraSelectorGradient />
      </MaskedView>

      <ScrollView
        onTouchEnd={handleTouch}
        onScrollBeginDrag={() => setIsDragging(true)}
        onScrollEndDrag={() => setIsDragging(false)}
        ref={scrollOverlayRef}
        style={{
          top: 0,
          left: 0,
          width,
          height: 60,
          opacity: 0,
          position: "absolute",
        }}
        horizontal={true}
        contentOffset={{ x: estimation ? widthItem : 0, y: 0 }}
        snapToOffsets={Object.values(snapPoints)}
        snapToAlignment="center"
        decelerationRate="fast"
        onScroll={handleOverlayScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ height: 60 }}
      >
        <View style={{ width: containerWidth, height: 60 }} />
      </ScrollView>
    </View>
  );
}
