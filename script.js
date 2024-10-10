// script.js

// Access the DOM elements
const usesContainer = document.getElementById("uses-container");
const addUseButton = document.getElementById("add-use-button");
const parkingForm = document.getElementById("parking-form");
const resultDiv = document.getElementById("result");

// Wait for the data to be loaded before initializing
dataPromise.then(() => {
  initializeUseSelectors();
}).catch(err => {
  console.log("Error: ", err);
  alert("Failed to load car parking data. Please try again.");
});

// Configuration object mapping measures to input fields and calculation logic
const measureConfig = [
  // Measure Keyword: Configuration
  {
    pattern: /per cent of site area/,
    inputs: [{ id: "site_area", label: "Site Area (sq m)" }],
    calculation: (rate, inputs) => (rate / 100) * inputs.site_area,
  },
  {
    pattern: /to each 100 sq m of leasable floor area/,
    inputs: [{ id: "leasable_floor_area", label: "Leasable Floor Area (sq m)" }],
    calculation: (rate, inputs) => (rate * inputs.leasable_floor_area) / 100,
  },
  {
    pattern: /to each 100 sq m of net floor area/,
    inputs: [{ id: "net_floor_area", label: "Net Floor Area (sq m)" }],
    calculation: (rate, inputs) => (rate * inputs.net_floor_area) / 100,
  },
  {
    pattern: /to each 100 sq m of floor area/,
    inputs: [{ id: "floor_area", label: "Floor Area (sq m)" }],
    calculation: (rate, inputs) => (rate * inputs.floor_area) / 100,
  },
  {
    pattern: /to each 100 sq m of (the )?site( area)?/,
    inputs: [{ id: "site_area_2", label: "Site Area (sq m)" }],
    calculation: (rate, inputs) => (rate * inputs.site_area_2) / 100,
  },
  {
    pattern: /to each patron permitted/,
    inputs: [{ id: "number_of_patrons", label: "Number of Patrons Permitted" }],
    calculation: (rate, inputs) => rate * inputs.number_of_patrons,
  },
  {
    pattern: /to each child/,
    inputs: [{ id: "number_of_children", label: "Number of Children" }],
    calculation: (rate, inputs) => rate * inputs.number_of_children,
  },
  {
    pattern: /to each employee that/,
    inputs: [{ id: "number_of_employees", label: "Number of Employees" }],
    calculation: (rate, inputs) => rate * inputs.number_of_employees,
  },
  {
    pattern: /to each employee not/,
    inputs: [{ id: "number_of_employees", label: "Number of Employees not a resident of the dwelling" }],
    calculation: (rate, inputs) => rate * inputs.number_of_employees,
  },
  {
    pattern: /to each court/,
    inputs: [{ id: "number_of_courts", label: "Number of Courts" }],
    calculation: (rate, inputs) => rate * inputs.number_of_courts,
  },
  {
    pattern: /to each rink/,
    inputs: [{ id: "number_of_rinks", label: "Number of Rinks" }],
    calculation: (rate, inputs) => rate * inputs.number_of_rinks,
  },
  {
    pattern: /to each hole/,
    inputs: [{ id: "number_of_holes", label: "Number of Holes" }],
    calculation: (rate, inputs) => rate * inputs.number_of_holes,
  },
  {
    pattern: /ancillary use/,
    inputs: [{ id: "ancillary_use_requirement", label: "Ancillary Use Requirement" }],
    calculation: (rate, inputs) => 0.5 * inputs.ancillary_use_requirement,
  },
  {
    pattern: /to each unit/,
    inputs: [
      { id: "number_of_units", label: "Number of Units" },
      { id: "number_of_manager_dwellings", label: "Number of Manager Dwellings" }
    ],
    calculation: (rate, inputs) => rate * (inputs.number_of_units + inputs.number_of_manager_dwellings),
  },
  {
    pattern: /one or two bedroom dwelling/,
    inputs: [{ id: "one_two_bedroom_dwellings", label: "Number of One or Two Bedroom Dwellings" }],
    calculation: (rate, inputs) => rate * inputs.one_two_bedroom_dwellings,
  },
  {
    pattern: /three or more bedroom dwelling/,
    inputs: [{ id: "three_more_bedroom_dwellings", label: "Number of Three or More Bedroom Dwellings" }],
    calculation: (rate, inputs) => rate * inputs.three_more_bedroom_dwellings,
  },
  {
    pattern: /to each dwelling for five or fewer contiguous dwellings/,
    inputs: [{ id: "number_of_dwellings", label: "Number of Dwellings" }],
    calculation: (rate, inputs) => {
      const totalDwellings = inputs.number_of_dwellings;
      const firstFiveRate = 5; // Rate for the first 5 dwellings
      const additionalRate = 2; // Rate for additional dwellings

      let parkingSpaces = 0;

      if (totalDwellings <= 5) {
        parkingSpaces = firstFiveRate * totalDwellings;
      } else {
        parkingSpaces = (firstFiveRate * 5) + (additionalRate * (totalDwellings - 5));
      }

      return parkingSpaces;
    },
  },
  {
    pattern: /visitors to every/,
    inputs: [{ id: "number_of_dwellings", label: "Total Number of Dwellings" }],
    calculation: (rate, inputs) => {
      if (inputs.number_of_dwellings >= 5) {
        return Math.floor(inputs.number_of_dwellings / 5) * rate;
      }
      return 0;
    },
  },
  {
    pattern: /to each student/,
    inputs: [{ id: "number_of_students", label: "Number of Students" }],
    calculation: (rate, inputs) => rate * inputs.number_of_students,
  },
  {
    pattern: /to each lodging room/,
    inputs: [{ id: "number_of_lodging_rooms", label: "Number of Lodging Rooms" }],
    calculation: (rate, inputs) => rate * inputs.number_of_lodging_rooms,
  },
  {
    pattern: /bedroom/,
    inputs: [{ id: "number_of_bedrooms", label: "Number of Bedrooms" }],
    calculation: (rate, inputs) => rate * inputs.number_of_bedrooms / 4, // Adjust as needed
  },
  {
    pattern: /premises/,
    inputs: [{ id: "number_of_premises", label: "Number of Premises" }],
    calculation: (rate, inputs) => rate * inputs.number_of_premises,
  },
  {
    pattern: /first person providing/,
    inputs: [{ id: "first_persons", label: "Is there a first person providing health services? (Enter 1 if yes, 0 if no)" }],
    calculation: (rate, inputs) => rate * inputs.first_persons,
  },
  {
    pattern: /every other person providing/,
    inputs: [{ id: "other_persons", label: "Number of Other Persons Providing Health Services" }],
    calculation: (rate, inputs) => rate * inputs.other_persons,
  },
  {
    pattern: /vehicle being serviced/,
    inputs: [{ id: "vehicles_being_serviced", label: "Number of Vehicles Being Serviced" }],
    calculation: (rate, inputs) => rate * inputs.vehicles_being_serviced,
  }
  // Add other measures as needed
];

