import { ImageManipulatorContext, SaveFormat } from "expo-image-manipulator";

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
