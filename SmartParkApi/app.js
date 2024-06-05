const {
  changeOccupancyStatus,
  loadOccupiedSpaces,
} = require("./firebase/database");

const express = require("express");
const app = express();
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

const port = 9999;

app.use(express.json()); // Middleware to parse JSON bodies

var parkingSpaces = {
  A: Array(3).fill(false),
  B: Array(2).fill(false),
};

const updateParkingSpaces = async () => {
  await loadOccupiedSpaces().then((occupiedSpaces) => {
    const newParkingSpaces = { ...parkingSpaces };
    occupiedSpaces.forEach(({ area, spaceId, occupiedAt }) => {
      if (occupiedAt === null) {
        newParkingSpaces[area][spaceId - 1] = false;
      } else {
        newParkingSpaces[area][spaceId - 1] = true;
      }
    });
    parkingSpaces = newParkingSpaces;
    //testData.forEach((data) => testProcessData(data));
  });
};

const testProcessData = (data) => {
  const [area, spaceId, occupied] = data.split("_");
  const isOccupied = occupied === "1";

  if (parkingSpaces[area][spaceId - 1] !== isOccupied) {
    parkingSpaces[area][spaceId - 1] = isOccupied;

    const newOccupiedAt = isOccupied ? new Date() : null;
    changeOccupancyStatus(area, spaceId, newOccupiedAt)
      .then(() =>
        console.log(`Occupancy status changed for ${area}_${spaceId}`)
      )
      .catch((error) =>
        console.error(
          `Error changing occupancy status for ${area}_${spaceId}:`,
          error
        )
      );
  }
};

const testData = [
  "A_1_0", // Parking space A1 becomes occupied
  "A_2_1", // Parking space A3 becomes unoccupied
];

updateParkingSpaces();
// Start by updating parking spaces

SerialPort.list().then(
  (ports) => ports.forEach(console.log),
  (err) => console.error(err)
);
const comPort1 = new SerialPort({
  path: "COM6",
  baudRate: 9600,
  dataBits: 8,
  stopBits: 1,
  parity: "none",
});

const parser = comPort1.pipe(new ReadlineParser({ delimiter: "\r\n" }));
parser.on("data", function (data) {
  console.log(data);
});

app.listen(port, function () {});
parser.on("data", function (data) {
  const [area, spaceId, occupied] = data.split("_");
  console.log(area, spaceId, occupied);
  const isOccupied = occupied === "1";

  if (parkingSpaces[area][spaceId - 1] !== isOccupied) {
    parkingSpaces[area][spaceId - 1] = isOccupied;

    const newOccupiedAt = isOccupied ? new Date() : null;
    changeOccupancyStatus(area, spaceId, newOccupiedAt)
      .then(() =>
        console.log(`Occupancy status changed for ${area}_${spaceId}`)
      )
      .catch((error) =>
        console.error(
          `Error changing occupancy status for ${area}_${spaceId}:`,
          error
        )
      );
  }
});

app.post("/", (req, res) => {
  console.log("Received body:", req.body);
  const hallValue1 = req.body.B_1_;
  const hallValue2 = req.body.B_2_;
  // Format data to match the existing format
  const data1 = `B_1_${hallValue1}`;
  const data2 = `B_2_${hallValue2}`;

  // Parse and process the data similar to the parser.on("data") event
  const [area, spaceId, occupied] = data1.split("_");
  processOccupancyChange(area, spaceId, occupied);
  const [area2, spaceId2, occupied2] = data2.split("_");
  processOccupancyChange(area2, spaceId2, occupied2);

  res.send("Data received");
});

function processOccupancyChange(area, spaceId, occupied) {
  const isOccupied = occupied === "1";
  if (parkingSpaces[area][spaceId - 1] !== isOccupied) {
    parkingSpaces[area][spaceId - 1] = isOccupied;

    const newOccupiedAt = isOccupied ? new Date() : null;
    changeOccupancyStatus(area, spaceId, newOccupiedAt)
      .then(() =>
        console.log(`Occupancy status changed for ${area}_${spaceId}`)
      )
      .catch((error) =>
        console.error(
          `Error changing occupancy status for ${area}_${spaceId}:`,
          error
        )
      );
  }
}
