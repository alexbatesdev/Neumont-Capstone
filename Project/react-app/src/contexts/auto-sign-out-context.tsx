import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { createContext, useState, useContext, useEffect } from "react";

export const autoSignOutContext = createContext({

});

interface AutoSignOutContextProps {
    children: React.ReactNode;
}

// I've been a little inconsistent with these type annotating methods, but I'm just trying them all out to find what I think is most readable
export const AutoSignOutContextProvider = ({ children }: AutoSignOutContextProps) => {
    const session = useSession();
    const router = useRouter();

    useEffect(() => {
        console.log(session)
        if (session.data) {
            const adjustedDate: Date = new Date(new Date(session.data.expires).toLocaleString())
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

function isPastDate(date: Date) {
    // Create a Date object from the given date string
    const givenDate = new Date(date);
    // Get the current date and time
    const currentDate = new Date(new Date().toLocaleString());
    console.log(currentDate)

    // Compare the two dates
    return currentDate > givenDate;
}