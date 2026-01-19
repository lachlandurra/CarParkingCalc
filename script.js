// script.js

// Access the DOM elements
const usesContainer = document.getElementById("uses-container");
const addUseButton = document.getElementById("add-use-button");
const parkingForm = document.getElementById("parking-form");
const resultDiv = document.getElementById("result");

// Wait for both datasets to be loaded before initializing
dataPromise.then(() => {
  initializeUseSelectors();
}).catch(err => {
  console.log("Error: ", err);
  alert("Failed to load car parking data. Please try again.");
});

// Configuration object mapping measures to input fields and calculation logic
const measureConfig = [
  {
    pattern: /per cent of site area/i,
    inputs: [{ id: "site_area", label: "Site Area (sq m)" }],
    calculation: (rate, inputs) => (rate / 100) * inputs.site_area,
  },
  {
    pattern: /to each 100 sq m of leasable floor area/i,
    inputs: [{ id: "leasable_floor_area", label: "Leasable Floor Area (sq m)" }],
    calculation: (rate, inputs) => (rate * inputs.leasable_floor_area) / 100,
  },
  {
    pattern: /to each 100 sq m of net floor area/i,
    inputs: [{ id: "net_floor_area", label: "Net Floor Area (sq m)" }],
    calculation: (rate, inputs) => (rate * inputs.net_floor_area) / 100,
  },
  {
    pattern: /to each 100 sq m of floor area/i,
    inputs: [{ id: "floor_area", label: "Floor Area (sq m)" }],
    calculation: (rate, inputs) => (rate * inputs.floor_area) / 100,
  },
  {
    pattern: /to each 100 sq m of (the )?site( area)?/i,
    inputs: [{ id: "site_area_100", label: "Site Area (sq m)" }],
    calculation: (rate, inputs) => (rate * inputs.site_area_100) / 100,
  },
  {
    pattern: /to each patron permitted/i,
    inputs: [{ id: "number_of_patrons", label: "Number of Patrons Permitted" }],
    calculation: (rate, inputs) => rate * inputs.number_of_patrons,
  },
  {
    pattern: /to each child/i,
    inputs: [{ id: "number_of_children", label: "Number of Children" }],
    calculation: (rate, inputs) => rate * inputs.number_of_children,
  },
  {
    pattern: /to each employee that/i,
    inputs: [{ id: "number_of_employees", label: "Number of Employees" }],
    calculation: (rate, inputs) => rate * inputs.number_of_employees,
  },
  {
    pattern: /to each employee not/i,
    inputs: [{ id: "number_of_non_resident_employees", label: "Employees not a resident of the dwelling" }],
    calculation: (rate, inputs) => rate * inputs.number_of_non_resident_employees,
  },
  {
    pattern: /to each employee$/i,
    inputs: [{ id: "number_of_employees", label: "Number of Employees" }],
    calculation: (rate, inputs) => rate * inputs.number_of_employees,
  },
  {
    pattern: /to each court/i,
    inputs: [{ id: "number_of_courts", label: "Number of Courts" }],
    calculation: (rate, inputs) => rate * inputs.number_of_courts,
  },
  {
    pattern: /to each rink/i,
    inputs: [{ id: "number_of_rinks", label: "Number of Rinks" }],
    calculation: (rate, inputs) => rate * inputs.number_of_rinks,
  },
  {
    pattern: /to each hole/i,
    inputs: [{ id: "number_of_holes", label: "Number of Holes" }],
    calculation: (rate, inputs) => rate * inputs.number_of_holes,
  },
  {
    pattern: /ancillary use/i,
    inputs: [{ id: "ancillary_use_requirement", label: "Ancillary Use Requirement" }],
    calculation: (rate, inputs) => 0.5 * inputs.ancillary_use_requirement,
  },
  {
    pattern: /to each unit/i,
    inputs: [
      { id: "number_of_units", label: "Number of Units" },
      { id: "number_of_manager_dwellings", label: "Number of Manager Dwellings" }
    ],
    calculation: (rate, inputs) => rate * (inputs.number_of_units + inputs.number_of_manager_dwellings),
  },
  {
    pattern: /one or two bedroom dwelling/i,
    inputs: [{ id: "one_two_bedroom_dwellings", label: "Number of One or Two Bedroom Dwellings" }],
    calculation: (rate, inputs) => rate * inputs.one_two_bedroom_dwellings,
  },
  {
    pattern: /three or more bedroom dwelling/i,
    inputs: [{ id: "three_more_bedroom_dwellings", label: "Number of Three or More Bedroom Dwellings" }],
    calculation: (rate, inputs) => rate * inputs.three_more_bedroom_dwellings,
  },
  {
    pattern: /to each dwelling for five or fewer contiguous dwellings/i,
    inputs: [{ id: "number_of_dwellings_display", label: "Number of Dwellings" }],
    calculation: (rate, inputs) => {
      const totalDwellings = inputs.number_of_dwellings_display;
      const firstFiveRate = 5;
      const additionalRate = 2;
      if (totalDwellings <= 5) {
        return firstFiveRate * totalDwellings;
      } else {
        return (firstFiveRate * 5) + (additionalRate * (totalDwellings - 5));
      }
    },
  },
  {
    pattern: /visitors to every/i,
    inputs: [{ id: "number_of_dwellings_visitor", label: "Total Number of Dwellings (for visitor parking)" }],
    calculation: (rate, inputs) => {
      if (inputs.number_of_dwellings_visitor >= 5) {
        return Math.floor(inputs.number_of_dwellings_visitor / 5) * rate;
      }
      return 0;
    },
  },
  {
    pattern: /to each dwelling$/i,
    inputs: [{ id: "number_of_dwellings", label: "Number of Dwellings" }],
    calculation: (rate, inputs) => rate * inputs.number_of_dwellings,
  },
  {
    pattern: /to each student/i,
    inputs: [{ id: "number_of_students", label: "Number of Students" }],
    calculation: (rate, inputs) => rate * inputs.number_of_students,
  },
  {
    pattern: /to each lodging room/i,
    inputs: [{ id: "number_of_lodging_rooms", label: "Number of Lodging Rooms" }],
    calculation: (rate, inputs) => rate * inputs.number_of_lodging_rooms,
  },
  {
    pattern: /to each bedroom$/i,
    inputs: [{ id: "number_of_bedrooms", label: "Number of Bedrooms" }],
    calculation: (rate, inputs) => rate * inputs.number_of_bedrooms,
  },
  {
    pattern: /to each four bedrooms/i,
    inputs: [{ id: "number_of_bedrooms_rooming", label: "Number of Bedrooms" }],
    calculation: (rate, inputs) => Math.floor(inputs.number_of_bedrooms_rooming / 4) * rate,
  },
  {
    pattern: /to each premises/i,
    inputs: [{ id: "number_of_premises", label: "Number of Premises" }],
    calculation: (rate, inputs) => rate * inputs.number_of_premises,
  },
  {
    pattern: /first person providing/i,
    inputs: [{ id: "first_persons", label: "First person providing health services? (1 = yes, 0 = no)" }],
    calculation: (rate, inputs) => rate * inputs.first_persons,
  },
  {
    pattern: /every other person providing/i,
    inputs: [{ id: "other_persons", label: "Other Persons Providing Health Services" }],
    calculation: (rate, inputs) => rate * inputs.other_persons,
  },
  {
    pattern: /vehicle being serviced/i,
    inputs: [{ id: "vehicles_being_serviced", label: "Number of Vehicles Being Serviced" }],
    calculation: (rate, inputs) => rate * inputs.vehicles_being_serviced,
  }
];

