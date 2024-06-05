const { firestore } = require("./firebase");

const db = firestore;

const createOccupiedSpace = (area, spaceId, occupiedAt) => {
  const documentId = `${area}_${spaceId}`;
  return db.collection("occupiedSpaces").doc(documentId).set({
    area: area,
    spaceId: spaceId,
    occupiedAt: occupiedAt,
  });
};

const changeOccupancyStatus = async (area, spaceId, newOccupiedAt) => {
  const documentId = `${area}_${spaceId}`; // Constructing the document ID
  const doc = await db.collection("occupiedSpaces").doc(documentId).get();
  if (doc.exists) {
    const occupiedAt = doc.data().occupiedAt;
    if (newOccupiedAt === null) {
      addOccupancyLog(area, spaceId, occupiedAt, new Date());
    }
    return db
      .collection("occupiedSpaces")
      .doc(documentId)
      .update({ occupiedAt: newOccupiedAt });
  }
};

const addOccupancyLog = (area, spaceId, occupiedAt, occupiedEnded) => {
  return db.collection("occupancyLogs").add({
    area: area,
    spaceId: spaceId,
    occupiedAt: occupiedAt,
    occupiedEnded: occupiedEnded,
  });
};

const loadOccupiedSpaces = async () => {
  var col = await db.collection("occupiedSpaces").get();
  return col.docs.map((doc) => doc.data());
};

module.exports = {
  createOccupiedSpace,
  changeOccupancyStatus,
  addOccupancyLog,
  loadOccupiedSpaces,
};
