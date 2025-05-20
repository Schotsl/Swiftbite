const rulesGeneric = `
# General rules for generic items
## Item definition:
  - Suggestions MUST be unbranded, common food items or simple meal components.
  - Generic items do NOT have a brand associated with them.
  
## Category requirement:
  - For each item, a general food category MUST be determined.

## Language consistency:
  - Item names and category names MUST match the language of the user's query.

## No quantity/units:
  - Do NOT include any quantity, size, or unit information for generic items.
  - Generic items represent the concept of the food, not a specific packaged amount.

## Clarity of item names:
  - Item names MUST be clear, commonly understood, and specific enough to be useful (e.g., "Red Apple" is better than just "Fruit" if the query was "Apple" and context allows for more specificity, but avoid overly obscure terms).
`;

export default rulesGeneric;