// Initialize the first use selector
function initializeUseSelectors() {
  addUse();
}

// Get all unique uses from both datasets, combining them
function getAllUniqueUses() {
  const oldUses = oldParkingData.map(item => item.use);
  const newUses = newParkingData.map(item => item.use);
  const allUses = [...new Set([...oldUses, ...newUses])].sort();
  return allUses;
}

// Function to add a new use section
function addUse() {
  const useIndex = usesContainer.childElementCount;

  // Create a container for the use
  const useDiv = document.createElement("div");
  useDiv.classList.add("use-section");
  useDiv.dataset.index = useIndex;

  // Create 'Use' select
  const useLabel = document.createElement("label");
  useLabel.textContent = "Use:";
  useLabel.htmlFor = `use-select-${useIndex}`;

  const useSelect = document.createElement("select");
  useSelect.id = `use-select-${useIndex}`;
  useSelect.name = `use-select-${useIndex}`;
  useSelect.required = true;

  // Populate 'Use' select options
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "-- Select Use --";
  useSelect.appendChild(defaultOption);

  const uniqueUses = getAllUniqueUses();
  uniqueUses.forEach(use => {
    const option = document.createElement("option");
    option.value = use;
    option.textContent = use;
    useSelect.appendChild(option);
  });

  // Create standards selection container
  const standardsDiv = document.createElement("div");
  standardsDiv.classList.add("standards-selectors");

  // OLD STANDARDS: Location select
  const oldStandardsDiv = document.createElement("div");
  oldStandardsDiv.classList.add("standard-selector-group");

  const locationLabel = document.createElement("label");
  locationLabel.textContent = "Old Standards - Location:";
  locationLabel.htmlFor = `location-select-${useIndex}`;

  const locationSelect = document.createElement("select");
  locationSelect.id = `location-select-${useIndex}`;
  locationSelect.name = `location-select-${useIndex}`;
  locationSelect.required = true;

  const locationOptionOutside = document.createElement("option");
  locationOptionOutside.value = "Outside PPTN";
  locationOptionOutside.textContent = "Outside PPT Network Area";

  const locationOptionWithin = document.createElement("option");
  locationOptionWithin.value = "Within PPTN";
  locationOptionWithin.textContent = "Within PPT Network Area";

  locationSelect.appendChild(locationOptionOutside);
  locationSelect.appendChild(locationOptionWithin);

  oldStandardsDiv.appendChild(locationLabel);
  oldStandardsDiv.appendChild(locationSelect);

  // NEW STANDARDS: Category select
  const newStandardsDiv = document.createElement("div");
  newStandardsDiv.classList.add("standard-selector-group");

  const categoryLabel = document.createElement("label");
  categoryLabel.textContent = "New Standards - Category:";
  categoryLabel.htmlFor = `category-select-${useIndex}`;

  const categorySelect = document.createElement("select");
  categorySelect.id = `category-select-${useIndex}`;
  categorySelect.name = `category-select-${useIndex}`;
  categorySelect.required = true;

  const categories = [
    { value: "1", text: "Category 1" },
    { value: "2", text: "Category 2" },
    { value: "3", text: "Category 3 (Min & Max)" },
    { value: "4", text: "Category 4 (Max only)" }
  ];

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.value;
    option.textContent = cat.text;
    categorySelect.appendChild(option);
  });

  newStandardsDiv.appendChild(categoryLabel);
  newStandardsDiv.appendChild(categorySelect);

  standardsDiv.appendChild(oldStandardsDiv);
  standardsDiv.appendChild(newStandardsDiv);

  // Container for dynamic inputs
  const dynamicInputs = document.createElement("div");
  dynamicInputs.classList.add("dynamic-inputs");
  dynamicInputs.id = `dynamic-inputs-${useIndex}`;

  // Create 'Remove Use' button with bin icon
  const removeUseButton = document.createElement("button");
  removeUseButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
  removeUseButton.type = "button";
  removeUseButton.classList.add("remove-use-button");

  removeUseButton.addEventListener("click", () => {
    usesContainer.removeChild(useDiv);
  });

  // Append elements to useDiv
  useDiv.appendChild(useLabel);
  useDiv.appendChild(useSelect);
  useDiv.appendChild(standardsDiv);
  useDiv.appendChild(dynamicInputs);
  useDiv.appendChild(removeUseButton);

  // Add useDiv to usesContainer
  usesContainer.appendChild(useDiv);

  // Add event listeners
  useSelect.addEventListener("change", () => generateDynamicInputs(useIndex));
  locationSelect.addEventListener("change", () => generateDynamicInputs(useIndex));
  categorySelect.addEventListener("change", () => generateDynamicInputs(useIndex));
}

