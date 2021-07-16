import { NotFound } from 'component';
import { ExtConnect } from 'global/omniapp/api/ApiMethods';
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'

const ExtendSession = (props) => {

    const location = useLocation();
    const history = useHistory()
    const requiredParams = [
        { fromSSO: "UserName", toBackend: "user_name" },
        { fromSSO: "userName", toBackend: "user_name" },
        { fromSSO: "logouturl", toBackend: "logout_url" },
        { fromSSO: "CabinetName", toBackend: "cabinet_name" },
        { fromSSO: "SSOToken", toBackend: "sso_token" },
        { fromSSO: "ClientIPAddress", toBackend: "dom_host" },
        { fromSSO: "NewgenSSO", toBackend: "newgen_sso" },
        { fromSSO: "UserDbId", toBackend: "user_db_id" },
        { fromSSO: "UserIndex", toBackend: "user_index" },
        { fromSSO: "Mode", toBackend: "mode" },
        { fromSSO: "SessionId", toBackend: "session_id" }
    ]

    const [SSOState, setSSOState] = useState({
        show_logout: true,
        logout_url: '',
        user_name: '',
        cabinet_name: '',
        session_id: '',
        user_db_id: '',
        user_index: '',
        newgen_sso: true,
        mode: '',
        sso_token: '',
        client_offset: '',
        dom_host: window.location.hostname,
        dom_protocol: window.location.protocol.substring(0, window.location.protocol.length - 1)
    })

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        requiredParams.forEach(param => {
            if (params.has(param.fromSSO) && params.get(param.fromSSO) !== '') {
                setSSOState(prevState => ({
                    ...prevState,
                    [param.toBackend]: params.get(param.fromSSO)
                }))
            }
        });
        ExtConnect(JSON.stringify(SSOState))
            .then(res => {
                if (res != null && res.status.maincode === '0') {
                    history.push('');
                } else {
                    history.replace('/login')
                }
            })
            .catch(err => {
                history.replace('/login')
                console.log(err)
            })
    }, [location])

    console.log('extend Session',SSOState)
    return (<div style={{ marginTop: '15rem' }}>
        <NotFound />
    </div>)
}

export default ExtendSession