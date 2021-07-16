import { NotFound } from 'component'
import React, { useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom';

const FirstTimeLogin = (props) => {

    const location = useLocation();
    const history = useHistory()
    
    useEffect(() => {
        if (!location.state) {
            history.replace('/login')
        }
    }, [])

    return (<div style={{ marginTop: "15rem" }}>
        <NotFound />
    </div>)
}

export default FirstTimeLogin;

