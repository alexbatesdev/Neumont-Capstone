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
            console.log(session.data)

            function JWTExpirationDate(token) {
                if (!token) return null;
                return new Date(JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).exp * 1000);
            };

            console.log()

            const adjustedDate = new Date(JWTExpirationDate(session.data.token).toLocaleString())
            console.log(adjustedDate)
            console.log(isPastDate(adjustedDate))
            if (isPastDate(adjustedDate)) {
                console.log('expired')
                signOut()
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