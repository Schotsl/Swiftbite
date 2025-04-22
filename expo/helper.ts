import { RowMap } from "react-native-swipe-list-view";
import { Option, Product, ProductInsert } from "./types";
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

export const handleError = (error: Error | null) => {
  if (error) {
    console.log(error);

    throw new Error(error.message);
  }
};

export const rowTimeout = <T>(rowKey: string, rowMap: RowMap<T>) => {
  rowMap[rowKey]?.closeRow();
  setTimeout(() => {
    rowMap[rowKey]?.closeRow();
  }, 500);
};

export const getOptions = (product?: Product | ProductInsert) => {
  let options = [
    {
      title: "1 g",
      value: "1-gram",
      gram: 1,
    },
    {
      title: "100 g",
      value: "100-gram",
      gram: 100,
    },
  ];

  if (product?.quantity_original) {
    options.push({
      title: `Productinhoud (${product.quantity_original} ${product.quantity_original_unit})`,
      value: `quantity`,
      gram: product.quantity_original,
    });
  }

  if (product?.serving_original) {
    options.push({
      title: `Portiegrootte (${product.serving_original} ${product.serving_original_unit})`,
      value: `serving`,
      gram: product.serving_gram!,
    });
  }

  if (product?.options) {
    const productOptions = product?.options as Option[];

    productOptions.forEach((productOption) => {
      options.push({
        title: `${productOption.title} (${productOption.gram} g)`,
        value: productOption.value,
        gram: productOption.gram,
      });
    });
  }

  return options;
};

export const getToday = () => {
  const now = new Date();

  const startDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endingDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  );
  return {
    endDate: endingDay.toISOString(),
    startDate: startDay.toISOString(),
  };
};
