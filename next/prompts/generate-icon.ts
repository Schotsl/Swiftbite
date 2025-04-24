export const generateIconPrompt = (title: string) => {
  return `
Create a stylized icon representing ${title} using bold, angular geometric shapes and sharp edges. The defining feature should be rough, jagged lines used for outlines (typically black) and internal details, giving the icon a raw, industrial, and almost brutal feel. The design must feature intentionally uneven lines and a textured appearance inherent in this style.

Utilize a limited but striking color palette of 3 to 5 colors in total. If black is used for the outlines, ensure there are at least two other distinct colors used for fills and accents, chosen appropriately for the ${title}. These colors should create high contrast and enhance the bold aesthetic.

Design the icon with a composition that fits naturally within a circle, avoiding excessively tall or wide shapes and aiming for a relatively balanced aspect ratio. Maintain a minimalist composition overall, focusing on the core elements of the ${title} rendered in this distinct, harsh style.

The background must be transparent, and the final output should be a flat vector graphic. The goal is a visually impactful icon that stands out due to its unique aesthetic.
`;
};
