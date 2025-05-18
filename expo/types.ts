export type MacroAbsolute = {
  fat: number;
  carbs: number;
  protein: number;
  calories: number;
};

export type Option = {
  value: string;
  title: string;
};

export type OptionWithGram = Option & {
  gram: number;
};

export enum CameraSelected {
  Label = "Label",
  Barcode = "Barcode",
  Estimation = "Estimation",
}
