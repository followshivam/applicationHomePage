import { IconsButton, makeStyles } from "component";
import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const useStyles = makeStyles(theme => ({

    comp: {
        width: '100%',

    },
img:{
    marginRight:"20px"
}


}));
const grid = 8;

const getItemStyle = (isDragging, draggableStyle, name) => ({
    // some basic styles to make the items look a bit nicer, will be extended to take dynamic values if required
    userSelect: "none",
    padding: 2,
    margin: name === 'table' ? '0 0 4px 0' : `0 0 ${grid}px 0`,
    outline: "none",
    border: "none",
    cursor: name === 'table' ? 'default' : 'grab',
    // change background colour if dragging, will be extended to take dynamic values if required
    background: isDragging ? "#FF66001A" : "white",

    // styles we need to apply on draggables
    ...draggableStyle
})

const getListStyle = (isDraggingOver, name) => ({
    background: name === 'table' ? "#F8F8F8" : isDraggingOver ? "#F8F8F8" : "white",
    padding: name === 'table' ? 0 : grid,
    // width: "calc(100% - 16px)",
    // height: 'calc(100% - 16px)'
});

const RowDragger = props => {
    const classes = useStyles();

    let {
        data = [],
        onChange = () => console.error('RowDragger: You forgot to pass onChange()'),
        active = -999,
        onClickHandler = () => console.error('RowDragger: You forgot to pass onClickHandler()'),
        displayDraggerIcon = true,
        name = ''
    } = props;

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        onChange(result, startIndex, endIndex)
    };

    const onDragEnd = (result) => {
        // console.log(result)

        if (!result.destination) {
            return;
        }

        reorder(
            data,
            result.source.index,
            result.destination.index
        );


    }


    return <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
            {(provided, snapshot) => (
                <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver, name)}
                >
                    {data.map((item, index) => (
                        <Draggable key={item.unique_id} draggableId={item.unique_id} index={index}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={getItemStyle(
                                        snapshot.isDragging,
                                        provided.draggableProps.style,
                                        name
                                    )}
                                >
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        border: active === parseInt(item.unique_id) ? `1px solid #0072C6` : null,
                                        backgroundColor: active === parseInt(item.unique_id) ? '#E6F4F1' : null,
                                    }}>
                                        {displayDraggerIcon ? <IconsButton className={displayDraggerIcon?classes.img:''} type='DragIndicatorIcon' /> : null}
                                        <div className={classes.comp}
                                            onClick={() => onClickHandler(item.unique_id)}>
                                            {item.component}
                                        </div>

                                    </div>
                                </div>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    </DragDropContext >
}

export default RowDragger;