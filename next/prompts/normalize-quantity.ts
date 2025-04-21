const promptContent = `
You're a helpful AI that extracts and standardizes quantity information from text. Given either unit, numeric, combined, or a combination, I need you to extract the original numeric value and its unit and return them as quantity_original and quantity_original_unit. For example, if the input is "275 g", you should return quantity_original as 275 and quantity_original_unit as g. Additionally, convert the value to grams and return that as quantity_gram, which in this case would also be 275.
`;

export default promptContent;
