import { db } from "../firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import { enqueueSnackbar } from "notistack";

let initialLoad = true;
const fetchParkingSpaces = async (parkingSpaces, timers) => {
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
        }: Parking space ${
          index + 1
        } in Area ${area} at ${new Date().toLocaleTimeString()}`;
        if (!initialLoad) {
          enqueueSnackbar(notificationMessage, {
            variant: isOccupied ? "error" : "success",
            persist: true,
          });
        }
      }
    });
    if (initialLoad) {
      initialLoad = false;
    }
    return { updatedParkingSpaces, updatedTimers };
  } catch (error) {
    console.error("Error fetching initial parking spaces:", error);
  }
};

export { fetchParkingSpaces };