// Function to generate dynamic inputs based on Use selection
// Combines inputs needed for both old and new standards
function generateDynamicInputs(useIndex) {
  const useDiv = usesContainer.querySelector(`div[data-index='${useIndex}']`);
  const useSelect = useDiv.querySelector(`#use-select-${useIndex}`);
  const locationSelect = useDiv.querySelector(`#location-select-${useIndex}`);
  const dynamicInputs = useDiv.querySelector(`#dynamic-inputs-${useIndex}`);

  dynamicInputs.innerHTML = "";

  const selectedUse = useSelect.value;
  const selectedLocation = locationSelect.value;

  if (!selectedUse) return;

  // Track created inputs to avoid duplicates
  const createdInputs = new Set();

  // Get OLD standards entries for this use
  const rateColumn = selectedLocation === "Within PPTN" ? "rateB" : "rateA";
  const oldEntries = oldParkingData.filter(item =>
    item.use === selectedUse &&
    ((rateColumn === "rateA" && item.rateA > 0) || (rateColumn === "rateB" && item.rateB > 0))
  );

  // Get NEW standards entry for this use
  const newEntry = newParkingData.find(item => item.use === selectedUse);

  // Process OLD standards measures
  oldEntries.forEach((entry) => {
    const measure = entry.measure.toLowerCase();
    const measureComponents = measure.split(/ plus | and /);

    measureComponents.forEach((component) => {
      component = component.trim();
      for (const config of measureConfig) {
        if (config.pattern.test(component)) {
          config.inputs.forEach(inputConfig => {
            const inputId = `${inputConfig.id}_${useIndex}`;
            if (!createdInputs.has(inputId)) {
              createInputField("number", inputId, inputConfig.label, dynamicInputs, true);
              createdInputs.add(inputId);
            }
          });
          break;
        }
      }
    });
  });

  // Process NEW standards measure
  if (newEntry) {
    const measure = newEntry.measure.toLowerCase();
    for (const config of measureConfig) {
      if (config.pattern.test(measure)) {
        config.inputs.forEach(inputConfig => {
          const inputId = `${inputConfig.id}_${useIndex}`;
          if (!createdInputs.has(inputId)) {
            createInputField("number", inputId, inputConfig.label, dynamicInputs, true);
            createdInputs.add(inputId);
          }
        });
        break;
      }
    }
  }

  // Show warnings if use only exists in one standard
  const existsInOld = oldEntries.length > 0;
  const existsInNew = !!newEntry;

  if (existsInOld && !existsInNew) {
    const warning = document.createElement("p");
    warning.classList.add("standard-warning");
    warning.innerHTML = '<i class="fas fa-exclamation-triangle"></i> This use is not listed in the new parking standards.';
    dynamicInputs.appendChild(warning);
  } else if (!existsInOld && existsInNew) {
    const warning = document.createElement("p");
    warning.classList.add("standard-warning");
    warning.innerHTML = '<i class="fas fa-exclamation-triangle"></i> This use is not listed in the old parking standards.';
    dynamicInputs.appendChild(warning);
  }
}

