import React, { createContext, useState, useContext, useEffect } from "react";

// Alternate way of annotating the context
// type TopBarContextProps = {
//     hoverIndex: null | number;
//     setHoverIndex: React.Dispatch<null | number>;
//     alternate: boolean;
// }
// I promise I'm going to settle on a style

export const topBarContext = createContext({
    hoverIndex: null as null | number,
    setHoverIndex: (value: null | number) => { },
    alternate: false as boolean,
});

type TopBarContextProviderProps = {
    children: React.ReactNode;
    alternate: boolean;
}

export const TopBarContextProvider = ({ children, alternate }: TopBarContextProviderProps) => {
    const [hoverIndex, setHoverIndex] = useState<null | number>(null);

    return (
        <topBarContext.Provider
            value={{
                hoverIndex,
                setHoverIndex,
                alternate,
            }}
        >
            {children}
        </topBarContext.Provider>
    );
}

export const useTopBarContext = () => {
    return useContext(topBarContext);
}