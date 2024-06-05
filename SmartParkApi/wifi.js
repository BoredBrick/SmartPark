const express = require("express");
const app = express();
const port = 9999;

app.use(express.json()); // Middleware to parse JSON bodies

// Route to handle the POST request from Arduino
app.post("/", (req, res) => {
  console.log("Received body:", req.body);
  const hallValue1 = req.body.B_1_;
  const hallValue2 = req.body.B_2_;
  console.log(`Hall Sensor 1 Value: ${hallValue1}`);
  console.log(`Hall Sensor 2 Value: ${hallValue2}`);
  res.send("Data received");
});

app.listen(port, () => {
  console.log(`Server running at http://0.0.0.0:${port}/`);
});