// Function to create input fields
function createInputField(type, id, labelText, container, required) {
  if (document.getElementById(id)) return;

  const inputGroup = document.createElement("div");
  inputGroup.classList.add("input-group");

  const label = document.createElement("label");
  label.htmlFor = id;
  label.textContent = labelText;

  const input = document.createElement("input");
  input.type = type;
  input.id = id;
  input.name = id;
  input.required = required;
  input.min = "0";

  inputGroup.appendChild(label);
  inputGroup.appendChild(input);
  container.appendChild(inputGroup);
}

// Helper function to parse numbers safely
function parseNumber(value) {
  const number = parseFloat(value);
  return isNaN(number) ? 0 : number;
}

// Calculate parking for OLD standards
function calculateOldStandards(selectedUse, selectedLocation, inputValues) {
  const rateColumn = selectedLocation === "Within PPTN" ? "rateB" : "rateA";
  const entries = oldParkingData.filter(item =>
    item.use === selectedUse &&
    ((rateColumn === "rateA" && item.rateA > 0) || (rateColumn === "rateB" && item.rateB > 0))
  );

  if (entries.length === 0) {
    return { spaces: null, message: "Not in old standards" };
  }

  let totalSpaces = 0;

  entries.forEach((entry) => {
    let rate = rateColumn === "rateA" ? entry.rateA : entry.rateB;
    if (rate === 0) return;

    const measure = entry.measure.toLowerCase();
    const measureComponents = measure.split(/ plus | and /);

    measureComponents.forEach((component) => {
      component = component.trim();
      for (const config of measureConfig) {
        if (config.pattern.test(component)) {
          if (!component.includes("ancillary use")) {
            totalSpaces += config.calculation(rate, inputValues);
          }
          break;
        }
      }
    });
  });

  return { spaces: Math.floor(totalSpaces), message: null };
}

