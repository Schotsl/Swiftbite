import { GestureResponderEvent, useWindowDimensions, View } from "react-native";
import CameraSelectorItem from "./Item";
import { useState, useRef } from "react";
import MaskedView from "@react-native-masked-view/masked-view";
import { ScrollView } from "react-native-gesture-handler";
import CameraSelectorGradient from "./Gradient";

enum CameraSelected {
  Label = "Label",
  Barcode = "Barcode",
  Estimation = "Estimation",
}

export default function CameraSelector() {
  const { width } = useWindowDimensions();

  const [isDragging, setIsDragging] = useState(false);

  const widthItem = 150;

  const [activeItem, setActiveItem] = useState(CameraSelected.Barcode);

  const scrollMaskedRef = useRef<ScrollView>(null);
  const scrollOverlayRef = useRef<ScrollView>(null);

  const containerWidth = width + widthItem * 2;
  const containerPadding = width / 2 - widthItem / 2;

  const snapPoints = {
    [CameraSelected.Label]: widthItem * 0,
    [CameraSelected.Barcode]: widthItem * 1,
    [CameraSelected.Estimation]: widthItem * 2,
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
        setActiveItem(leftItem[0] as CameraSelected);
        scrollMaskedRef.current?.scrollTo({ x: leftItem[1], animated: true });
        scrollOverlayRef.current?.scrollTo({ x: leftItem[1], animated: true });
      }
    }

    if (event.nativeEvent.pageX > rightHalf) {
      const rightItem = order[index + 1];

      if (rightItem) {
        setActiveItem(rightItem[0] as CameraSelected);
        scrollMaskedRef.current?.scrollTo({ x: rightItem[1], animated: true });
        scrollOverlayRef.current?.scrollTo({ x: rightItem[1], animated: true });
      }
    }
  };

  return (
    <View style={{ height: 60, width: width, marginTop: "auto" }}>
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
              contentOffset={{ x: widthItem, y: 0 }}
              contentContainerStyle={{ alignItems: "center", height: 60 }}
            >
              <View style={{ width: containerPadding }} />

              <CameraSelectorItem
                width={widthItem}
                title="Inschatting"
                active={activeItem === CameraSelected.Label}
              />

              <CameraSelectorItem
                width={widthItem}
                title="Barcode"
                active={activeItem === CameraSelected.Barcode}
              />

              <CameraSelectorItem
                width={widthItem}
                title="Voedingsetiket"
                active={activeItem === CameraSelected.Estimation}
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
        contentOffset={{ x: widthItem, y: 0 }}
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
