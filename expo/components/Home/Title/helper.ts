// HAPPY

export const getDateRelative = (date: Date): string => {
  const today = new Date();

  // Normalize dates to the start of the day for accurate comparison
  const normalizedDateObject = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const normalizedToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const diffTime = normalizedDateObject.getTime() - normalizedToday.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Vandaag";
  } else if (diffDays === 1) {
    return "Morgen";
  } else if (diffDays === 2) {
    return "Overmorgen";
  } else if (diffDays > 2) {
    return `Over ${diffDays} dagen`;
  } else if (diffDays === -1) {
    return "Gisteren";
  } else if (diffDays === -2) {
    return "Eergisteren";
  } else {
    return `${Math.abs(diffDays)} dagen geleden`;
  }
};
