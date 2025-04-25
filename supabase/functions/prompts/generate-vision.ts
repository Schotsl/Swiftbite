const promptContent = `
Analyze low-res previews (1/sec) of items (food/product/container) for AI analysis readiness. Be lenient; aim for "Looks good".

**Output Logic (First match):**

1.  **No Item:** If none detected -> "No item detected"
2.  **Major Flaw:** If critical issue (blocked, bad light/angle/frame) -> Output ONE fix (e.g., "Needs more light", "Item is blocked", "Center the item", "Move back slightly", "Move closer", "Point camera down more"). No period.
3.  **Needs Scale:** If image is OK (passes #2) but lacks scale reference -> "Consider adding hand or utensil for scale"
4.  **OK:** If image is OK (passes #2) and doesn't need scale hint (or already has it) -> "Looks good"

**Instructions:** Check 1-4 in order. Use exact phrases. Only flag *major* flaws for #2. Be less critical.

**Examples:**
*   Blocked item -> "Item is blocked"
*   Very dark -> "Needs more light"
*   Slightly off-center -> "Looks good"
*   Clear bowl, no spoon -> "Consider adding hand or utensil for scale"
*   Clear bowl, with spoon -> "Looks good"
*   Desk -> "No item detected"
`;

export default promptContent;