// Calculate parking for NEW standards
function calculateNewStandards(selectedUse, selectedCategory, inputValues) {
  const entry = newParkingData.find(item => item.use === selectedUse);

  if (!entry) {
    return { spaces: null, min: null, max: null, message: "Not in new standards" };
  }

  let rate;
  let isMinMax = false;
  let minRate = null;
  let maxRate = null;

  switch (selectedCategory) {
    case "1":
      rate = entry.category1;
      break;
    case "2":
      rate = entry.category2;
      break;
    case "3":
      isMinMax = true;
      minRate = entry.category3Min;
      maxRate = entry.category3Max;
      break;
    case "4":
      rate = entry.category4;
      if (rate === null) {
        return { spaces: null, min: null, max: null, message: "No maximum (unlimited)" };
      }
      break;
  }

  const measure = entry.measure.toLowerCase();
  let calculation = null;

  for (const config of measureConfig) {
    if (config.pattern.test(measure)) {
      calculation = config.calculation;
      break;
    }
  }

  if (!calculation) {
    return { spaces: null, min: null, max: null, message: "Unknown measure" };
  }

  if (isMinMax) {
    const minSpaces = minRate !== null ? Math.floor(calculation(minRate, inputValues)) : null;
    const maxSpaces = maxRate !== null ? Math.floor(calculation(maxRate, inputValues)) : null;
    return {
      spaces: null,
      min: minSpaces,
      max: maxSpaces,
      message: null
    };
  } else {
    return {
      spaces: Math.floor(calculation(rate, inputValues)),
      min: null,
      max: null,
      message: null
    };
  }
}

