// A GPT-4 generated component
// I poked and prodded at for a while until it wrote the functionality I wanted
// I then styled and reworked a large portion of it.
import React, { useState, useCallback, useRef, useEffect, Children, cloneElement } from 'react';
import { ConversationWindow } from './conversationWindow';
import { Card } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Refactor so the columns use pixels instead of percentages 💭
const ResizableGrid = ({ children, initialColumnComponents: initialColumns = [{ id: 0, width: 50 }, { id: 1, width: 50 }] }) => {
    const containerRef = useRef(null);
    const [columns, setColumns] = useState(initialColumns);
    const startX = useRef(0);
    const startWidths = useRef([]);
    const [isDragging, setIsDragging] = useState(false);
    const [lineStart, setLineStart] = useState({ x: 0, y: 0 });
    const [lineEnd, setLineEnd] = useState({ x: 0, y: 0 });
    const theme = useTheme();

    const gridContainerStyle = {
        display: 'flex',
        width: 'calc(100% - 20px)',
        padding: '10px',
        // Refactor so component has a static height and width 💭
        minHeight: '650px',
        height: '650px',
        backgroundColor: theme.palette.background.default,
        borderRadius: theme.shape.borderRadius,
    };

    const columnStyle = (width) => ({
        flexGrow: 1,
        flexBasis: `${width}%`,
        overflow: 'hidden',
        padding: '8px',
        border: `1px solid ${theme.palette.divider.default}`,
        borderRadius: theme.shape.borderRadius,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
    });
    const dividerStyle = {
        cursor: 'col-resize',
        backgroundColor: theme.palette.divider.default,
        borderRadius: theme.shape.borderRadius,
        width: '8px',
        height: '100%',
        margin: '0 3px',
        zIndex: 1
    };

    const SpiderWebLine = ({ start, end }) => {
        const points = 100; // Number of points to calculate
        const frequency = 3; // Number of waves
        const amplitude = 10; // Height of waves
        const pathData = Array.from({ length: points }, (_, i) => {
            const x = start.x + (end.x - start.x) * (i / (points - 1));
            const y = start.y + (end.y - start.y) * (i / (points - 1)) + (amplitude * 0.5) * Math.sin((frequency * 1.2) * (i / points) * 2 * Math.PI);
            return `${x},${y}`;
        }).join(' ');
        const pathData2 = Array.from({ length: points }, (_, i) => {
            const x = start.x + (end.x - start.x) * (i / (points - 1));
            const y = start.y + (end.y - start.y) * (i / (points - 1)) + (amplitude * 0.2) * Math.sin((frequency * 1.5) * (i / points) * 2 * Math.PI);
            return `${x},${y}`;
        }).join(' ');
        const pathData3 = Array.from({ length: points }, (_, i) => {
            const x = start.x + (end.x - start.x) * (i / (points - 1));
            const y = start.y + (end.y - start.y) * (i / (points - 1)) + (amplitude * 0.3) * Math.sin((frequency * 1) * (i / points) * 2 * Math.PI);
            return `${x},${y}`;
        }).join(' ');

        return (<>
            {/* Comment out the polylines to remove spider effect */}
            <polyline style={{ zIndex: 3 }} points={pathData} fill="none" stroke="#A1B9C8" strokeWidth={3} />;
            <polyline style={{ zIndex: 3 }} points={pathData} fill="none" stroke="#e3f4ff" strokeWidth={2} />;
            <line style={{ zIndex: 3 }} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="#A1B9C8" strokeWidth={4} />
            <line style={{ zIndex: 3 }} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="#e3f4ff" strokeWidth={3} />
            <polyline style={{ zIndex: 3 }} points={pathData2} fill="none" stroke="#A1B9C8" strokeWidth={3} />;
            <polyline style={{ zIndex: 3 }} points={pathData3} fill="none" stroke="#A1B9C8" strokeWidth={3} />;

            <polyline style={{ zIndex: 3 }} points={pathData2} fill="none" stroke="#e3f4ff" strokeWidth={2} />;
            <polyline style={{ zIndex: 3 }} points={pathData3} fill="none" stroke="#e3f4ff" strokeWidth={2} />;
        </>)
    };

    useEffect(() => {
        // This effect will run when isDragging changes.
        // It sets or removes the 'user-select: none' style on the body element
        if (isDragging) {
            document.body.style.userSelect = 'none';
        } else {
            document.body.style.userSelect = '';
        }

        // Cleanup function to remove the style when the component unmounts
        return () => {
            document.body.style.userSelect = '';
        };
    }, [isDragging]); // This effect depends on isDragging

    const handleMouseDown = useCallback((index) => (e) => {
        setIsDragging(true);
        startX.current = e.clientX;
        startWidths.current = [
            columns[index].width * containerRef.current.clientWidth / 100,
            columns[index + 1].width * containerRef.current.clientWidth / 100,
        ];

        const target = e.target;
        const targetElevation = e.clientY;


        const handleMouseMove = (e) => {
            const deltaX = e.clientX - startX.current;
            const newLeftWidth = startWidths.current[0] + deltaX;
            const newRightWidth = startWidths.current[1] - deltaX;

            const dividerRect = target.getBoundingClientRect();
            const dividerCenterX = dividerRect.right - (parseInt(dividerStyle.width, 10) / 2);
            const dividerCenterY = (dividerRect.top + dividerRect.bottom) / 2;
            setLineStart({ x: dividerCenterX, y: targetElevation });
            setLineEnd({ x: e.clientX, y: e.clientY });
            setLineEnd({ x: e.clientX, y: e.clientY });



            const totalWidth = newLeftWidth + newRightWidth;
            setColumns((cols) => {
                const newCols = [...cols];
                newCols[index].width = (newLeftWidth * 100) / totalWidth;
                newCols[index + 1].width = (newRightWidth * 100) / totalWidth;
                return newCols;
            });
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            setIsDragging(false);
            setLineStart({ x: 0, y: 0 });
            setLineEnd({ x: 0, y: 0 });
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [columns]);

    const addColumn = () => {
        setColumns((prevColumns) => {
            const newColumnWidth = 100 / (prevColumns.length + 1);
            const adjustedColumns = prevColumns.map((column) => ({
                ...column,
                width: column.width * (1 - (1 / (prevColumns.length + 1))),
            }));
            const newId = Math.max(...prevColumns.map(col => col.id)) + 1;
            return [...adjustedColumns, { id: newId, width: newColumnWidth }];
        });
    };

    const removeColumn = (index) => {
        setColumns((prevColumns) => {
            if (prevColumns.length <= 1) return prevColumns; // Prevent removal if only one column is left
            const removedWidth = prevColumns[index].width;
            const adjustedColumns = prevColumns.filter((_, i) => i !== index).map(column => {
                column.width += (removedWidth / (prevColumns.length - 1))
                return column;
            });
            return adjustedColumns;
        });
    };

    const childrenArray = Children.toArray(children);

    return (
        <div style={{ position: 'relative' }}>
            <button onClick={addColumn}>Add Column</button>
            <button onClick={() => removeColumn(columns.length - 1)}>Remove Column</button>
            <div style={gridContainerStyle} ref={containerRef}>
                {columns.map((column, index) => (
                    <>
                        <div key={column.id} style={columnStyle(column.width)}>
                            {childrenArray[index] ? cloneElement(childrenArray[index]) : null}
                        </div>
                        {index < columns.length - 1 && (
                            <div
                                key={`divider-${column.id}`}
                                style={dividerStyle}
                                onMouseDown={handleMouseDown(index)}
                                onDoubleClick={addColumn}
                            />
                        )}
                    </>
                ))}
            </div>
            <svg style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', width: '100%', height: '100%' }}>
                {isDragging && <SpiderWebLine start={lineStart} end={lineEnd} />}
            </svg>
        </div>
    );
};

export default ResizableGrid;

