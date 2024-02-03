import { createContext, useContext, useState, useEffect } from 'react';
import { useSubscription } from '@apollo/client';
import { SubscripeToTopic } from '../GraphQL/queries';

const SubscriptionContext = createContext();

export const useSubscriptionContext = () => {
    return useContext(SubscriptionContext);
};

export const SubscriptionProvider = ({ children }) => {
    const [incomingData, setIncomingData] = useState(null);

    const { data, loading, error } = useSubscription(SubscripeToTopic, {
        variables: { topicName: "testTopic" },
        onData: (options) => {
            const { data } = options;
            setIncomingData(data);
        },
        onError: (err) => {
            console.log(err);
        },
    });

    const contextValue = {
        incomingData,
        loading,
        error,
    };

    return (
        <SubscriptionContext.Provider value={contextValue}>
            {children}
        </SubscriptionContext.Provider>
    );
};
