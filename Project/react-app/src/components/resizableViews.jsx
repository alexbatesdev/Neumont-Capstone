import React, { useState, useCallback, useRef, useEffect, cloneElement } from 'react';
import { useTheme } from '@mui/material/styles';

export const ResizableViewsHorizontal = ({ items }) => {
    const theme = useTheme();
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0); //assistant generated code
    const [isDragging, setIsDragging] = useState(false);
    const dragShieldRef = useRef(null);

    const initialColumns = items.map((item, index) => {
        return {
            id: item.slot,
            component: item.component,
            offset: 0,
        }
    });

    const [columns, setColumns] = useState(initialColumns);

    // assistant generated code
    useEffect(() => {
        const containerElement = containerRef.current;

        // Callback for ResizeObserver
        const handleResize = (entries) => {
            if (!Array.isArray(entries) || !entries.length) {
                return;
            }

            // Update the state with the new clientWidth
            setContainerWidth(entries[0].target.clientWidth);
        };

        // Create and attach ResizeObserver
        const resizeObserver = new ResizeObserver(handleResize);

        if (containerElement) {
            resizeObserver.observe(containerElement);
        }

        // Cleanup: detach ResizeObserver on unmount
        return () => {
            resizeObserver.unobserve(containerElement);
        };
    }, []); // Empty dependency array means this effect runs once after the initial render
    // end assistant generated code

    // Assistant-generated code starts here
    // This component originated as a component almost entirely made by gpt 3
    // I then decided to go with a different approach that was still based off the original
    // I then asked gpt 4 to improve this function of mine because it was having slightly unexpected behavior
    // A lot of back and forth is going on with a lot of these components
    const handleMouseDown = useCallback((event, index) => {
        event.preventDefault();

        // Human Addition
        setIsDragging(true);

        // Get the initial mouse position
        let lastX = event.clientX;
        let startX = event.clientX;

        // Polish: Add a clear overlay on top of the iframe when dragging to prevent the iframe from capturing mouse events 💭

        const handleMouseMove = (event) => {
            // Calculate deltaX as the difference between the current and last clientX
            const deltaX = event.clientX - lastX;
            const totalDeltaX = event.clientX - startX;
            console.log("totalDeltaX")
            console.log(totalDeltaX)

            // Update lastX for the next move event
            lastX = event.clientX;

            console.log("deltaX")
            console.log(deltaX);

            // Human Addition
            // Update the drag shield
            dragShieldRef.current.style.left = `${event.clientX}px`;
            console.log("event.clientX")
            dragShieldRef.current.style.top = `${event.clientY}px`;
            console.log("event.clientY")

            // Update the columns offsets based on deltaX
            setColumns((cols) => {
                const newCols = [...cols];
                newCols[index].offset -= deltaX; // Update according to the speed
                newCols[index + 1].offset += deltaX; // Update according to the speed
                return newCols;
            });
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            // Human Addition
            setIsDragging(false);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [columns]);
    // Assistant-generated code ends here



    return (<div
        ref={containerRef}
        style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            backgroundColor: theme.palette.background.default,
            borderRadius: theme.shape.borderRadius,
            // padding: '5px',
        }}>
        {columns.map((column, index) => {
            return (<>
                <div key={column.id + "-column"} style={{
                    overflow: 'hidden',
                    // border: `1px solid ${theme.palette.divider.default}`,
                    borderRadius: theme.shape.borderRadius,
                    // position: 'relative',
                    backgroundColor: theme.palette.background.paper,
                    height: '100%',
                    width: `calc(((${containerWidth}px - ((${columns.length} - 1) * 8px)) / ${columns.length}) - ${column.offset}px)`
                }}>
                    {cloneElement(column.component, { style: { width: '100%', height: '100%' } })}
                </div>
                {index < columns.length - 1 ? <div
                    key={column.id + "-divider"}
                    onMouseDown={(event) => handleMouseDown(event, index)}
                    style={{
                        width: '8px',
                        height: '100%',
                        // margin: '0 3px',
                        zIndex: 1,
                        cursor: 'col-resize',
                        backgroundColor: theme.palette.divider.default,
                        borderRadius: theme.shape.borderRadius,
                    }}></div> : null}
                {isDragging && <div ref={dragShieldRef} style={{
                    width: "300px",
                    height: "100px",
                    position: "absolute",
                    // backgroundColor: "red",
                    zIndex: 100,
                    transform: "translate(-50%, -50%)",
                }}></div>}
            </>)
        })}

    </div>)
}