// Initialize the first use selector
function initializeUseSelectors() {
  addUse();
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

  const uniqueUses = [...new Set(carParkingData.map(item => item.use))].sort();
  uniqueUses.forEach(use => {
    const option = document.createElement("option");
    option.value = use;
    option.textContent = use;
    useSelect.appendChild(option);
  });

  // Create 'Location' select (replacing 'Column')
  const locationLabel = document.createElement("label");
  locationLabel.textContent = "Location:";
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

  // Container for dynamic inputs
  const dynamicInputs = document.createElement("div");
  dynamicInputs.classList.add("dynamic-inputs");
  dynamicInputs.id = `dynamic-inputs-${useIndex}`;

  // Create 'Remove Use' button with bin icon
  const removeUseButton = document.createElement("button");
  removeUseButton.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Bin icon
  removeUseButton.type = "button";
  removeUseButton.classList.add("remove-use-button");

  removeUseButton.addEventListener("click", () => {
    usesContainer.removeChild(useDiv);
  });


  // Append elements to useDiv
  useDiv.appendChild(useLabel);
  useDiv.appendChild(useSelect);
  useDiv.appendChild(locationLabel);
  useDiv.appendChild(locationSelect);
  useDiv.appendChild(dynamicInputs);
  useDiv.appendChild(removeUseButton); // Add the remove button

  // Add useDiv to usesContainer
  usesContainer.appendChild(useDiv);

  // Add event listeners
  useSelect.addEventListener("change", () => generateDynamicInputs(useIndex));
  locationSelect.addEventListener("change", () => generateDynamicInputs(useIndex));
}


