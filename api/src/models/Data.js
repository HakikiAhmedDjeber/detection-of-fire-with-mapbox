const mongoose = require('mongoose');
const { Schema } = mongoose;
const DataSchema = new Schema({
    Temperature: {
        type: Number
    },
    Humidity: {
        type: Number
    },
    Gas: {
        type: Number
    },
    Air: {
        type: Number
    },
    Fire: {
        type: Boolean
    },
    Light: {
        type: Number
    }
}, { timestamps: true });

const Data = mongoose.model('Data', DataSchema);

module.exports = Data;
