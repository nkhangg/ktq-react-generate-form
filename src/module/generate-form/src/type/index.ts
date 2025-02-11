import { ButtonProps, CheckboxProps, NumberInputProps, PasswordInputProps, RadioProps, SelectProps, TextareaProps, TextInputProps } from '@mantine/core';
import { DateInputProps, DateTimePickerProps } from '@mantine/dates';
import { DetailedHTMLProps, ReactNode } from 'react';

export type TTypeInput = 'number' | 'text' | 'boolean' | 'select' | 'checkbox' | 'password' | 'text-area' | 'show' | 'date' | 'datetime';
export type TStyleValidate = 'number' | 'text' | 'phone' | 'url' | 'email' | 'date' | 'datetime';
// Conditional types để xác định kiểu props dựa trên type
export type GetPropsByType<T extends TTypeInput> = T extends keyof PropsMapping ? PropsMapping[T] : never;
// Mapping type -> props
export type PropsMapping = {
    number: NumberInputProps;
    text: TextInputProps;
    date: DateInputProps;
    datetime: DateTimePickerProps;
    select: SelectProps;
    checkbox: CheckboxProps;
    boolean: RadioProps;
    password: PasswordInputProps;
    'text-area': TextareaProps;
    show: TextInputProps;
};

export interface IBaseFormGenerateData<R extends Record<string, string | number>> {
    key: Extract<keyof R, string>;
    title?: string;
    value?: string | number | Date;
    type: TTypeInput;
    validate?: {
        style?: TStyleValidate;
        options?: ValidationOptions;
        validateFN?: (input: TInput<R>, value?: TInput<R>['value']) => string | null;
    };
    colspan?: number;
    render?: (props: TInput<R>) => ReactNode;
    // Dựa trên type mà xác định kiểu của props
    props?: GetPropsByType<TTypeInput>;
}

export interface ISelectOrCheckbox<R extends Record<string, string | number>> extends IBaseFormGenerateData<R> {
    type: 'select' | 'checkbox' | 'boolean';
    data: string[];
    styleShow?: 'horizontal' | 'vertical';
}

export interface IOtherTypes<R extends Record<string, string | number>> extends IBaseFormGenerateData<R> {
    type: Exclude<TTypeInput, 'select' | 'checkbox' | 'boolean'>;
    data?: string[];
}

export type TInput<R extends Record<string, string | number>> = ISelectOrCheckbox<R> | IOtherTypes<R>;

export interface ValidationMessages {
    required?: string;
    invalid?: string;
    min?: string;
    max?: string;
}

export interface ValidationOptions {
    required?: boolean;
    min?: number | string;
    max?: number | string;
    messages?: ValidationMessages;
    dateFormat?: string;
}

export interface ILayoutFormItem {
    col?: number;
    gap?: number;
}

export interface IGenerateFormProps<R extends Record<string, string | number>> {
    inputs: TInput<R>[];
    layout?: {
        xl?: ILayoutFormItem;
        lg?: ILayoutFormItem;
        md?: ILayoutFormItem;
        xs?: ILayoutFormItem;
    };
    onSubmit: (values: R) => void;
    submitButton?: { title?: string; props?: ButtonProps & { type?: 'button' | 'submit' | 'reset' } } | (() => ReactNode);
    props?: DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
}
