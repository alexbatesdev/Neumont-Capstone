import React from 'react';
import { useState } from 'react';
import ReactNode from 'react-dom';

export const LightSwitch = ({
    isOn,
    setIsOn
}) => {


    const handleToggle = () => {
        setIsOn(!isOn);
    }

    return (<>
        <div style={{
            display: 'inline-block',
            backgroundColor: isOn ? 'white' : 'gray',
            borderRadius: '50%',
            width: '100px',
            height: '50px',
            cursor: 'pointer',
            boxShadow: '0 0 2px 2px rgba(0, 0, 0, 0.2)',
            transition: 'background-color 0.3s'
        }} onClick={handleToggle}>
            <div style={{
                backgroundColor: isOn ? 'green' : 'red',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                margin: '10px',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
                transform: isOn ? 'translateX(50px)' : 'none',
                transition: 'transform 0.3s'
            }}>
            </div>
        </div>
    </>);
}

export default LightSwitch;