// Event listener for form submission
parkingForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const useSections = usesContainer.querySelectorAll(".use-section");

  if (useSections.length === 0) {
    alert("Please add at least one use.");
    return;
  }

  const results = [];
  let totalOldSpaces = 0;
  let totalNewSpaces = 0;
  let totalNewMin = 0;
  let totalNewMax = 0;
  let hasOldInvalid = false;
  let hasNewInvalid = false;
  let hasCategory3 = false;
  let hasNoMaximum = false;

  useSections.forEach(useDiv => {
    const useIndex = useDiv.dataset.index;
    const useSelect = useDiv.querySelector(`#use-select-${useIndex}`);
    const locationSelect = useDiv.querySelector(`#location-select-${useIndex}`);
    const categorySelect = useDiv.querySelector(`#category-select-${useIndex}`);
    const dynamicInputs = useDiv.querySelector(`#dynamic-inputs-${useIndex}`);

    const selectedUse = useSelect.value;
    const selectedLocation = locationSelect.value;
    const selectedCategory = categorySelect.value;

    if (!selectedUse) {
      alert("Please select a use for each section.");
      return;
    }

    // Collect input values
    const inputValues = {};
    const inputElements = dynamicInputs.querySelectorAll("input");
    inputElements.forEach(input => {
      const baseId = input.id.replace(`_${useIndex}`, '');
      inputValues[baseId] = parseNumber(input.value);
    });

    // Calculate for both standards
    const oldResult = calculateOldStandards(selectedUse, selectedLocation, inputValues);
    const newResult = calculateNewStandards(selectedUse, selectedCategory, inputValues);

    if (oldResult.spaces !== null) {
      totalOldSpaces += oldResult.spaces;
    } else {
      hasOldInvalid = true;
    }

    if (selectedCategory === "3") {
      hasCategory3 = true;
      if (newResult.min !== null) totalNewMin += newResult.min;
      if (newResult.max !== null) {
        totalNewMax += newResult.max;
      } else {
        hasNoMaximum = true;
      }
    } else if (selectedCategory === "4" && newResult.message === "No maximum (unlimited)") {
      // Category 4 with no maximum - just track the minimum (which is 0)
      hasNoMaximum = true;
    } else {
      if (newResult.spaces !== null) {
        totalNewSpaces += newResult.spaces;
        totalNewMin += newResult.spaces;
        totalNewMax += newResult.spaces;
      } else if (newResult.message !== "Not in new standards") {
        // Only mark invalid if it's truly an error, not just missing from standards
        hasNewInvalid = true;
      }
    }

    results.push({
      use: selectedUse,
      location: selectedLocation,
      category: selectedCategory,
      old: oldResult,
      new: newResult
    });
  });

  // Display results
  displayResults(results, totalOldSpaces, totalNewSpaces, totalNewMin, totalNewMax, hasOldInvalid, hasNewInvalid, hasCategory3, hasNoMaximum);
});

