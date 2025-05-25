import { supabase } from "@/utils/supabase";
import { fetchRepeat } from "@/utils/supabase";
import { handleError } from "@/helper";

const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export const maxDuration = 120;

export async function POST() {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  const currentLabel = days[currentDay];

  // Only proceed if it's midnight or close to it
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();

  // Allow a small window around midnight for execution
  if (currentHour !== 0 || currentMinute > 5) {
    return new Response("{}", { status: 200 });
  }

  const repeats = await fetchRepeat();

  // Filter repeats for today and create entries with future timestamps
  const todayRepeats = repeats.filter((repeat) =>
    repeat.weekdays.includes(currentLabel),
  );

  const todayPromises = todayRepeats.map(async (repeat) => {
    // Parse the time from the repeat (assuming it's in HH:MM format or ISO string)
    const repeatTime = new Date(repeat.time);
    const repeatHour = repeatTime.getHours();
    const repeatMinute = repeatTime.getMinutes();

    // Create a new date for today with the scheduled time
    const createdAt = new Date(currentDate);

    createdAt.setHours(repeatHour, repeatMinute, 0, 0);

    const entryData = {
      serving: repeat.serving,
      user_id: repeat.user_id,
      meal_id: repeat.meal_id,
      product_id: repeat.product_id,
      created_at: createdAt.toISOString(),
    };

    const { error, data } = await supabase
      .from("entry")
      .insert(entryData)
      .select("*");

    handleError(error);

    return data;
  });

  await Promise.all(todayPromises);

  return new Response("{}", { status: 200 });
}
