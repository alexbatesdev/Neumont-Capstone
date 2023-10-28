import { useSession } from "next-auth/react";
import React, { createContext, useState, useContext, useEffect } from "react";

export const autoSignOutContext = createContext({

});

export const AutoSignOutContextProvider = ({ children }) => {
    const session = useSession()

    useEffect(() => {
        if (session.data) {

            console.log(session.data.expires)
            console.log(isPastDate(session.data.expires))
        }
    }, [session])

    return (
        <autoSignOutContext.Provider>
            {children}
        </autoSignOutContext.Provider>
    );
};

function isPastDate(dateString) {
    // Create a Date object from the given date string
    const givenDate = new Date(dateString);
    // Get the current date and time
    const currentDate = new Date();

    // Compare the two dates
    return currentDate > givenDate;
}