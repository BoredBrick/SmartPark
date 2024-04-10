import React, { useState } from "react";
import { Button, Grid, Paper, Typography } from "@mui/material";

const SmartPark = () => {
  const [selectedArea, setSelectedArea] = useState(null);
  const [occupiedSpaces, setOccupiedSpaces] = useState({
    area1: Array(4).fill(false),
    area2: Array(4).fill(false),
  });
  const [timers, setTimers] = useState({
    area1: Array(4).fill(0),
    area2: Array(4).fill(0),
  });

  const handleAreaSelection = (area) => {
    setSelectedArea(area);
  };

  const handleParkingSpaceClick = (index) => {
    const newOccupiedSpaces = { ...occupiedSpaces };
    newOccupiedSpaces[selectedArea][index] =
      !newOccupiedSpaces[selectedArea][index];
    setOccupiedSpaces(newOccupiedSpaces);

    if (newOccupiedSpaces[selectedArea][index]) {
      const newTimers = { ...timers };
      newTimers[selectedArea][index] = setInterval(() => {
        setTimers((prevTimers) => {
          const updatedTimers = { ...prevTimers };
          updatedTimers[selectedArea][index] += 1;
          return updatedTimers;
        });
      }, 1000);
      setTimers(newTimers);
    } else {
      clearInterval(timers[selectedArea][index]);
      const newTimers = { ...timers };
      newTimers[selectedArea][index] = 0;
      setTimers(newTimers);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Smart Parking System
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleAreaSelection("area1")}
        style={{ marginRight: 10 }}
      >
        Area 1
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleAreaSelection("area2")}
      >
        Area 2
      </Button>

      {selectedArea && (
        <Grid container spacing={2} style={{ marginTop: 20 }}>
          {[...Array(4)].map((_, index) => (
            <Grid item xs={3} key={index}>
              <Paper
                style={{
                  padding: 20,
                  textAlign: "center",
                  backgroundColor: occupiedSpaces[selectedArea][index]
                    ? "red"
                    : "lightgray",
                }}
                onClick={() => handleParkingSpaceClick(index)}
              >
                Parking Space {index + 1} (Area {selectedArea})<br />
                {occupiedSpaces[selectedArea][index] ? (
                  <span>
                    Occupied for {timers[selectedArea][index]} seconds
                  </span>
                ) : (
                  <span>Click to occupy</span>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default SmartPark;
