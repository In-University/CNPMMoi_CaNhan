const mongoose = require('mongoose');

const dbState = [
    { value: 0, label: "Disconnected" },
    { value: 1, label: "Connected" },
    { value: 2, label: "Connecting" },
    { value: 3, label: "Disconnecting" }
];

const connection = async () => {
    const uri = process.env.MONGO_DB_URL;
    if (!uri) {
        throw new Error('MONGO_DB_URL is not defined in environment');
    }
    await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
    });
    const state = Number(mongoose.connection.readyState);
    console.log(dbState.find(f => f.value === state).label, "to database"); // connected to db
}

module.exports = connection;