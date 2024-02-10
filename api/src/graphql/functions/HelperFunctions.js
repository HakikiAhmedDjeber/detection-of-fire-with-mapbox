const SenssedData = require('../../models/SenssedData');
const Data = require('../../models/Data');

exports.saveReceivedData = async (receivedData) => {
    try {
        const objectData = JSON.parse(receivedData);
        const { deviceID, location, data } = objectData;

        console.log("======> received data:", objectData);

        // Find or create SenssedData by deviceID
        let sensedData = await SenssedData.findOne({ deviceID });

        if (!sensedData) {
            // If SenssedData doesn't exist, create a new one
            sensedData = new SenssedData({
                deviceID,
                location,
                data: []
            });
        }

        // Constructing a new Data object
        const newData = new Data({
            Temperature: data.Temperature,
            Humidity: data.Humidity,
            Gas: data.Gas,
            Air: data.Air,
            Fire: data.Fire,
            Light: data.Light
        });

        // Saving the new Data object
        const savedData = await newData.save();

        // Push the ID of the new Data object to the SenssedData's data list
        sensedData.data.push(savedData._id);

        // Saving the SenssedData
        await sensedData.save();

        console.log('Received data saved successfully.');
    } catch (error) {
        console.error('Error saving received data:', error);
    }
};
