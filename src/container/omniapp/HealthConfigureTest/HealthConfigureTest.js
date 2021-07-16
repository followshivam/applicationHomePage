import React, { Suspense, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Button, Spinner,useTranslation } from 'component'
import ConfigureHealthStatus from './ConfigureHealthStatus'

function HealthConfigureTest() {
    const [ globalSetting] = useSelector(state => {
        return [state.globalSettings];
      });
    
      const { t } = useTranslation(globalSetting.locale_module?globalSetting.locale_module:["bam","omniapp"])
    const [fullDialogStore, normalDialogStore] = useSelector(state => {
        return [state.fullDialogState, state.normalDialogState];
    });

    const normalStoreDialog = useSelector(state => {
        return state.normalDialogState;
    });

    const handleClose = () => {
        normalStoreDialog.closeDialog()
    };

    return (
        <div>
            <Button
                variant="contained"
                color="secondary"
                onClick={() => normalDialogStore.openDialog(
                    <Suspense fallback={<div style={{ height: "250px", minWidth: "600px" }}><Spinner msg="" /></div>}>
                        <ConfigureHealthStatus handleClose={handleClose} />
                    </Suspense>,
                                  `${t('omniapp:CONFIGURE_HEALTH_TEST')}`

                )}
            >
               {t('omniapp:CONFIGURE_HEALTH_TEST')}
            </Button>

        </div>
    )
}

export default HealthConfigureTest