// Function to display results
function displayResults(results, totalOldSpaces, totalNewSpaces, totalNewMin, totalNewMax, hasOldInvalid, hasNewInvalid, hasCategory3, hasNoMaximum) {
  resultDiv.innerHTML = "<h3>Parking Requirements Comparison</h3>";

  const resultList = document.createElement("div");
  resultList.classList.add("result-list");

  results.forEach(result => {
    const card = document.createElement("div");
    card.classList.add("result-card");

    // Header
    const header = document.createElement("div");
    header.classList.add("result-card-header");
    header.innerHTML = `<i class="fa-regular fa-building"></i> <strong>${result.use}</strong>`;
    card.appendChild(header);

    // Comparison row
    const comparison = document.createElement("div");
    comparison.classList.add("result-comparison");

    // Old standards column
    const oldCol = document.createElement("div");
    oldCol.classList.add("result-col", "result-col-old");
    oldCol.innerHTML = `
      <div class="result-col-header">Old Standards</div>
      <div class="result-col-subheader">${result.location}</div>
      <div class="result-col-value">${result.old.spaces !== null ? result.old.spaces + ' spaces' : result.old.message}</div>
    `;

    // New standards column
    const newCol = document.createElement("div");
    newCol.classList.add("result-col", "result-col-new");

    let newValueHtml;
    if (result.category === "3") {
      const minVal = result.new.min !== null ? result.new.min : 0;
      if (result.new.max !== null) {
        newValueHtml = `<span class="min-max">${minVal} min / ${result.new.max} max</span>`;
      } else {
        // No maximum - just show minimum
        newValueHtml = `${minVal} spaces min (no max)`;
      }
    } else if (result.category === "4" && result.new.message === "No maximum (unlimited)") {
      newValueHtml = 'No maximum';
    } else if (result.new.spaces !== null) {
      newValueHtml = result.new.spaces + ' spaces';
    } else {
      newValueHtml = result.new.message;
    }

    newCol.innerHTML = `
      <div class="result-col-header">New Standards</div>
      <div class="result-col-subheader">Category ${result.category}</div>
      <div class="result-col-value">${newValueHtml}</div>
    `;

    comparison.appendChild(oldCol);
    comparison.appendChild(newCol);
    card.appendChild(comparison);

    resultList.appendChild(card);
  });

  resultDiv.appendChild(resultList);

  // Total summary
  const summary = document.createElement("div");
  summary.classList.add("result-summary");

  let summaryHtml = `
    <div class="summary-row">
      <div class="summary-col summary-col-old">
        <div class="summary-label">Total (Old Standards)</div>
        <div class="summary-value">${hasOldInvalid ? 'Incomplete' : totalOldSpaces + ' spaces'}</div>
      </div>
      <div class="summary-col summary-col-new">
        <div class="summary-label">Total (New Standards)</div>
        <div class="summary-value">`;

  if (hasNewInvalid) {
    summaryHtml += 'Incomplete';
  } else if (hasNoMaximum) {
    // Has at least one use with no maximum
    summaryHtml += `${totalNewMin} spaces min (no max)`;
  } else if (hasCategory3) {
    summaryHtml += `${totalNewMin} min / ${totalNewMax} max`;
  } else {
    summaryHtml += totalNewSpaces + ' spaces';
  }

  summaryHtml += `</div>
      </div>
    </div>`;

  summary.innerHTML = summaryHtml;

  // Recommendation
  if (!hasOldInvalid && !hasNewInvalid) {
    const recommendation = document.createElement("div");
    recommendation.classList.add("recommendation");

    let recommendationText;
    let recommendationClass;

    const newMinForComparison = (hasCategory3 || hasNoMaximum) ? totalNewMin : totalNewSpaces;

    if (newMinForComparison < totalOldSpaces) {
      recommendationText = `<i class="fas fa-check-circle"></i> <strong>Recommendation:</strong> Use <strong>New Standards</strong> (${newMinForComparison} spaces minimum vs ${totalOldSpaces} spaces)`;
      recommendationClass = "recommendation-new";
    } else if (newMinForComparison > totalOldSpaces) {
      recommendationText = `<i class="fas fa-check-circle"></i> <strong>Recommendation:</strong> Use <strong>Old Standards</strong> (${totalOldSpaces} spaces vs ${newMinForComparison} spaces minimum)`;
      recommendationClass = "recommendation-old";
    } else {
      recommendationText = `<i class="fas fa-equals"></i> <strong>Equal requirement:</strong> Both standards require ${totalOldSpaces} spaces`;
      recommendationClass = "recommendation-equal";
    }

    recommendation.classList.add(recommendationClass);
    recommendation.innerHTML = recommendationText;
    summary.appendChild(recommendation);

    if (hasCategory3 && !hasNoMaximum) {
      const maxNote = document.createElement("p");
      maxNote.classList.add("max-note");
      maxNote.innerHTML = `<i class="fas fa-info-circle"></i> Category 3 has a maximum limit of ${totalNewMax} spaces. You cannot exceed this.`;
      summary.appendChild(maxNote);
    }
  }

  resultDiv.appendChild(summary);
}

// Event listener for 'Add Use' button
addUseButton.addEventListener("click", (e) => {
  e.preventDefault();
  addUse();
});