// Delineator /////////////////////////////////////////////////// Delineator /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ResizableViewsVertical = ({ items }) => {
    const theme = useTheme();
    const containerRef = useRef(null);

    // Assistant-generated code starts here
    // Change from containerWidth to containerHeight
    const [containerHeight, setContainerHeight] = useState(0);
    // Assistant-generated code ends here

    const initialColumns = items.map((item, index) => {
        return {
            id: item.slot,
            component: item.component,
            offset: 0,
        };
    });

    const [columns, setColumns] = useState(initialColumns);
    const [isDragging, setIsDragging] = useState(false);
    const dragShieldRef = useRef(null);

    // Assistant-generated code starts here
    useEffect(() => {
        const containerElement = containerRef.current;
        const handleResize = (entries) => {
            if (!Array.isArray(entries) || !entries.length) {
                return;
            }
            // Change from clientWidth to clientHeight
            setContainerHeight(entries[0].target.clientHeight);
        };

        const resizeObserver = new ResizeObserver(handleResize);

        if (containerElement) {
            resizeObserver.observe(containerElement);
        }

        return () => {
            resizeObserver.unobserve(containerElement);
        };
    }, []);
    // Assistant-generated code ends here

    // Assistant-generated code starts here
    const handleMouseDown = useCallback((event, index) => {
        event.preventDefault();
        setIsDragging(true);

        // Change from clientX to clientY for vertical dragging
        let lastY = event.clientY;
        let startY = event.clientY;

        const handleMouseMove = (event) => {
            // Change from clientX to clientY for vertical dragging
            const deltaY = event.clientY - lastY;
            const totalDeltaY = event.clientY - startY;

            lastY = event.clientY;

            // Human Addition
            // Update the drag shield
            dragShieldRef.current.style.left = `${event.clientX}px`;
            console.log("event.clientX");
            dragShieldRef.current.style.top = `${event.clientY}px`;
            console.log("event.clientY");

            setColumns((cols) => {
                const newCols = [...cols];
                newCols[index].offset -= deltaY;
                newCols[index + 1].offset += deltaY;
                return newCols;
            });
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            setIsDragging(false);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [columns]);
    // Assistant-generated code ends here

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: 'calc(100%)',
                display: 'flex',
                // Change flexDirection to column for vertical orientation
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                backgroundColor: theme.palette.background.default,
                borderRadius: theme.shape.borderRadius,
                // padding: '5px',
            }}
        >
            {columns.map((column, index) => (
                <>
                    <div
                        key={column.id + "-column"}
                        style={{
                            overflow: 'hidden',
                            // border: `1px solid ${theme.palette.divider.default}`,
                            borderRadius: theme.shape.borderRadius,
                            position: 'relative',
                            backgroundColor: theme.palette.background.paper,
                            width: 'calc(100%)',
                            // Change from width to height for vertical orientation
                            height: `calc(((${containerHeight}px - ((${columns.length} - 1) * 8px)) / ${columns.length}) - ${column.offset}px)`,
                        }}
                    >
                        {cloneElement(column.component, { style: { width: '100%', height: '100%' } })}
                    </div>
                    {index < columns.length - 1 ? (
                        <div
                            key={column.id + "-divider"}
                            onMouseDown={(event) => handleMouseDown(event, index)}
                            style={{
                                // Change from width to height for vertical orientation
                                height: '8px',
                                width: '100%',
                                zIndex: 1,
                                // Change cursor to 'row-resize' for vertical orientation
                                cursor: 'row-resize',
                                backgroundColor: theme.palette.divider.default,
                                borderRadius: theme.shape.borderRadius,
                            }}
                        ></div>
                    ) : null}
                    {isDragging && <div ref={dragShieldRef} style={{
                        width: "100px",
                        height: "300px",
                        position: "absolute",
                        // backgroundColor: "red",
                        zIndex: 100,
                        transform: "translate(-50%, -50%)",
                    }}></div>}
                </>
            ))}
        </div>
    );
};
