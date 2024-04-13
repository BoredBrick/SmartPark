import React, { useState, useEffect } from "react";
import { Button, Grid, Typography } from "@mui/material";
import { SnackbarProvider } from "notistack";
import ParkingSpace from "./components/ParkingSpace";
import { fetchParkingSpaces } from "./services/parkingService";
import { areas } from "./constants/areas";

const SmartPark = () => {
  const [selectedArea, setSelectedArea] = useState(areas[0]);
  const [parkingSpaces, setParkingSpaces] = useState({
    A: Array(4).fill(false),
    B: Array(4).fill(false),
  });
  const [timers, setTimers] = useState({
    A: Array(4).fill(0),
    B: Array(4).fill(0),
  });

  useEffect(() => {
    const fetchData = async () => {
      const { updatedParkingSpaces, updatedTimers } = await fetchParkingSpaces(
        parkingSpaces,
        timers
      );
      setParkingSpaces(updatedParkingSpaces);
      setTimers(updatedTimers);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const { updatedParkingSpaces, updatedTimers } = await fetchParkingSpaces(
        parkingSpaces,
        timers
      );
      setParkingSpaces(updatedParkingSpaces);
      setTimers(updatedTimers);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) => {
        const newTimers = { ...prevTimers };
        for (const area in newTimers) {
          newTimers[area] = newTimers[area].map((time, index) =>
            parkingSpaces[area][index] ? time + 1 : time
          );
        }
        return newTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [parkingSpaces]);

  const handleAreaSelection = (area) => {
    setSelectedArea(area);
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        SmartPark
      </Typography>

      <div>
        {areas.map((area) => (
          <Button
            key={area}
            variant={selectedArea === area ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleAreaSelection(area)}
            style={{ marginRight: 10 }}
          >
            {`Area ${area}`}
          </Button>
        ))}
      </div>

      {selectedArea && (
        <Grid container spacing={2} style={{ marginTop: 20 }}>
          {parkingSpaces[selectedArea]?.map((isOccupied, index) => (
            <Grid item xs={3} key={index}>
              <ParkingSpace
                area={selectedArea}
                index={index}
                isOccupied={isOccupied}
                timer={timers[selectedArea]?.[index]}
              />
            </Grid>
          ))}
        </Grid>
      )}
      <SnackbarProvider />
    </div>
  );
};

export default SmartPark;
