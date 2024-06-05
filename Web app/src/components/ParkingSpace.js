import React from "react";
import { Paper } from "@mui/material";
import formatTime from "../utils/formatTime";

const ParkingSpace = ({ area, index, isOccupied, timer }) => {
  return (
    <Paper
      style={{
        padding: 20,
        textAlign: "center",
        backgroundColor: isOccupied ? "red" : "lightgray",
      }}
    >
      {`Parking Space ${index + 1} (${area})`}
      {isOccupied && <span> Occupied for {formatTime(timer)}</span>}
    </Paper>
  );
};

export default ParkingSpace;
