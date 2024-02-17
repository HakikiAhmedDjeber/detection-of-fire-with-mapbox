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
} from "../../GraphQL/queries";

export default function Home() {
  const [SensorData, setSensorData] = useState(null);
  const [regionName, setRegionName] = useState("");
  const [isChartOpen, setIsChartOpen] = useState(false);
  const { incomingData, loading, error } = useSubscriptionContext();

  const [
    getAllSenssedData,
    { loading: isLoading, data: responseData, error: queryError },
  ] = useLazyQuery(GET_ALL_SENSSED_DATA); //  ADD new this will fetch allll historic
  const [
    getAllSenssedDataByDevice,
    { loading: isDLoading, data: DeviceResponseData, error: queryDeviceError },
  ] = useLazyQuery(GET_ALL_SENSSED_DATA_BY_DEVICE); //  ADD new this will fetch all data by deviceID

  useEffect(() => {
    getAllSenssedData(); // fetching all records data of all sensors from backend database

    getAllSenssedDataByDevice({ variables: { deviceId: "123" } }); // excute fetch data only for single device
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (queryError) {
        console.log(queryError);
      }
      if (responseData) {
        console.log("Recieved Data ==> ", responseData);
      }
    }
  }, [isLoading, responseData, queryError]);

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
    longitude: -0.41551,
    latitude: 35.20779,
    zoom: 12,
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
      <Sidebar region={regionName} selectSensor={handleViewport} />
      <Map
        sensorData={JSON.parse(SensorData)}
        regionName={regionName}
        setRegionName={handleRegionName}
        viewport={viewport}
        setViewport={setViewport}
        handleChart={handleChartOpen}
      />
      <Chart chartOpen={isChartOpen} handleChart={handleChartOpen} />
    </main>
  );
}