// Function to generate dynamic inputs based on Use and Location
function generateDynamicInputs(useIndex) {
  const useDiv = usesContainer.querySelector(`div[data-index='${useIndex}']`);
  const useSelect = useDiv.querySelector(`#use-select-${useIndex}`);
  const locationSelect = useDiv.querySelector(`#location-select-${useIndex}`);
  const dynamicInputs = useDiv.querySelector(`#dynamic-inputs-${useIndex}`);

  dynamicInputs.innerHTML = "";

  const selectedUse = useSelect.value;
  const selectedLocation = locationSelect.value;

  if (selectedUse && selectedLocation) {
    // Determine which rate to use based on location
    // Assuming 'Within PPTN' uses rateB and 'Outside PPTN' uses rateA
    const rateColumn = selectedLocation === "Within PPTN" ? "rateB" : "rateA";

    // Get all entries for the selected use and location
    const entries = carParkingData.filter(item =>
      item.use === selectedUse &&
      ((rateColumn === "rateA" && item.rateA > 0) || (rateColumn === "rateB" && item.rateB > 0))
    );

    // To avoid duplicate inputs, keep track of created input IDs
    const createdInputs = new Set();

    entries.forEach((entry) => {
      const measure = entry.measure.toLowerCase();

      // Split the measure string into components
      const measureComponents = measure.split(/ plus | and /);

      // For each component, find matching measureConfig entry
      measureComponents.forEach((component) => {
        component = component.trim();
        for (const config of measureConfig) {
          if (config.pattern.test(component)) {
            config.inputs.forEach(inputConfig => {
              // Modify input IDs to be unique per use
              const inputId = `${inputConfig.id}_${useIndex}`;
              if (!createdInputs.has(inputId)) {
                createInputField(
                  "number",
                  inputId,
                  inputConfig.label,
                  dynamicInputs,
                  true
                );
                createdInputs.add(inputId);
              }
            });
            break; // Stop after finding the first matching measure
          }
        }
      });
    });
  }
}

// Function to create input fields
function createInputField(type, id, labelText, container, required) {
  // Avoid creating duplicate inputs
  if (document.getElementById(id)) return;

  const label = document.createElement("label");
  label.htmlFor = id;
  label.textContent = labelText;

  const input = document.createElement("input");
  input.type = type;
  input.id = id;
  input.name = id;
  input.required = required;

  container.appendChild(label);
  container.appendChild(input);
}

// Helper function to parse numbers safely
function parseNumber(value) {
  const number = parseFloat(value);
  return isNaN(number) ? 0 : number;
}

