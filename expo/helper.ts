import { ImageManipulatorContext, SaveFormat } from "expo-image-manipulator";
import { RowMap } from "react-native-swipe-list-view";

export const renderToBase64 = async (
  manipulator: ImageManipulatorContext,
  compressed: boolean
) => {
  const format = SaveFormat.JPEG;
  const base64 = true;
  const compress = compressed ? 0.5 : 1;

  const manipulatorRender = await manipulator.renderAsync();
  const manipulatorSaved = await manipulatorRender.saveAsync({
    format,
    base64,
    compress,
  });

  return manipulatorSaved.base64!;
};

export const handleError = (error: Error | null) => {
  if (error) {
    console.log(error);

    throw new Error(error.message);
  }
};

export const rowTimeout = <T>(rowKey: string, rowMap: RowMap<T>) => {
  console.log(rowKey, rowMap);
  rowMap[rowKey]?.closeRow();
  setTimeout(() => {
    rowMap[rowKey]?.closeRow();
  }, 500);
};
