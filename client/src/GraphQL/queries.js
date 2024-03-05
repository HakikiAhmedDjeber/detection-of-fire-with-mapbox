import { gql } from "@apollo/client";

export const SubscripeToTopic = gql`
  subscription ($topicName: String!) {
    subscriptionTest(topicName: $topicName)
  }
`;

export const GET_ALL_SENSSED_DATA_BY_DEVICE = gql`
  query GetAllSenssedDataByDevice($deviceId: String) {
    GetAllSenssedDataByDevice(deviceID: $deviceId) {
      id
      deviceID
      location {
        latitude
        longitude
      }
      data {
        id
        Temperature
        Humidity
        Gas
        Air
        Fire
        Light
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_SENSSED_DATA = gql`
  query GetAll {
    GetAll {
      id
      deviceID
      location {
        longitude
        latitude
      }
      data {
        id
        Temperature
        Humidity
        Gas
        Air
        Fire
        Light
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const GET_ONLYIDs = gql`
  query GetAll {
    GetAll {
      deviceID
      location {
        latitude
        longitude
      }
    }
  }
`;
