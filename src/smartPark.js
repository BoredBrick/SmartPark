import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) => {
        const newTimers = { ...prevTimers };
        for (const area in newTimers) {
          newTimers[area] = newTimers[area].map((time, index) =>
            occupiedSpaces[area][index] ? time + 1 : time
          );
        }
        return newTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [occupiedSpaces]);

  const handleAreaSelection = (area) => {
    setSelectedArea(area);
  };

  const formatTime = (seconds) => {
    const padZero = (num) => (num < 10 ? `0${num}` : num);

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${padZero(hours)}:${padZero(minutes)}:${padZero(
        remainingSeconds
      )}`;
    } else if (minutes > 0) {
      return `${padZero(minutes)}:${padZero(remainingSeconds)}`;
    } else {
      return `${remainingSeconds} seconds`;
    }
  };

  const handleParkingSpaceClick = (index) => {
    const newOccupiedSpaces = { ...occupiedSpaces };
    newOccupiedSpaces[selectedArea][index] =
      !newOccupiedSpaces[selectedArea][index];
    setOccupiedSpaces(newOccupiedSpaces);

    if (!newOccupiedSpaces[selectedArea][index]) {
      setTimers((prevTimers) => {
        const newTimers = { ...prevTimers };
        newTimers[selectedArea][index] = 0;
        return newTimers;
      });
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
                    Occupied for {formatTime(timers[selectedArea][index])}
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
