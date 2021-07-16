import React from "react";
import { Button, Typography } from "@material-ui/core";


const NotFound = props => {

    const {
        iconSize = '100px',
        message = '',
        messageFontSize = "14px",
        messageFontWeight = 300,
        messageColor,
        backgroundColor,
        iconUrl = `${process.env.REACT_APP_CONTEXT_PATH}/icons/no_component_preview.svg`,
        title = '',
        titleFontSize = "16px",
        titleFontWeight = 800,
        actionButtons = [],
        descComponent = null,
        direction = 'ltr'
    } = props;


    return <div dir={direction} style={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: backgroundColor,
        alignItems: 'center',
        textAlign: 'center',
        width: '100%'
    }}>
        <div style={{ margin: "12px 0", display: 'block' }}>
            <img src={iconUrl} width={iconSize} height={iconSize} alt={'icon'} />
            {title ? <Typography variant='h5' noWrap={false} style={{ fontSize: titleFontSize, fontWeight: titleFontWeight, marginTop: '10px', marginBottom: '10px', }} > {title}</Typography> : null}
            <Typography noWrap={false} style={{ maxWidth: '710px', fontSize: messageFontSize, fontWeight: messageFontWeight, marginTop: '4px', marginLeft: direction === 'ltr' ? '9px' : '', marginRight: direction === 'rtl' ? '9px' : '', color: messageColor }}>{message}</Typography>
            {descComponent != null ? descComponent : null}
            {actionButtons.length > 0 ?
                actionButtons.map((res, key) => {
                    return (
                        <Button
                            key={key}
                            variant={res.variant}
                            color={res.color}
                            onClick={res.action !== null ? () => res.action() : null}
                            type={res.type}
                            startIcon={res.iconurl ? <img style={direction == 'ltr' ? { marginLeft: '5px', } : { marginLeft: '10px', }} src={res.iconurl} height={15} /> : null}
                            style={{ padding: direction == 'ltr' ? '3px 13px 3px 8px' : '3px 6px 3px 13px', margin: '15px 10px', backgroundColor: res.backgroundColor }}
                        >
                            {res.label}
                        </Button>
                    )
                })
                : null}

        </div>
    </div>

}


export default NotFound;