// Event listener for form submission
parkingForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const useSections = usesContainer.querySelectorAll(".use-section");

  let totalParkingSpaces = 0;
  const useResults = [];
  const parkingRequirements = []; // To store parking spaces per use for ancillary calculations

  // First pass: Calculate parking requirements for all uses except those with ancillary use
  useSections.forEach(useDiv => {
    const useIndex = useDiv.dataset.index;
    const useSelect = useDiv.querySelector(`#use-select-${useIndex}`);
    const locationSelect = useDiv.querySelector(`#location-select-${useIndex}`);
    const dynamicInputs = useDiv.querySelector(`#dynamic-inputs-${useIndex}`);

    const selectedUse = useSelect.value;
    const selectedLocation = locationSelect.value;

    if (!selectedUse || !selectedLocation) {
      alert("Please select a use and a location for each section.");
      return;
    }

    // Determine which rate to use based on location
    const rateColumn = selectedLocation === "Within PPTN" ? "rateB" : "rateA";

    // Get all entries for the selected use and location
    const entries = carParkingData.filter(item =>
      item.use === selectedUse &&
      ((rateColumn === "rateA" && item.rateA > 0) || (rateColumn === "rateB" && item.rateB > 0))
    );

    let useParkingSpaces = 0;
    let hasAncillary = false;

    // Collect input values
    const inputValues = {};
    const inputElements = dynamicInputs.querySelectorAll("input");
    inputElements.forEach(input => {
      inputValues[input.id.replace(`_${useIndex}`, '')] = parseNumber(input.value);
    });

    entries.forEach((entry) => {
      let rate = rateColumn === "rateA" ? entry.rateA : entry.rateB;
      if (rate === 0) return; // Skip if rate is zero

      const measure = entry.measure.toLowerCase();

      // Split the measure string into components
      const measureComponents = measure.split(/ plus | and /);

      let parkingSpaces = 0;

      // For each component, find matching measureConfig entry
      measureComponents.forEach((component) => {
        component = component.trim();
        for (const config of measureConfig) {
          if (config.pattern.test(component)) {
            // Check if the measure includes ancillary use
            if (component.includes("ancillary use")) {
              hasAncillary = true;
              // We will calculate this in the second pass
            } else {
              parkingSpaces += config.calculation(rate, inputValues);
            }
            break; // Stop after finding the first matching measure
          }
        }
      });

      // Round down the parking spaces
      parkingSpaces = Math.floor(parkingSpaces);

      useParkingSpaces += parkingSpaces;
    });

    // Store the parking requirement for this use
    parkingRequirements.push({
      useIndex,
      use: selectedUse,
      parkingSpaces: useParkingSpaces,
      hasAncillary
    });

    // Only add to total if there's no ancillary use calculation pending
    if (!hasAncillary) {
      totalParkingSpaces += useParkingSpaces;
    }
  });

  // Second pass: Calculate parking requirements for uses with ancillary use
  parkingRequirements.forEach(requirement => {
    if (requirement.hasAncillary) {
      const useDiv = usesContainer.querySelector(`div[data-index='${requirement.useIndex}']`);
      const useSelect = useDiv.querySelector(`#use-select-${requirement.useIndex}`);
      const locationSelect = useDiv.querySelector(`#location-select-${requirement.useIndex}`);
      const dynamicInputs = useDiv.querySelector(`#dynamic-inputs-${requirement.useIndex}`);

      const selectedUse = useSelect.value;
      const selectedLocation = locationSelect.value;

      // Determine which rate to use based on location
      const rateColumn = selectedLocation === "Within PPTN" ? "rateB" : "rateA";

      // Get all entries for the selected use and location
      const entries = carParkingData.filter(item =>
        item.use === selectedUse &&
        ((rateColumn === "rateA" && item.rateA > 0) || (rateColumn === "rateB" && item.rateB > 0))
      );

      let useParkingSpaces = 0;

      // Collect input values
      const inputValues = {};
      const inputElements = dynamicInputs.querySelectorAll("input");
      inputElements.forEach(input => {
        inputValues[input.id.replace(`_${requirement.useIndex}`, '')] = parseNumber(input.value);
      });

      entries.forEach((entry) => {
        let rate = rateColumn === "rateA" ? entry.rateA : entry.rateB;
        if (rate === 0) return; // Skip if rate is zero

        const measure = entry.measure.toLowerCase();

        // Split the measure string into components
        const measureComponents = measure.split(/ plus | and /);

        let parkingSpaces = 0;

        // For each component, find matching measureConfig entry
        measureComponents.forEach((component) => {
          component = component.trim();
          for (const config of measureConfig) {
            if (config.pattern.test(component)) {
              if (component.includes("ancillary use")) {
                // Sum of other uses' parking requirements (excluding current use)
                const ancillaryParking = totalParkingSpaces;
                parkingSpaces += config.calculation(rate, { ancillary_use_requirement: ancillaryParking });
              } else {
                parkingSpaces += config.calculation(rate, inputValues);
              }
              break; // Stop after finding the first matching measure
            }
          }
        });

        // Round down the parking spaces
        parkingSpaces = Math.floor(parkingSpaces);

        useParkingSpaces += parkingSpaces;
      });

      // Update total parking spaces
      totalParkingSpaces += useParkingSpaces;

      // Update the parking requirement for this use
      requirement.parkingSpaces = useParkingSpaces;
    }
  });

  // Prepare results
  parkingRequirements.forEach(requirement => {
    useResults.push({
      use: requirement.use,
      parkingSpaces: requirement.parkingSpaces
    });
  });

  // Display the results
  resultDiv.innerHTML = "<h3>Parking Requirements:</h3>";

  const resultList = document.createElement("div");
  resultList.classList.add("result-list");

  // Create individual cards for each result
  useResults.forEach(result => {
    const listItem = document.createElement("div");
    listItem.classList.add("result-item");

    // Add a parking icon and space count
    listItem.innerHTML = `
    <div class="result-icon">
      <i class="fa-regular fa-building"></i>
    </div>
    <div class="result-content">
      <span class="result-use">${result.use}</span>
      <span class="result-spaces">${result.parkingSpaces} spaces</span>
    </div>
  `;

    resultList.appendChild(listItem);
  });

  // Create a total parking spaces summary
  const totalItem = document.createElement("div");
  totalItem.classList.add("total-item");
  totalItem.innerHTML = `
    <div class="total-icon">
      <i class="fas fa-parking"></i>
    </div>
    <div class="total-content">
      <strong>Total Parking Spaces Required:</strong> ${totalParkingSpaces}
    </div>
  `;

  resultDiv.appendChild(resultList);
  resultDiv.appendChild(totalItem);

});

// Event listener for 'Add Use' button
addUseButton.addEventListener("click", (e) => {
  e.preventDefault();
  addUse();
});