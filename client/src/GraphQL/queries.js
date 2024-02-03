import { gql } from "@apollo/client";

export const SubscripeToTopic = gql`
  subscription ($topicName: String!) {
    subscriptionTest(topicName: $topicName)
  }
  `