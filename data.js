// data.js

// Initialize data arrays
let oldParkingData = [];
let newParkingData = [];

// Function to load and parse the Old Parking Standards CSV
function loadOldParkingData() {
  return new Promise((resolve, reject) => {
    Papa.parse("Old_Parking_Standards.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        oldParkingData = results.data.map(row => {
          return {
            use: row["Use"].trim(),
            rateA: parseFloat(row["Rate Column A"]) || 0,
            rateB: parseFloat(row["Rate Column B"]) || 0,
            measure: row["Car Parking Measure Column C"].trim()
          };
        });
        resolve();
      },
      error: function(err) {
        console.error("Error loading Old Parking Standards CSV:", err);
        reject(err);
      }
    });
  });
}

// Function to load and parse the New Parking Standards CSV
function loadNewParkingData() {
  return new Promise((resolve, reject) => {
    Papa.parse("New_Parking_Standards.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        newParkingData = results.data.map(row => {
          return {
            use: row["Land use"].trim(),
            measure: row["Measure"].trim(),
            category1: parseFloat(row["Category 1"]) || 0,
            category2: parseFloat(row["Category 2"]) || 0,
            category3Min: row["Category 3 Min"] !== "" ? parseFloat(row["Category 3 Min"]) : null,
            category3Max: row["Category 3 Max"] !== "" ? parseFloat(row["Category 3 Max"]) : null,
            category4: row["Category 4"] !== "" ? parseFloat(row["Category 4"]) : null
          };
        });
        resolve();
      },
      error: function(err) {
        console.error("Error loading New Parking Standards CSV:", err);
        reject(err);
      }
    });
  });
}

// Load both datasets when the script is loaded
const dataPromise = Promise.all([loadOldParkingData(), loadNewParkingData()]);

// For backward compatibility, also expose carParkingData
let carParkingData = [];
dataPromise.then(() => {
  carParkingData = oldParkingData;
});
