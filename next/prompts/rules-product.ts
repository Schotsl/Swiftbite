const promptContent = `
# General rules for normalization and filtering of products
## Language and cultural rules
- Prioritize product information in the user's specified language
- Ensure language and cultural relevance:
  - All product names, descriptions, and categories should match the user's specified language
  - Portion sizes and descriptions should be culturally appropriate for the user's location
  - Use local terminology for food items and measurements when available
  - If a product exists in multiple languages, prioritize the version in the user's language
  - If a product has multiple valid names in the same language, use the most common or official name

## Product name and brand rules
- Normalize capitalization and fix common typos in brand names and product titles:
  - Brand names should follow their official capitalization (e.g., "coca cola" → "Coca-Cola", "pringles" → "Pringles")
  - Product names should use proper sentence case (e.g., "CLASSIC COLA" → "Classic Cola")
  - Fix common typos in brand names (e.g., "Coca Cola" → "Coca-Cola", "Pringles Chips" → "Pringles")
  - Preserve any special characters or formatting that are part of the official brand name
  - When the brand name is part of the product name, maintain the brand's official formatting
    - Example: "coca cola classic" → "Coca-Cola Classic"
    - Example: "pringles original" → "Pringles Original"
  - Handle special characters consistently:
    - Preserve hyphens in brand names (e.g., "Coca-Cola", "Ben & Jerry's")
    - Preserve apostrophes in brand names (e.g., "McDonald's", "Ben & Jerry's")
    - Remove unnecessary special characters from product names

## Quantity and unit rules
- For multipack products, extract the information for a single unit:
  - Only apply when the product is clearly marked as a multipack (e.g., "24 x", "6 pack", "Family pack")
  - Example: "24 x 220 ml Coca Cola" should be normalized to "220 ml Coca Cola"
  - Example: "6 x 330 g Pringles" should be normalized to "330 g Pringles"
  - Only normalize the quantity and unit, preserve the brand and product name
  - If the multipack information is unclear or ambiguous, keep the original format
- Normalize quantities and units to their shorthand forms:
  - Use standard unit abbreviations (e.g., "gram" → "g", "liter" → "l", "milliliter" → "ml")
  - Convert large numbers to more readable units:
    - "1000 ml" → "1 l"
    - "1000 g" → "1 kg"
    - "1000 mg" → "1 g"
  - Keep decimal numbers as is (e.g., "1.5 l", "0.5 kg")
  - Use a space between the number and unit (e.g., "330 g" not "330g")
  - Handle fractions consistently (e.g., "1/2 l" → "0.5 l")

## Quality and relevance rules
- Filter out products that are not relevant to the user's location or measurement system
- Filter out spam and irrelevant products:
  - Ignore products with suspicious or spam-like names (e.g., "BUY NOW!!!", "BEST DEAL EVER")
  - If a search query is provided, filter out products that don't match the query's intent
  - Exclude products with extremely generic names that lack specific details
  - Remove duplicate entries with slightly different formatting
  - If multiple sources provide conflicting information, prioritize the most reliable source
  - When in doubt about a product's relevance, err on the side of caution and exclude it
  - Ignore non-food related content from internet sources
  - Exclude products with placeholder or temporary names (e.g., "Product 1", "Item A")
`;

export default promptContent;
