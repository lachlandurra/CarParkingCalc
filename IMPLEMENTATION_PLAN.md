# Car Parking Calculator - New Standards Implementation Plan

## Overview

This plan details how to update the Car Parking Calculator to support both the old parking standards (2-zone system) and the new parking standards (4-category system), allowing users to compare requirements and identify the minimum.

---

## Understanding the Key Differences

### Old Standards (Current)
- **2 zones:** Rate A (Outside PPTN) and Rate B (Within PPTN)
- Complex measures with multiple rows per use (e.g., Dwelling has separate rows for 1-2 bedroom vs 3+ bedroom)
- Some uses have patron-based AND area-based rates

### New Standards (To Implement)
- **4 categories:** Based on CPR maps
  - Category 1: Minimum requirement
  - Category 2: Minimum requirement
  - Category 3: Minimum AND Maximum requirement (format: "X minimum, Y maximum")
  - Category 4: Maximum requirement only
- Simplified measures - one row per use in most cases
- Some measures changed (e.g., Child care centre: "per child" → "per employee")

---

## CSV Restructuring (New_Parking_Standards.csv)

The current `Measure` column needs standardization to work with the existing `measureConfig` pattern matching. Proposed changes:

| Current Measure | Standardized Measure |
|----------------|---------------------|
| To each 100 square metres of net floor area | To each 100 sq m of net floor area |
| To each 100 square metres of leasable floor area | To each 100 sq m of leasable floor area |
| To each 100 square metres of site area | To each 100 sq m of site area |
| Per cent of site area | Per cent of site area *(no change)* |
| To each patron | To each patron permitted |
| To each dwelling | To each dwelling |
| To each employee | To each employee |
| To each student | To each student |
| To each bedroom | To each bedroom |
| To each court | To each court |
| To each rink | To each rink |
| To each hole | To each hole |

Additionally, Category 3's "X minimum, Y maximum" format needs to be split into two columns for easier parsing.

### New CSV Column Structure
```
Land use, Measure, Category 1, Category 2, Category 3 Min, Category 3 Max, Category 4
```

---

## Implementation Tasks

### Phase 1: Data Layer Updates

- [x] **1.1 Restructure New_Parking_Standards.csv**
  - Standardize measure text to match existing `measureConfig` patterns
  - Split Category 3 into two columns: `Category 3 Min` and `Category 3 Max`
  - Handle "No maximum" values appropriately (use empty string)
  - Ensure all land use names are consistent between old and new CSVs

- [x] **1.2 Update data.js to load both CSV files**
  - Create `loadNewParkingData()` function similar to `loadCarParkingData()`
  - Export both datasets: `oldParkingData` and `newParkingData`
  - Ensure both datasets are loaded before initializing the UI

- [x] **1.3 Create unified measure configuration**
  - Add new measure patterns for new standards (e.g., "To each dwelling", "To each bedroom")
  - Ensure `measureConfig` in script.js handles both old and new measure formats

### Phase 2: UI Updates

- [x] **2.1 Update the form layout**
  - Add a section header distinguishing "Old Standards" from "New Standards"
  - Keep existing Location dropdown for old standards
  - Add new Category dropdown for new standards (Categories 1-4)
  - Display both dropdowns for each use

- [x] **2.2 Update the use selector logic**
  - Modify `addUse()` to include category selection dropdown
  - Update `generateDynamicInputs()` to:
    - Show combined input fields needed for both old and new calculations
    - Handle cases where a use exists in old but not new standards (and vice versa)

- [x] **2.3 Add informational content about new categories**
  - Add info box explaining the 4 categories
  - Note that Category 3 has both minimum AND maximum requirements
  - Explain that if land is in multiple categories, the higher category applies

### Phase 3: Calculation Logic Updates

- [x] **3.1 Create separate calculation functions**
  - `calculateOldStandards(use, location, inputs)` - existing logic refactored
  - `calculateNewStandards(use, category, inputs)` - new logic for 4-category system
  - Both return `{ spaces: number, min: number, max: number, message: string }`

- [x] **3.2 Handle Category 3 min/max logic**
  - For Category 3, return both minimum and maximum values
  - Display appropriately in results (e.g., "0 min / 2 max")

- [x] **3.3 Handle "No maximum" cases**
  - Category 4 and some Category 3 entries have "No maximum"
  - Display as "No maximum (unlimited)" message

- [x] **3.4 Update form submission handler**
  - Calculate parking for both old AND new standards
  - Compare results and identify which gives the minimum
  - Round down to nearest whole number (as per requirements)

### Phase 4: Results Display Updates

- [x] **4.1 Redesign results section**
  - Show side-by-side comparison with result cards
  - Old standards shown in amber/gold color scheme
  - New standards shown in green color scheme

- [x] **4.2 Add recommendation logic**
  - Compare old vs new totals
  - Highlight which standard gives the minimum requirement
  - Display clear recommendation message with icon

- [x] **4.3 Handle Category 3 display**
  - Show both minimum and maximum for Category 3
  - Clarify that development must be within this range

- [x] **4.4 Update total summary**
  - Show total for old standards
  - Show total for new standards (with min/max for Cat 3)
  - Show recommended minimum

### Phase 5: Edge Cases & Polish

- [x] **5.1 Handle mismatched land uses**
  - Some uses exist in old standards but not new (e.g., Motor repairs, Cinema)
  - Display appropriate warning message when a use only exists in one standard

- [x] **5.2 Add input validation**
  - Ensure required fields are filled
  - Input fields have min="0" attribute

- [x] **5.3 Update info boxes and help text**
  - Added side-by-side info boxes explaining both standards
  - Added tooltips and icons where needed

- [ ] **5.4 Test all land uses**
  - Verify calculations for each land use type
  - Check edge cases (ancillary uses, visitor parking, etc.)

---

## File Changes Summary

| File | Changes | Status |
|------|---------|--------|
| `New_Parking_Standards.csv` | Restructure columns, standardize measures | Done |
| `data.js` | Add loader for new CSV, export both datasets | Done |
| `script.js` | Add category selector, dual calculations, updated results display | Done |
| `index.html` | Add category info box, update form structure | Done |
| `styles.css` | Add styles for comparison results display | Done |
| `config.js` | Not changed (measureConfig moved to script.js) | N/A |

---

## Testing Checklist

- [ ] All old standard calculations still work correctly
- [ ] New standard calculations produce correct results for all 4 categories
- [ ] Category 3 min/max displays correctly
- [ ] "No maximum" cases handled properly
- [ ] Comparison logic correctly identifies minimum requirement
- [ ] Uses not present in one standard show appropriate message
- [ ] Form validates required inputs
- [ ] Results display is clear and readable
- [ ] Mobile/responsive layout works

---

## Notes

1. **Rounding Rule:** If calculation results in non-whole number, round DOWN to nearest whole number
2. **Category 3:** Has both minimum AND maximum - the development must provide at least the minimum but no more than the maximum
3. **Higher Category Rule:** If land is in multiple categories on CPR maps, the higher category number applies
4. **Existing Uses:** When increasing an existing use, requirement only applies to the increase (not retrofitting existing)
