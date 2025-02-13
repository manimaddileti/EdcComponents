export type TNullableNumber = null | number;
export type TNullableString = null | string;

export interface ITextAreaProps extends IErrorText, IViewType, IHelpText, ITabIndex {
    label?: string;
    elementId?: string;
    containerClass?: string;
    inputContainerClass?: string;
    labelContainerClass?: string;
    inputClass?: string;
    labelClass?: string;
    placeholder?: string;
    required?: boolean;
    rows?: number;
    cols?: number;
    disabled?: boolean;
    showCharacterCount?: boolean;
    max?: number;
    ellipseCount?: number;
}

export interface IHelpText {
    showHelpText?: boolean;
    helpText?: TNullableString;
}

export interface IErrorText {
    error?: TNullableString;
}

export interface IViewType {
    readOnly?: boolean;
}
interface ISpecifiedValue {
    specifiedValue: TNullableString;
}

interface ITabIndex {
    tabindex?: number;
}