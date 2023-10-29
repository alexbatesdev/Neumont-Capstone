import React, { createContext, useState, useContext, useEffect } from "react";

export const topBarContext = createContext({
    hoverIndex: null,
    setHoverIndex: () => { },
    alternate: false,
});

export const TopBarContextProvider = ({ children, alternate }) => {
    const [hoverIndex, setHoverIndex] = useState(null);

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