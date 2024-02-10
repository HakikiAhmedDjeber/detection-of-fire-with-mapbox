const mongoose = require('mongoose');
const { Schema } = mongoose;

const SenssedDataSchema = new Schema({
    deviceID: {
        type: String,
        required: true
    },
    location: {
        type: {
            longitude: {
                type: Number,
                required: true
            },
            latitude: {
                type: Number,
                required: true
            }
        },
        required: true
    },
    data: [{
        type: Schema.Types.ObjectId,
        ref: 'Data'
    }],

}, { timestamps: true });

const SenssedData = mongoose.model('SenssedData', SenssedDataSchema);

module.exports = SenssedData;
