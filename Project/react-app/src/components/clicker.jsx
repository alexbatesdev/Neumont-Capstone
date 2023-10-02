import React from 'react';
import { useState } from 'react';

export const ClickCounter = ({

}) => {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        setCount(count + 1)
    }

    return (<>
        <button onClick={handleClick} style={{ padding: '8px 16px', fontSize: '16px' }}>
            Clicked {count} times
        </button>
    </>);
}

export default ClickCounter;