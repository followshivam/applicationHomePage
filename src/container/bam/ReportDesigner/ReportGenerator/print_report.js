import React, { useEffect } from 'react'

const PrintReport = () => {
    useEffect(() => {
        window.print()
        setTimeout(() => {
            localStorage.removeItem('print')
            window.close();
        }, 200);
    }, [])

    return (
        <div dangerouslySetInnerHTML={{ __html: localStorage.getItem('print') }}></div>
    )
}

export default PrintReport;