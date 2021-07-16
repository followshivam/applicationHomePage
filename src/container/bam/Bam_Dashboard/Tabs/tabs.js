import React, { useState, lazy } from "react";
import { useTranslation } from 'component'
import { useSelector } from "react-redux";
const TabList = lazy(() => import("./tab_list"))
const ManageTabs = lazy(() => import("./manage_tabs_view"))
// const ManageTabs=lazy(()=>import("./manage_tabs"))




const Tabs = props => {
  const [nextStep, setNextStep] = useState(0);
  const { onCallBack = null } = props;

  const [normalStoreDialog, globalSetting] = useSelector(state => {
    return [state.normalDialogState, state.globalSettings];
  });

  const { t } = useTranslation(globalSetting.locale_module)

  const handleClose = () => {
    normalStoreDialog.closeDialog()
  };
  const [respData, setRespData] = useState();
  return (
    <React.Fragment>
      {nextStep === 0 ?

        <TabList t={t} {...props} successEvent={(val, res) => { setNextStep(val); setRespData(res) }} onCallBack={onCallBack} action_button={[{ id: 1, label: "Close", type: "button", variant: "outlined", color: "primary", action: handleClose }]} /> :
        <ManageTabs t={t} {...props} respData={respData} successEvent={(val) => setNextStep(val)} onCallBack={onCallBack} action_button={[{ id: 1, label: "Close", type: "button", variant: "outlined", color: "primary", action: handleClose },
        { id: 2, label: `${t('bam:BUTTON_PREVIOUS')}`, type: "button", variant: "outlined", color: "primary", action: () => setNextStep(0) },
        { id: 3, label: `${t('bam:ADD')}`, type: "submit", variant: "contained", color: "primary", action: null }]} />
      }
    </React.Fragment>
  );
};
export default Tabs;