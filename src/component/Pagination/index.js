import React from 'react';
import { IconsButton } from "component"
export default function Pagination(props) {
    const { disabled_next = true, disabled_prev = true, onChange = null,batchVal=null } = props;
    return (<div style={{ width: '32px' }}>
        <IconsButton style={{ color: disabled_prev ? "" : '#606060' }} type="ArrowBackIosIcon" disabled={disabled_prev} onClick={() => onChange("prev",batchVal)} />
        <IconsButton style={{ color: disabled_next ? "" : '#606060' }} type="ArrowForwardIosIcon" disabled={disabled_next} onClick={() => onChange("next",batchVal)} />
    </div>)
}