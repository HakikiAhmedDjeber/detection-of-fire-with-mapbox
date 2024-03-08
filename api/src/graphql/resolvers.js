const SenssedData = require("../models/SenssedData");
const Data = require("../models/Data");
const moment = require("moment");
const pubsub = require("./utils/pubsub");

module.exports = {
  Query: {
    GetAll: async () => {
      try {
        // Fetch all SenssedData documents and populate the 'data' field
        const allSenssedData = await SenssedData.find().populate("data");
        return allSenssedData;
      } catch (error) {
        console.error("Error fetching SenssedData:", error);
        throw new Error("Failed to fetch SenssedData.");
      }
    },
    GetAllSenssedDataByDevice: async (_, { deviceID }) => {
      try {
        // Query SenssedData document by deviceID and populate the 'data' field
        const senssedData = await SenssedData.findOne({ deviceID }).populate(
          "data"
        );

        // If no SenssedData is found, throw an error
        if (!senssedData) {
          throw new Error("SenssedData not found for the specified deviceID.");
        }

        // Return the found SenssedData document
        return senssedData;
      } catch (error) {
        console.error("Error fetching SenssedData:", error);
        throw new Error("Failed to fetch SenssedData.");
      }
    },
    GetAllSenssedDataByDeviceInTimeRange: async (
      _,
      { deviceID, from, until }
    ) => {
      try {
        // Convert the 'from' and 'until' strings to Date objects
        const fromDate = new Date(from);
        const untilDate = new Date(until);

        // Query SenssedData documents by deviceID
        const senssedData = await SenssedData.aggregate([
          {
            $match: { deviceID },
          },
          {
            $lookup: {
              from: "Data", // Assuming the collection name is 'Data'
              localField: "data",
              foreignField: "_id",
              as: "data",
            },
          },
          {
            $match: {
              "data.createdAt": { $gte: fromDate, $lte: untilDate },
            },
          },
        ]);

        // If no SenssedData is found, throw an error
        if (!senssedData || senssedData.length === 0) {
          throw new Error(
            "SenssedData not found for the specified deviceID and time range."
          );
        }

        // Return the found SenssedData document
        return senssedData[0]; // Assuming only one SenssedData document is expected
      } catch (error) {
        console.error("Error fetching SenssedData:", error);
        throw new Error("Failed to fetch SenssedData.");
      }
    },

    GetDataAverage: async (_, { SecondsValue }) => {
      try {
        // Calculate the time 5 seconds ago
        const fiveSecondsAgo = moment()
          .subtract(SecondsValue, "seconds")
          .toDate();

        // Fetch SenssedData documents with 'createdAt' timestamp greater than or equal to fiveSecondsAgo and populate the 'data' field
        const allSenssedData = await SenssedData.find({
          updatedAt: { $gte: fiveSecondsAgo },
        }).populate("data");

        let sumTemperature = 0;
        let sumHumidity = 0;
        let sumGas = 0;
        let sumAir = 0;
        let sumLight = 0;

        if (allSenssedData[0]?.data) {
          let savedDataList = allSenssedData[0].data;
          savedDataList.forEach((dataObj) => {
            sumTemperature += dataObj.Temperature;
            sumHumidity += dataObj.Humidity;
            sumGas += dataObj.Gas;
            sumAir += dataObj.Air;
            sumLight += dataObj.Light;
          });
          const numData = savedDataList.length;

          // Calculate averages
          const TemperatureAvg = (sumTemperature / numData).toFixed(5);
          const HumidityAvg = (sumHumidity / numData).toFixed(5);
          const GasAvg = (sumGas / numData).toFixed(5);
          const AirAvg = (sumAir / numData).toFixed(5);
          const LightAvg = (sumLight / numData).toFixed(5);

          return {
            Count: allSenssedData.length,
            TemperatureAvg,
            HumidityAvg,
            GasAvg,
            AirAvg,
            LightAvg,
          };
        }

        return allSenssedData;
      } catch (error) {
        console.error("Error fetching SenssedData:", error);
        throw new Error("Failed to fetch SenssedData.");
      }
    },
  },

  Mutation: {
    async sayToUserX(_, { userId, message }) {
      await pubsub.publish(userId, { message });
      return true;
    },
  },
  Subscription: {
    subscriptionTest: {
      subscribe: (_parent, { topicName }, _context, _info) => {
        const asyncIterator = pubsub.asyncIterator(topicName);
        return asyncIterator;
      },
      resolve: (payload) => {
        // This function is called whenever a new event is published
        // console.log(payload)
        return payload; // Assuming message is the field you want to return
      },
    },
  },
};
