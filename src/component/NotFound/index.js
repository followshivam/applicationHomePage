import React, { useState } from "react";
import { IconImage, Typography, useTranslation, Button } from "component"
import { useSelector } from 'react-redux'



const NotFound = props => {

    const [globalSetting] = useSelector(
        state => {
            return [
                state.globalSettings
            ]
        }
    )
    const { t } = useTranslation(globalSetting.locale_module)

    const {
        iconSize = 100,
        message = `${t('bam:NOT_FOUND_MESSAGE')}`,
        messageFontSize = "14px",
        messageFontWeight = 300,
        messageColor,
        backgroundColor,
        iconUrl = `${process.env.REACT_APP_CONTEXT_PATH}/icons/no_data.svg`,
        title = '',
        titleFontSize = "16px",
        titleFontWeight = 800,
        actionButtons = []
    } = props;

    const [direction] = useState(`${t('bam:HTML_DIR')}`)

    return <div dir={direction} style={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: backgroundColor,
        alignItems: 'center',
        textAlign: 'center',
        width: '100%'
    }}>
        <div style={{ margin: "19px 0", display: 'block' }}>
            <IconImage url={iconUrl} width={iconSize} height={iconSize} />
            {title ? <Typography variant='h5' noWrap={false} style={{ fontSize: titleFontSize, fontWeight: titleFontWeight, marginTop: '10px', marginBottom: '10px', }} > {title}</Typography> : null}
            <Typography style={{ fontSize: messageFontSize, fontWeight: messageFontWeight, marginTop: '4px', marginLeft: direction === 'ltr' ? '9px' : '', marginRight: direction === 'rtl' ? '9px' : '', color: messageColor }}>{message}</Typography>
            {actionButtons.length > 0 ?
                actionButtons.map((res, key) => {
                    return (
                        <Button
                            key={key}
                            variant={res.variant}
                            color={res.color}
                            onClick={() => res.action()}
                            type={res.type}
                            startIcon={res.iconurl ? <IconImage style={{ margin: '0px 5px' }} url={res.iconurl} height={15} /> : null}
                            style={{ paddingRight: '15px', margin: '15px 10px', backgroundColor: res.backgroundColor }}
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