import React, { useState, useCallback, useRef, useEffect, cloneElement } from 'react';
import { useTheme } from '@mui/material/styles';

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
            element: item.element,
            offset: 0,
        };
    });

    const [columns, setColumns] = useState(initialColumns);
    const [isDragging, setIsDragging] = useState(false);

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
                height: 'calc(100% - 10px)',
                display: 'flex',
                // Change flexDirection to column for vertical orientation
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                backgroundColor: theme.palette.background.default,
                borderRadius: theme.shape.borderRadius,
                padding: '5px',
            }}
        >
            {columns.map((column, index) => (
                <>
                    <div
                        key={column.id + "-column"}
                        style={{
                            overflow: 'hidden',
                            border: `1px solid ${theme.palette.divider.default}`,
                            borderRadius: theme.shape.borderRadius,
                            position: 'relative',
                            backgroundColor: theme.palette.background.paper,
                            width: 'calc(100% - 12px)',
                            // Change from width to height for vertical orientation
                            height: `calc(((${containerHeight}px - (2 * 5px) - (2 * ${columns.length}px) - ((${columns.length} - 1) * 14px)) / ${columns.length}) - ${column.offset}px)`,
                        }}
                    >
                        {cloneElement(column.element, { style: { width: '100%', height: '100%' } })}
                    </div>
                    {index < columns.length - 1 ? (
                        <div
                            key={column.id + "-divider"}
                            onMouseDown={(event) => handleMouseDown(event, index)}
                            style={{
                                // Change from width to height for vertical orientation
                                height: '8px',
                                width: '100%',
                                margin: '3px 0',
                                zIndex: 1,
                                // Change cursor to 'row-resize' for vertical orientation
                                cursor: 'row-resize',
                                backgroundColor: theme.palette.divider.secondary,
                                borderRadius: theme.shape.borderRadius,
                            }}
                        ></div>
                    ) : null}
                </>
            ))}
        </div>
    );
};