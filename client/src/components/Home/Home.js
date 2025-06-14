import React, { useState, useEffect } from "react";
import "../../App.css";
import Map from "./Map";
import Sidebar from "./Sidebar";
import Chart from "./Chart";
import { useSubscriptionContext } from "../../Context/SubscriptionContext";
import { useLazyQuery } from "@apollo/client";
import {
  GET_ALL_SENSSED_DATA,
  GET_ALL_SENSSED_DATA_BY_DEVICE,
  GET_ONLYIDs,
} from "../../GraphQL/queries";

// const local = [
//   { longitude: -0.6408584, latitude: 35.222364 },
//   { longitude: -0.6408584, latitude: 35.2223644 },
// ];

const local = [
  ,
  ,
  {
    longitude: -0.64085,
    latitude: 35.222363,
  },

  ,
  ,
  ,
  { longitude: -0.6408584, latitude: 35.22 },
  ,
  { longitude: -0.65, latitude: 35.2223644 },
];
export default function Home() {
  const [SensorData, setSensorData] = useState(null);
  const [regionName, setRegionName] = useState("");
  const [isChartOpen, setIsChartOpen] = useState(false);
  const { incomingData, loading, error } = useSubscriptionContext();
  const [allSensorsIds, setAllSensorsIds] = useState([]);
  // set sensor id
  const [sensorId, setSensorId] = useState(null);

  function handleSensorId(id) {
    setSensorId(id);
  }

  const [
    getAllSenssedData,
    { loading: isLoading, data: responseData, error: queryError },
  ] = useLazyQuery(GET_ALL_SENSSED_DATA); //  ADD new this will fetch allll historic
  const [
    getAllIds,
    { loading: isLoadingIds, data: responseDataIds, error: queryErrorIds },
  ] = useLazyQuery(GET_ONLYIDs); //  ADD new this will fetch allll historic

  const [
    getAllSenssedDataByDevice,
    { loading: isDLoading, data: DeviceResponseData, error: queryDeviceError },
  ] = useLazyQuery(GET_ALL_SENSSED_DATA_BY_DEVICE); //  ADD new this will fetch all data by deviceID

  useEffect(() => {
    getAllIds(); // fetching all records data of all sensors from backend database
    getAllSenssedData(); // fetching all records data of all sensors from backend database

    getAllSenssedDataByDevice({ variables: { deviceId: "123" } }); // excute fetch data only for single device
  }, []);

  useEffect(() => {
    if (!isLoadingIds) {
      if (responseDataIds) {
        console.log("Recieved Ids and location ==> ", responseDataIds);
        const allSensors = responseDataIds.GetAll.map((ele, id) => {
          return {
            id: ele.deviceID,
            location: local[ele.deviceID - 1],
          };
        });
        setAllSensorsIds(uniqueById(allSensors));
      }
    }
  }, [responseDataIds]);

  // useEffect(() => {
  //   if (!isLoading) {
  //     if (queryError) {
  //       console.log(queryError);
  //     }
  //     if (responseData) {
  //       console.log("Recieved Data ==> ", responseData);
  //       // Get all sensor IDs
  //       const allSensors = responseData.GetAll.map((ele) => ({
  //         id: ele.deviceID,
  //         location: ele.location,
  //       }));
  //       setAllSensorsIds(uniqueById(allSensors));
  //     }
  //   }
  // }, [isLoading, responseData, queryError]);

  useEffect(() => {
    if (!isDLoading) {
      if (queryDeviceError) {
        console.log(queryDeviceError);
      }
      if (DeviceResponseData) {
        console.log(
          "Recieved Data from single device ==> ",
          DeviceResponseData
        );
      }
    }
  }, [isDLoading, DeviceResponseData, queryDeviceError]);

  function handleChartOpen() {
    setIsChartOpen(!isChartOpen);
  }
  function handleRegionName(name) {
    setRegionName(name);
  }

  // viewport
  const [viewport, setViewport] = useState({
    longitude: -0.6408584,
    latitude: 35.2223642,
    zoom: 14.8,
  });

  function handleViewport(view) {
    setViewport(view);
  }
  useEffect(() => {
    if (incomingData) {
      let temp = incomingData?.data?.subscriptionTest;
      setSensorData(temp);
      console.log(temp);
      console.log(typeof temp);
    }
  }, [incomingData]);

  return (
    <main className="main">
      <Sidebar
        region={regionName}
        selectSensor={handleViewport}
        allSensors={allSensorsIds}
      />
      <Map
        sensorData={JSON.parse(SensorData)}
        regionName={regionName}
        setRegionName={handleRegionName}
        viewport={viewport}
        setViewport={setViewport}
        handleChart={handleChartOpen}
        onSensorId={handleSensorId}
        allSensors={allSensorsIds}
        incomingData={JSON.parse(SensorData)}
      />
      <Chart
        chartOpen={isChartOpen}
        handleChart={handleChartOpen}
        sensorId={sensorId}
        sensorData={JSON.parse(SensorData)}
      />
    </main>
  );
}

// Define a custom comparison function based on the id property
const uniqueById = (array) => {
  const seen = new Set();
  return array.filter((obj) => {
    if (!seen.has(obj.id)) {
      seen.add(obj.id);
      return true;
    }
    return false;
  });
};
