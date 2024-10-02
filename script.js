// script.js

// Access the DOM elements
const useSelect = document.getElementById("use-select");
const dynamicInputs = document.getElementById("dynamic-inputs");
const parkingForm = document.getElementById("parking-form");
const resultDiv = document.getElementById("result");
const columnSelect = document.getElementById("column-select");

// Wait for the data to be loaded before initializing
dataPromise.then(() => {
  initializeDropdown();
}).catch(err => {
  alert("Failed to load car parking data. Please try again.");
});

// Function to initialize the Use dropdown
function initializeDropdown() {
  // Get unique uses
  const uniqueUses = [...new Set(carParkingData.map(item => item.use))].sort();

  uniqueUses.forEach(use => {
    const option = document.createElement("option");
    option.value = use;
    option.textContent = use;
    useSelect.appendChild(option);
  });

  // Add event listener after dropdown is populated
  useSelect.addEventListener("change", onUseChange);
}

// Event handler for Use selection
function onUseChange() {
  dynamicInputs.innerHTML = "";
  resultDiv.textContent = "";

  const selectedUse = useSelect.value;

  if (selectedUse) {
    // Get all entries for the selected use
    const entries = carParkingData.filter(item => item.use === selectedUse);

    // Create input fields based on measures
    entries.forEach((entry, index) => {
      const measure = entry.measure.toLowerCase();

      // Determine required inputs based on measure
      if (measure.includes("patron permitted")) {
        createInputField(
          "number",
          `number_of_patrons_${index}`,
          "Number of Patrons Permitted",
          true
        );
      }
      if (measure.includes("leasable floor area")) {
        createInputField(
          "number",
          `leasable_floor_area_${index}`,
          "Leasable Floor Area (sq m)",
          true
        );
      }
      if (measure.includes("net floor area")) {
        createInputField(
          "number",
          `net_floor_area_${index}`,
          "Net Floor Area (sq m)",
          true
        );
      }
      if (measure.includes("site area")) {
        createInputField(
          "number",
          `site_area_${index}`,
          "Site Area (sq m)",
          true
        );
      }
      if (measure.includes("employee")) {
        createInputField(
          "number",
          `number_of_employees_${index}`,
          "Number of Employees",
          true
        );
      }
      if (measure.includes("child")) {
        createInputField(
          "number",
          `number_of_children_${index}`,
          "Number of Children",
          true
        );
      }
      if (measure.includes("court")) {
        createInputField(
          "number",
          `number_of_courts_${index}`,
          "Number of Courts",
          true
        );
      }
      if (measure.includes("rink")) {
        createInputField(
          "number",
          `number_of_rinks_${index}`,
          "Number of Rinks",
          true
        );
        // Handle ancillary use
        createInputField(
          "number",
          `ancillary_use_${index}`,
          "Ancillary Use Requirement",
          false // Optional
        );
      }
      if (measure.includes("hole")) {
        createInputField(
          "number",
          `number_of_holes_${index}`,
          "Number of Holes",
          true
        );
        // Handle ancillary use
        createInputField(
          "number",
          `ancillary_use_${index}`,
          "Ancillary Use Requirement",
          false // Optional
        );
      }
      if (measure.includes("vehicle being serviced")) {
        createInputField(
          "number",
          `number_of_vehicles_${index}`,
          "Number of Vehicles Being Serviced",
          true
        );
      }
      if (measure.includes("unit")) {
        createInputField(
          "number",
          `number_of_units_${index}`,
          "Number of Units",
          true
        );
        createInputField(
          "number",
          `number_of_manager_dwellings_${index}`,
          "Number of Manager Dwellings",
          true
        );
        // Handle ancillary use
        createInputField(
          "number",
          `ancillary_use_${index}`,
          "Ancillary Use Requirement",
          false // Optional
        );
      }
      if (measure.includes("dwelling")) {
        createInputField(
          "number",
          `one_two_bedroom_dwellings_${index}`,
          "Number of One or Two Bedroom Dwellings",
          true
        );
        createInputField(
          "number",
          `three_more_bedroom_dwellings_${index}`,
          "Number of Three or More Bedroom Dwellings",
          true
        );
        if (measure.includes("visitors to every")) {
          createInputField(
            "number",
            `number_of_dwellings_${index}`,
            "Total Number of Dwellings",
            true
          );
        }
      }
      if (measure.includes("student")) {
        createInputField(
          "number",
          `number_of_students_${index}`,
          "Number of Students",
          true
        );
      }
      if (measure.includes("lodging room")) {
        createInputField(
          "number",
          `number_of_lodging_rooms_${index}`,
          "Number of Lodging Rooms",
          true
        );
      }
      if (measure.includes("bedroom")) {
        createInputField(
          "number",
          `number_of_bedrooms_${index}`,
          "Number of Bedrooms",
          true
        );
      }
      if (measure.includes("premises")) {
        // For "To each premises", no additional input needed
      }
      if (measure.includes("per cent of site area")) {
        createInputField(
          "number",
          `site_area_${index}`,
          "Site Area (sq m)",
          true
        );
      }
      if (measure.includes("for each vehicle")) {
        createInputField(
          "number",
          `number_of_vehicles_${index}`,
          "Number of Vehicles",
          true
        );
      }
      if (measure.includes("additional input")) {
        createInputField(
          "number",
          `additional_input_${index}`,
          "Additional Input",
          true
        );
      }
    });
  }
}

