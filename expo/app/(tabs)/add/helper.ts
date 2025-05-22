// HAPPY

import language from "@/language";

import { Entry } from "@/types/entry";

type Section = {
  data: Entry[];
  title: string;
  subtitle: string;
  startHour: number;
};

export const getSections = (entries: Entry[]): Section[] => {
  const sections: Section[] = [
    {
      data: [],
      title: language.time.night,
      subtitle: "21:00 - 06:00",
      startHour: 21,
    },
    {
      data: [],
      title: language.time.evening,
      subtitle: "17:00 - 21:00",
      startHour: 17,
    },
    {
      data: [],
      title: language.time.afternoon,
      subtitle: "12:00 - 17:00",
      startHour: 12,
    },
    {
      data: [],
      title: language.time.morning,
      subtitle: "06:00 - 12:00",
      startHour: 6,
    },
  ];

  // Populate active sections with data
  entries?.forEach((entry) => {
    const entryDate = new Date(entry.created_at);
    const entryHour = entryDate.getHours();

    let targetSection;

    if (entryHour >= 6 && entryHour < 12) {
      targetSection = sections.find((s) => s.title === language.time.morning);
    } else if (entryHour >= 12 && entryHour < 17) {
      targetSection = sections.find((s) => s.title === language.time.afternoon);
    } else if (entryHour >= 17 && entryHour < 21) {
      targetSection = sections.find((s) => s.title === language.time.evening);
    } else {
      targetSection = sections.find((s) => s.title === language.time.night);
    }

    if (targetSection) {
      targetSection.data.push(entry);
    }
  });

  // Sort the active sections chronologically for display
  sections.sort((a, b) => b.startHour - a.startHour);

  // Filter out the sections with no data
  const sectionsFiltered = sections.filter(({ data }) => data.length > 0);

  return sectionsFiltered;
};
