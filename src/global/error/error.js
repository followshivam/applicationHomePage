import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';

const Error = props => {

    const [error, setError] = useState('No Data for the Message Id');

    const globalMap = [];

    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        if (params.has('msgId') && params.get('msgId') !== '') {
            const err = globalMap[params.get('msgId')]
            if (err)
                setError(err);
        }
    }, [location])

    return (<>
        Error You are getting : {error}
    </>)

}

export default Error;