// Function to create input fields
function createInputField(type, id, labelText, required) {
  const label = document.createElement("label");
  label.htmlFor = id;
  label.textContent = labelText;

  const input = document.createElement("input");
  input.type = type;
  input.id = id;
  input.name = id;
  input.required = required;

  dynamicInputs.appendChild(label);
  dynamicInputs.appendChild(input);
}

// Helper function to parse numbers safely
function parseNumber(value) {
  const number = parseFloat(value);
  return isNaN(number) ? 0 : number;
}

// Event listener for form submission
parkingForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const selectedUse = useSelect.value;
  const selectedColumn = columnSelect.value;

  if (!selectedUse || !selectedColumn) {
    alert("Please select a use and a column.");
    return;
  }

  // Get all entries for the selected use
  const entries = carParkingData.filter(item => item.use === selectedUse);
  let totalParkingSpaces = 0;

  entries.forEach((entry, index) => {
    let rate = selectedColumn === "A" ? entry.rateA : entry.rateB;

    if (rate === 0) return; // Skip if rate is zero

    const measure = entry.measure.toLowerCase();

    let parkingSpaces = 0;

    // Perform calculations based on measure
    if (measure.includes("patron permitted")) {
      const numberOfPatrons = parseNumber(
        document.getElementById(`number_of_patrons_${index}`)?.value || 0
      );
      parkingSpaces = rate * numberOfPatrons;
    }
    if (measure.includes("leasable floor area")) {
      const floorArea = parseNumber(
        document.getElementById(`leasable_floor_area_${index}`)?.value || 0
      );
      parkingSpaces += (rate * floorArea) / 100;
    }
    if (measure.includes("net floor area")) {
      const floorArea = parseNumber(
        document.getElementById(`net_floor_area_${index}`)?.value || 0
      );
      parkingSpaces += (rate * floorArea) / 100;
    }
    if (measure.includes("site area") && measure.includes("per cent")) {
      const siteArea = parseNumber(
        document.getElementById(`site_area_${index}`)?.value || 0
      );
      parkingSpaces += (rate / 100) * siteArea;
    }
    if (measure.includes("site area") && !measure.includes("per cent")) {
      const siteArea = parseNumber(
        document.getElementById(`site_area_${index}`)?.value || 0
      );
      parkingSpaces += (rate * siteArea) / 100;
    }
    if (measure.includes("employee") && measure.includes("part of maximum")) {
      const numberOfEmployees = parseNumber(
        document.getElementById(`number_of_employees_${index}`)?.value || 0
      );
      parkingSpaces += rate * numberOfEmployees;
    }
    if (measure.includes("employee") && !measure.includes("part of maximum")) {
      const numberOfEmployees = parseNumber(
        document.getElementById(`number_of_employees_${index}`)?.value || 0
      );
      parkingSpaces += rate * numberOfEmployees;
    }
    if (measure.includes("child")) {
      const numberOfChildren = parseNumber(
        document.getElementById(`number_of_children_${index}`)?.value || 0
      );
      parkingSpaces += rate * numberOfChildren;
    }
    if (measure.includes("court")) {
      const numberOfCourts = parseNumber(
        document.getElementById(`number_of_courts_${index}`)?.value || 0
      );
      parkingSpaces += rate * numberOfCourts;
    }
    if (measure.includes("rink")) {
      const numberOfRinks = parseNumber(
        document.getElementById(`number_of_rinks_${index}`)?.value || 0
      );
      const ancillaryUse = parseNumber(
        document.getElementById(`ancillary_use_${index}`)?.value || 0
      );
      parkingSpaces += rate * numberOfRinks + 0.5 * ancillaryUse;
    }
    if (measure.includes("hole")) {
      const numberOfHoles = parseNumber(
        document.getElementById(`number_of_holes_${index}`)?.value || 0
      );
      const ancillaryUse = parseNumber(
        document.getElementById(`ancillary_use_${index}`)?.value || 0
      );
      parkingSpaces += rate * numberOfHoles + 0.5 * ancillaryUse;
    }
    if (measure.includes("vehicle being serviced")) {
      const numberOfVehicles = parseNumber(
        document.getElementById(`number_of_vehicles_${index}`)?.value || 0
      );
      parkingSpaces += rate * numberOfVehicles;
    }
    if (measure.includes("unit")) {
      const numberOfUnits = parseNumber(
        document.getElementById(`number_of_units_${index}`)?.value || 0
      );
      const numberOfManagerDwellings = parseNumber(
        document.getElementById(`number_of_manager_dwellings_${index}`)?.value || 0
      );
      const ancillaryUse = parseNumber(
        document.getElementById(`ancillary_use_${index}`)?.value || 0
      );
      parkingSpaces += rate * numberOfUnits + rate * numberOfManagerDwellings + 0.5 * ancillaryUse;
    }
    if (measure.includes("dwelling")) {
      const oneTwoBedroomDwellings = parseNumber(
        document.getElementById(`one_two_bedroom_dwellings_${index}`)?.value || 0
      );
      const threeMoreBedroomDwellings = parseNumber(
        document.getElementById(`three_more_bedroom_dwellings_${index}`)?.value || 0
      );
      parkingSpaces += rate * oneTwoBedroomDwellings + rate * threeMoreBedroomDwellings;

      if (measure.includes("visitors to every")) {
        const totalDwellings = parseNumber(
          document.getElementById(`number_of_dwellings_${index}`)?.value || 0
        );
        if (totalDwellings >= 5) {
          parkingSpaces += Math.floor((totalDwellings / 5) * rate);
        }
      }
    }
    if (measure.includes("student")) {
      const numberOfStudents = parseNumber(
        document.getElementById(`number_of_students_${index}`)?.value || 0
      );
      parkingSpaces += rate * numberOfStudents;
    }
    if (measure.includes("lodging room")) {
      const numberOfLodgingRooms = parseNumber(
        document.getElementById(`number_of_lodging_rooms_${index}`)?.value || 0
      );
      parkingSpaces += rate * numberOfLodgingRooms;
    }
    if (measure.includes("bedroom")) {
      const numberOfBedrooms = parseNumber(
        document.getElementById(`number_of_bedrooms_${index}`)?.value || 0
      );
      parkingSpaces += Math.floor((rate * numberOfBedrooms) / 4); // Assuming 1 parking per 4 bedrooms
    }
    if (measure.includes("premises")) {
      parkingSpaces += rate; // Since it's per premises
    }
    if (measure.includes("additional input")) {
      const additionalInput = parseNumber(
        document.getElementById(`additional_input_${index}`)?.value || 0
      );
      parkingSpaces += rate * additionalInput;
    }

    // Round down the parking spaces
    parkingSpaces = Math.floor(parkingSpaces);

    totalParkingSpaces += parkingSpaces;
  });

  resultDiv.textContent = `Required Number of Parking Spaces: ${totalParkingSpaces}`;
});
