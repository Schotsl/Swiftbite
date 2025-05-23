export type Macro = {
  fat: number;
  carbs: number;
  protein: number;
  calories: number;
};

export type Position = {
  x: number;
  y: number;
};

export type Image = {
  uri: string;
  width: number;
  height: number;
};

export type MacroExpanded = Macro & {
  salt: number;
  fiber: number;
  carbsSugars: number;
  fatSaturated: number;
  fatUnsaturated: number;
};

export type Option = {
  value: string;
  title: string;
};

export type OptionWithGram = Option & {
  gram: number;
};

export enum CameraSelected {
  Label = "label",
  Barcode = "barcode",
  Estimation = "estimation",
}
