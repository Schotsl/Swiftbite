export const handleError = (error: Error | null) => {
  if (error) {
    console.log(error);

    throw new Error(error.message);
  }
};

export const roundNumber = (number: number, precision = 2) => {
  const factor = Math.pow(10, precision);
  const rounded = Math.round(number * factor);

  return rounded / factor;
};
