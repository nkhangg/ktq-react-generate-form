'use client';
import {
    Button,
    Checkbox,
    CheckboxProps,
    createTheme,
    Group,
    MantineProvider,
    NumberInput,
    NumberInputProps,
    PasswordInput,
    PasswordInputProps,
    Radio,
    RadioProps,
    Select,
    SelectProps,
    Stack,
    Textarea,
    TextareaProps,
    TextInput,
    TextInputProps,
} from '@mantine/core';
import '@mantine/core/styles.css';
import { DateInput, DateInputProps, DateTimePicker, DateTimePickerProps } from '@mantine/dates';
import '@mantine/dates/styles.css';
import '../index.css';

import { Fragment, useCallback, useMemo } from 'react';

import { useForm } from '@mantine/form';
import { upperFirst } from '@mantine/hooks';
import { IGenerateFormProps, TInput } from '../type';
import { renderClassReponsive } from '../ultils/fn';
import validate from '../ultils/validate';

const theme = createTheme({
    /** Put your mantine theme override here */
});

export default function GenerateForm<R extends Record<string, string | number>>({
    props,
    inputs,
    layout = { xl: { col: 2, gap: 20 } },
    submitButton = { title: 'Submit' },
    onSubmit,
}: IGenerateFormProps<R>) {
    const inputData = useMemo(() => {
        return inputs.reduce((prev, cur) => {
            (prev as any)[cur.key as keyof R] = cur.value || undefined;
            return prev;
        }, {} as R);
    }, [inputs]);

    const validates = useMemo(() => {
        return inputs.reduce((prev, cur) => {
            if (cur?.validate?.validateFN) {
                (prev as any)[cur.key as keyof R] = (value: string) => (cur.validate?.validateFN ? cur.validate?.validateFN(cur, value) : validate.text(cur, value));
            } else {
                (prev as any)[cur.key as keyof R] = validate[cur?.validate?.style as keyof typeof validate]
                    ? (value: string) => validate[cur?.validate?.style as keyof typeof validate](cur, value)
                    : (value: string) => validate.text(cur, value);
            }

            return prev;
        }, {});
    }, [inputs]);

    const form = useForm<R>({
        mode: 'uncontrolled',
        initialValues: inputData as R,
        validate: validates,
    });

    const renderInput = useCallback(
        (input: TInput<R>) => {
            const renderColsapn = (colspan?: number) => {
                if (!layout || !layout?.xl?.col || !colspan) return `span 1 / span 1`;

                if (colspan > layout.xl.col) return `span ${layout} / span ${layout}`;

                return `span ${colspan} / span ${colspan}`;
            };

            const props = {
                classNames: {
                    label: 'flex items-center justify-start',
                    error: 'text-left',
                },

                label: input?.title || <span className="capitalize">{input.key}</span>,
                style: {
                    gridColumn: renderColsapn(input.colspan),
                },

                ...form.getInputProps(input.key),
            };

            if (input.render) {
                return input.render(input);
            }

            switch (input.type) {
                case 'number': {
                    return <NumberInput {...props} {...(input.props as NumberInputProps)} />;
                }
                case 'show': {
                    return <TextInput {...props} {...(input.props as TextInputProps)} readOnly={true} />;
                }
                case 'text': {
                    return <TextInput {...props} {...(input.props as TextInputProps)} />;
                }
                case 'datetime': {
                    return <DateTimePicker {...props} {...(input.props as DateTimePickerProps)} />;
                }
                case 'date': {
                    return <DateInput valueFormat={input.validate?.options?.dateFormat} {...props} {...(input.props as DateInputProps)} />;
                }
                case 'select': {
                    if (!input?.data) throw new Error('The data prop is required');
                    return <Select data={input.data} {...props} {...(input.props as SelectProps)} />;
                }
                case 'text-area': {
                    return <Textarea {...props} {...(props as TextareaProps)} />;
                }
                case 'password': {
                    return <PasswordInput {...props} {...(input.props as PasswordInputProps)} />;
                }
                case 'boolean': {
                    if (!input?.data) throw new Error('The data prop is required');

                    return (
                        <Radio.Group {...props}>
                            {input?.styleShow === 'vertical' ? (
                                <Stack>
                                    {input.data.map((item) => {
                                        return <Radio size="xs" key={item} value={item} label={upperFirst(item)} {...(input.props as RadioProps)} />;
                                    })}
                                </Stack>
                            ) : (
                                <Group mt="xs">
                                    {input.data.map((item) => {
                                        return <Radio size="xs" key={item} value={item} label={upperFirst(item)} {...(input.props as RadioProps)} />;
                                    })}
                                </Group>
                            )}
                        </Radio.Group>
                    );
                }
                case 'checkbox': {
                    if (!input?.data) throw new Error('The data prop is required');

                    return (
                        <Checkbox.Group {...props}>
                            {input?.styleShow === 'vertical' ? (
                                <Stack>
                                    {input.data.map((item) => {
                                        return <Checkbox size="xs" key={item} value={item} label={upperFirst(item)} {...(input.props as CheckboxProps)} />;
                                    })}
                                </Stack>
                            ) : (
                                <Group mt="xs">
                                    {input.data.map((item) => {
                                        return <Checkbox size="xs" key={item} value={item} label={upperFirst(item)} {...(input.props as CheckboxProps)} />;
                                    })}
                                </Group>
                            )}
                        </Checkbox.Group>
                    );
                }

                default:
                    return <TextInput {...props} />;
            }
        },
        [form, layout],
    );

    console.log(renderClassReponsive(layout));
    return (
        <MantineProvider theme={theme}>
            <form onSubmit={form.onSubmit((values) => onSubmit(values))} {...props}>
                <div className={renderClassReponsive(layout)}>
                    {inputs.map((input) => {
                        return <Fragment key={input.key}>{renderInput(input)}</Fragment>;
                    })}
                </div>

                {submitButton && typeof submitButton === 'function' ? (
                    submitButton()
                ) : (
                    <div className="mt-4">
                        <Button type={'submit'} className="w-full" {...submitButton.props}>
                            {submitButton.title || 'Submit'}
                        </Button>
                    </div>
                )}
            </form>
        </MantineProvider>
    );
}
