import React from 'react';
import { Grid, Divider, Box, Button } from '@mui/material';
import { useState, useEffect } from 'react';

export const MyGridComponent = () => {
    const [columns, setColumns] = useState([]);

    const [isDragging, setIsDragging] = useState(false);
    const [draggedDividerIndex, setDraggedDividerIndex] = useState(null);

    const TOTAL_GRID_WIDTH_PERCENT = 100;
    const DIVIDER_WIDTH_PERCENT = 0.5;

    const handleDividerMouseDown = (index) => {
        setIsDragging(true);
        setDraggedDividerIndex(index);
    };

    const handleMouseMove = (event) => {
        if (isDragging && draggedDividerIndex !== null) {
            const deltaX = event.clientX - event.target.parentElement.getBoundingClientRect().right;
            handleDividerDrag(draggedDividerIndex, deltaX);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setDraggedDividerIndex(null);
    };

    const handleDividerDrag = (index, deltaX) => {
        setColumns((prevColumns) => {
            const updatedColumns = [...prevColumns];
            const totalWidth = updatedColumns.reduce((acc, col) => acc + col.widthPercent, 0);

            const deltaWidth = (deltaX / window.innerWidth) * TOTAL_GRID_WIDTH_PERCENT;

            if (index < updatedColumns.length - 1) {
                const nextColumnDelta = (deltaWidth / totalWidth) * updatedColumns[index].widthPercent;
                const remainingDelta = deltaWidth - nextColumnDelta;

                updatedColumns[index].widthPercent += nextColumnDelta;
                updatedColumns[index + 1].widthPercent -= remainingDelta;
            } else {
                updatedColumns[index].widthPercent += (deltaWidth / totalWidth) * 100;
            }

            return updatedColumns;
        });
    };


    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, draggedDividerIndex]);

    const insertColumn = (index = columns.length + 1, content = "Will be a component later, or need a refactor of other need") => {
        setColumns(prevColumns => {
            let columnCopy = [...prevColumns];
            columnCopy.splice(index, 0, {
                id: index,
                widthPercent: 0,
                content: content
            });
            return updateColumnWidths(columnCopy);
        });
    }

    const removeColumn = (index = columns.length - 1) => {
        let columnCopy = [...columns];
        columnCopy.splice(index, 1);
        setColumns(updateColumnWidths(columnCopy));
    }

    const updateColumnWidths = (columns) => {
        const totalColumns = columns.length;
        const remainingWidth = TOTAL_GRID_WIDTH_PERCENT - (totalColumns);
        console.log(remainingWidth)
        const widthPercent = (remainingWidth / totalColumns);
        console.log(widthPercent)

        columns.forEach((element) => {
            element.widthPercent = widthPercent;
        });

        return columns;
    };

    useEffect(() => {
        const initialColumns = [
            {
                id: 0,
                widthPercent: 50,
                content: 'Column 1' // This will be a component
            },
            {
                id: 1,
                widthPercent: 50,
                content: 'Column 2'
            }
        ]

        setColumns(updateColumnWidths(initialColumns));
    }, []);

    return (
        <>
            <Button onClick={() => insertColumn(columns.length + 1)}>Insert Column</Button>
            <Button onClick={() => removeColumn(columns.length - 1)}>Remove Column</Button>
            <Grid container style={{
                flexDirection: 'row',
                minHeight: "500px",
                outline: "solid 1px red",
                width: "80%",
            }}>
                <Box
                    sx={{
                        cursor: 'col-resize',
                        backgroundColor: 'darkgray',
                        flexGrow: 1,
                    }}
                    onClick={() => { console.log("Clicked " + 0) }}
                />
                {columns.map((column, index) => (<>
                    {console.log(column)}
                    <div key={column.id} style={{ width: `${column.widthPercent}%`, outline: 'solid 1px green' }}>
                        {column.content}
                    </div>
                    {index < columns.length - 1 && (
                        <Divider
                            orientation="vertical"
                            flexItem
                            sx={{
                                cursor: 'col-resize',
                                backgroundColor: 'darkgray',
                                width: `${DIVIDER_WIDTH_PERCENT}%`,
                            }}
                            onContextMenu={(event) => {
                                event.preventDefault(); // Prevent right-click context menu
                                removeColumn(index + 1); // Remove column on right-click
                            }}
                            onClick={(event) => {
                                event.preventDefault();
                                // Insert column on left-click
                                if (event.button === 0) {
                                    insertColumn(index + 1);
                                }
                            }}
                            onMouseDown={(event) => {
                                // //prevent right click menu
                                // event.preventDefault()
                                handleDividerMouseDown(index)
                            }}
                        />
                    )}
                </>))}
                <Box
                    orientation='vertical'
                    flexItem
                    sx={{
                        cursor: 'col-resize',
                        backgroundColor: 'darkgray',
                        flexGrow: 1,
                    }}
                    onClick={() => { insertColumn(columns.length + 1) }}
                />
            </Grid>
        </>
    );
}

export default MyGridComponent;
