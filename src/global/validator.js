import { GetRegexHandler } from "global/webdesktop/api/ApiMethods";
import { SetRegexDetails } from "redux/action";

const REGEX = {
    AlphaNumUsDashSpace: '^[\\p{L}\\p{Nd}\\p{M}\\p{Z}\\p{Pd} _-]+$',  // AlphanumericWithUnderScoreDashSpace
    AlphaNumUsDashSpaceDotCurrency: '^[\\p{No}\\p{L}\\p{Sc}\\p{Nd}\\p{M}\\p{Z}_. -]+$',  // AlphanumericWithUnderScoreDashDotSpaceCurrencySymbol
    AlphaNumDotColon: '^[\\p{L}\\p{Nd}\\p{M}\\p{Z}:.]+$', // AlphanumericWithDotColon
    AlphaNumUsBrackets: '^[\\p{L}\\p{Nd}\\p{M}\\p{Z}\(\) -.*_]+$',   // AlphaNumUnderscoreBrackets1
    AlphaNumBrackets: '^[\\p{Z}\\p{L}\\p{Nd}\\p{M} (\\)_.*-]+$',   // AlphnaumericwithBrackets
    AllChars: '^[\\p{L}\\p{Nd}\\p{M}\\p{Z}\\p{Sc}\\p{P}\\p{Sk}~+=|©°]*$',   //	AllChars
    NumColon: '^[-+]?[\\p{Nd}:]+$',   //	NumericWithColon
    NumPositive: '^[\\p{Nd}]*$',   // NumericPositive
    Integer: '^[-+]?[\\p{Nd}]+$',   // NumericPositiveNegative
    AlphaDotSpace: '^[\\p{L}\\p{M}\\p{Z}. ]*$',   // AlphawithDotSpaceRegEx
    AlphaSpaceUs: '^[\\p{L}\\p{M}\\p{Z}\\p{Pd} _]*$',   // AlphawithSpaceUnderscoreRegEx
    AlphaNospace: '^[\\p{L}\\p{M}]*$',   // AlphaWithoutSpaceRegEx
}

const validateRegex = (value, type) => {
    const regex = new RegExp(type, 'u')
    let isValid = regex.test(value)
    return isValid
}
// all args are mandatory.
// regexDetails - regex present in store - useSelector
// dispatch - function from useDispatch
// module can be "WD" , "BAM"
const GetRegex = async (dispatch, module, regexDetails) => {
    // change the function to module specific if comes more.
    // currently handled for only webdesktop.
    if (regexDetails && regexDetails[module]) {
        return regexDetails[module];
    } else {
        await GetRegexHandler()
            .then(res => {
                if (res && res.status.maincode === '0') {
                    const data = res.data;
                    if (data) {
                        dispatch(SetRegexDetails({ [module]: data }));
                        return data[module];
                    } else {
                        return {};
                    }
                } else {
                    throw new Error('No Data')
                }
            })
            .catch(err => { console.log(err) })
    }

}

export {
    REGEX,
    validateRegex,
    GetRegex
}