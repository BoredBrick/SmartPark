import React, { useState, useEffect } from "react";
import { Button, Grid, Paper, Typography } from "@mui/material";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { db } from "./firebase/firestore";
import { collection, getDocs } from "firebase/firestore";

const SmartPark = () => {
  const [selectedArea, setSelectedArea] = useState("A");
  const [parkingSpaces, setParkingSpaces] = useState({
    A: Array(4).fill(false),
    B: Array(4).fill(false),
  });
  const [timers, setTimers] = useState({
    A: Array(4).fill(0),
    B: Array(4).fill(0),
  });
  var initialLoad = true;
  const fetchInitialParkingSpaces = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "occupiedSpaces"));
      const updatedParkingSpaces = { ...parkingSpaces };
      const updatedTimers = { ...timers };
      var change = false;
      querySnapshot.forEach((doc) => {
        const { area, spaceId, occupiedAt } = doc.data();
        const index = parseInt(spaceId) - 1;
        const isOccupied = !!occupiedAt;

        if (updatedParkingSpaces[area][index] !== isOccupied) {
          updatedParkingSpaces[area][index] = isOccupied;
          if (isOccupied) {
            change = true;
            const timeDifferenceInSeconds = Math.floor(
              (Date.now() - occupiedAt.toDate().getTime()) / 1000
            );
            updatedTimers[area][index] = timeDifferenceInSeconds;
          }
          const notificationMessage = `${
            isOccupied ? "Occupied" : "Freed"
          }: Parking space ${index + 1} in Area ${area}`;
          if (!initialLoad) {
            enqueueSnackbar(notificationMessage, {
              variant: isOccupied ? "error" : "success",
            });
          }
        }
      });

      setParkingSpaces(updatedParkingSpaces);
      if (change) {
        setTimers(updatedTimers);
      }
      if (initialLoad) {
        initialLoad = false;
        return;
      }
    } catch (error) {
      console.error("Error fetching initial parking spaces:", error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchInitialParkingSpaces, 5000);
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

  const handleAreaSelection = (area) => {
    setSelectedArea(area);
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        SmartPark
      </Typography>

      <Button
        variant={selectedArea === "A" ? "contained" : "outlined"}
        color="primary"
        onClick={() => handleAreaSelection("A")}
        style={{ marginRight: 10 }}
      >
        Area 1
      </Button>
      <Button
        variant={selectedArea === "B" ? "contained" : "outlined"}
        color="primary"
        onClick={() => handleAreaSelection("B")}
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
                  backgroundColor: parkingSpaces[selectedArea][index]
                    ? "red"
                    : "lightgray",
                }}
              >
                Parking Space {index + 1} ({selectedArea})<br />
                {parkingSpaces[selectedArea][index] && (
                  <span>
                    Occupied for {formatTime(timers[selectedArea][index])}
                  </span>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
      <SnackbarProvider />
    </div>
  );
};

export default SmartPark;
