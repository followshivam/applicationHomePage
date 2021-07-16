import React from "react"
import { Draggable } from "react-beautiful-dnd"

const POC = (props) => {


    return (
        <React.Fragment>
            {props.data.map((item, index) => {
                console.log(item)
                return (
                    < React.Fragment key={index} index={index} >
                        {/* {(provided, snapshot) => ( */}

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            // border: active === parseInt(item.unique_id) ? `1px solid #0072C6` : null,
                            // backgroundColor: active === parseInt(item.unique_id) ? '#E6F4F1' : null,
                        }}>
                            <div
                            // onClick={() => onClickHandler(item.unique_id)}
                            >
                                {item.component}
                            </div>

                        </div>


                    </React.Fragment>
                )
            }
            )
            }
        </React.Fragment >
    )
}

export default POC