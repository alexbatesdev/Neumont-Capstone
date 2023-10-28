import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { createContext, useState, useContext, useEffect } from "react";

export const autoSignOutContext = createContext({

});

export const AutoSignOutContextProvider = ({ children }) => {
    const session = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session.data) {
            const adjustedDate = new Date(new Date(session.data.expires).toLocaleString())
            console.log(adjustedDate)
            console.log(isPastDate(adjustedDate))
            if (isPastDate(adjustedDate)) {
                console.log('expired')
                alert("HALT")
                signOut()
                router.push('/')
            }
        }
    }, [session])

    return (
        <autoSignOutContext.Provider
            value={{}}
        >
            {children}
        </autoSignOutContext.Provider>
    );
};

function isPastDate(dateString) {
    // Create a Date object from the given date string
    const givenDate = new Date(dateString);
    // Get the current date and time
    const currentDate = new Date(new Date().toLocaleString());
    console.log(currentDate)

    // Compare the two dates
    return currentDate > givenDate;
}