import React, { useState, lazy, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  makeStyles,
  Button,
  useTranslation
} from "component";
const DashboardList = lazy(() => import("./dashboard_list"))
const ManageDashboard = lazy(() => import("./manage_dashboard"))



const Dashboard = props => {
  const [nextStep, setNextStep] = useState(0);

  const [normalStoreDialog, globalSetting] = useSelector(state => {
    return [state.normalDialogState, state.globalSettings];
  });

  const { t } = useTranslation(globalSetting.locale_module)

  const handleClose = () => {
    normalStoreDialog.closeDialog()
  };
  return (
    <React.Fragment>
      {nextStep === 0 ?

        <DashboardList t={t} successEvent={(val) => setNextStep(val)} action_button={[{ id: 1, label: "Close", type: "button", variant: "outlined", color: "primary", action: handleClose }]} /> :
        <ManageDashboard t={t} successEvent={(val) => setNextStep(val)} action_button={[{ id: 1, label: "Close", type: "button", variant: "outlined", color: "primary", action: handleClose },
        { id: 2, label: `${t('bam:BUTTON_PREVIOUS')}`, type: "button", variant: "outlined", color: "primary", action: () => setNextStep(0) },
        { id: 3, label: `${t('bam:ADD')}`, type: "submit", variant: "contained", color: "primary", action: null }]} />
      }
    </React.Fragment>
  );
};
export default Dashboard;