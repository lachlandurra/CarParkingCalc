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

      // Issue 1 Fix: Handle "per cent of site area" first
      if (measure.includes("per cent of site area")) {
        createInputField(
          "number",
          `site_area_${index}`,
          "Site Area (sq m)",
          true
        );
      } else if (measure.includes("site area")) {
        createInputField(
          "number",
          `site_area_${index}`,
          "Site Area (sq m)",
          true
        );
      }

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

      if (measure.includes("employee") && !measure.includes("part of maximum")) {
        createInputField(
          "number",
          `number_of_employees_${index}`,
          "Number of Employees",
          true
        );
      }

      if (measure.includes("employee") && measure.includes("part of maximum")) {
        createInputField(
          "number",
          `number_of_employees_${index}`,
          "Number of Employees (Maximum on site at any time)",
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

      if (measure.includes("court") && !measure.includes("squash")) {
        createInputField(
          "number",
          `number_of_courts_${index}`,
          "Number of Courts",
          true
        );
      }

      if (measure.includes("squash court")) {
        createInputField(
          "number",
          `number_of_squash_courts_${index}`,
          "Number of Squash Courts",
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
          `vehicles_being_serviced_${index}`,
          "Number of Vehicles Being Serviced",
          true
        );
      }

      if (measure.includes("vehicle") && !measure.includes("being serviced")) {
        createInputField(
          "number",
          `number_of_vehicles_${index}`,
          "Number of Vehicles",
          true
        );
      }

      if (measure.includes("unit") && measure.includes("manager dwelling")) {
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

      // Issue 2 Fix: Handle "dwelling" inputs specifically
      if (measure.includes("one or two bedroom dwelling")) {
        createInputField(
          "number",
          `one_two_bedroom_dwellings_${index}`,
          "Number of One or Two Bedroom Dwellings",
          true
        );
      }

      if (measure.includes("three or more bedroom dwelling")) {
        createInputField(
          "number",
          `three_more_bedroom_dwellings_${index}`,
          "Number of Three or More Bedroom Dwellings",
          true
        );
      }

      if (measure.includes("visitors to every") && measure.includes("dwellings")) {
        createInputField(
          "number",
          `number_of_dwellings_${index}`,
          "Total Number of Dwellings",
          true
        );
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

      if (measure.includes("bedroom") && !measure.includes("dwelling")) {
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

      // Issue 3 Fix: Medical Centre measures
      if (measure.includes("first person providing health services")) {
        createInputField(
          "number",
          `first_persons_${index}`,
          "Is there a first person providing health services? (Enter 1 if yes, 0 if no)",
          true
        );
      }

      if (measure.includes("every other person providing health services")) {
        createInputField(
          "number",
          `other_persons_${index}`,
          "Number of Other Persons Providing Health Services",
          true
        );
      }

      // Additional cases can be added here as needed

    });
  }
}

// Function to create input fields
function createInputField(type, id, labelText, required) {
  // Avoid duplicate input fields
  if (document.getElementById(id)) {
    return;
  }

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
      parkingSpaces += rate * numberOfPatrons;
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

    if (measure.includes("per cent of site area")) {
      const siteArea = parseNumber(
        document.getElementById(`site_area_${index}`)?.value || 0
      );
      parkingSpaces += (rate / 100) * siteArea;
    } else if (measure.includes("site area")) {
      const siteArea = parseNumber(
        document.getElementById(`site_area_${index}`)?.value || 0
      );
      parkingSpaces += (rate * siteArea) / 100;
    }

    if (measure.includes("child")) {
      const numberOfChildren = parseNumber(
        document.getElementById(`number_of_children_${index}`)?.value || 0
      );
      parkingSpaces += rate * numberOfChildren;
    }

    if (measure.includes("employee") && measure.includes("part of maximum")) {
      const numberOfEmployees = parseNumber(
        document.getElementById(`number_of_employees_${index}`)?.value || 0
      );
      parkingSpaces += rate * numberOfEmployees;
    } else if (measure.includes("employee")) {
      const numberOfEmployees = parseNumber(
        document.getElementById(`number_of_employees_${index}`)?.value || 0
      );
      parkingSpaces += rate * numberOfEmployees;
    }

    if (measure.includes("court") && !measure.includes("squash")) {
      const numberOfCourts = parseNumber(
        document.getElementById(`number_of_courts_${index}`)?.value || 0
      );
      parkingSpaces += rate * numberOfCourts;
    }

    if (measure.includes("squash court")) {
      const numberOfCourts = parseNumber(
        document.getElementById(`number_of_squash_courts_${index}`)?.value || 0
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
        document.getElementById(`vehicles_being_serviced_${index}`)?.value || 0
      );
      parkingSpaces += rate * numberOfVehicles;
    }

    if (measure.includes("unit") && measure.includes("manager dwelling")) {
      const numberOfUnits = parseNumber(
        document.getElementById(`number_of_units_${index}`)?.value || 0
      );
      const numberOfManagerDwellings = parseNumber(
        document.getElementById(`number_of_manager_dwellings_${index}`)?.value || 0
      );
      const ancillaryUse = parseNumber(
        document.getElementById(`ancillary_use_${index}`)?.value || 0
      );
      parkingSpaces += rate * (numberOfUnits + numberOfManagerDwellings) + 0.5 * ancillaryUse;
    }

    // Issue 2 Fix: Adjust calculations for dwellings
    if (measure.includes("one or two bedroom dwelling")) {
      const oneTwoBedroomDwellings = parseNumber(
        document.getElementById(`one_two_bedroom_dwellings_${index}`)?.value || 0
      );
      parkingSpaces += rate * oneTwoBedroomDwellings;
    }

    if (measure.includes("three or more bedroom dwelling")) {
      const threeMoreBedroomDwellings = parseNumber(
        document.getElementById(`three_more_bedroom_dwellings_${index}`)?.value || 0
      );
      parkingSpaces += rate * threeMoreBedroomDwellings;
    }

    if (measure.includes("visitors to every") && measure.includes("dwellings")) {
      const totalDwellings = parseNumber(
        document.getElementById(`number_of_dwellings_${index}`)?.value || 0
      );
      if (totalDwellings >= 5) {
        parkingSpaces += Math.floor((totalDwellings / 5) * rate);
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

    if (measure.includes("bedroom") && !measure.includes("dwelling")) {
      const numberOfBedrooms = parseNumber(
        document.getElementById(`number_of_bedrooms_${index}`)?.value || 0
      );
      parkingSpaces += rate * numberOfBedrooms / 4; // Adjust as needed
    }

    if (measure.includes("premises")) {
      parkingSpaces += rate; // Since it's per premises
    }

    // Issue 3 Fix: Medical Centre calculations
    if (measure.includes("first person providing health services")) {
      const firstPersons = parseNumber(
        document.getElementById(`first_persons_${index}`)?.value || 0
      );
      parkingSpaces += rate * firstPersons;
    }

    if (measure.includes("every other person providing health services")) {
      const otherPersons = parseNumber(
        document.getElementById(`other_persons_${index}`)?.value || 0
      );
      parkingSpaces += rate * otherPersons;
    }

    // Additional calculations can be added here

    // Round down the parking spaces
    parkingSpaces = Math.floor(parkingSpaces);

    totalParkingSpaces += parkingSpaces;
  });

  resultDiv.textContent = `Required Number of Parking Spaces: ${totalParkingSpaces}`;
});
