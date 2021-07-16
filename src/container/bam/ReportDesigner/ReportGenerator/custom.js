import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { ReportDetails } from "redux/action";

const useOnCloseWindow = () => {
    const [isDirty, setDirty] = useState(true);
    const dispatch = useDispatch()
    useEffect(() => {
        window.onbeforeunload = isDirty && function () {
            dispatch(ReportDetails({}))
            return;
        }
        return () => {
            window.onbeforeunload = null;
        };
    }, [isDirty]);


    return [() => setDirty(true), () => setDirty(false)];
};

export default useOnCloseWindow;