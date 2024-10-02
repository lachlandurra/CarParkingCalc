// data.js

// Initialize carParkingData as an empty array
let carParkingData = [];

// Function to load and parse the CSV file
function loadCarParkingData() {
  return new Promise((resolve, reject) => {
    Papa.parse("Table1_CarParking.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        // Convert each row into a standardized object
        carParkingData = results.data.map(row => {
          return {
            use: row["Use"].trim(),
            rateA: parseFloat(row["Rate Column A"]),
            rateB: parseFloat(row["Rate Column B"]),
            measure: row["Car Parking Measure Column C"].trim()
          };
        });
        resolve();
      },
      error: function(err) {
        console.error("Error loading CSV:", err);
        reject(err);
      }
    });
  });
}

// Load the data when the script is loaded
const dataPromise = loadCarParkingData();
