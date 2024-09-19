import { Box } from '@mantine/core';
import './App.css';
import { GenerateForm } from 'ktq-react-generate-form';
import { TInput } from 'ktq-react-generate-form/src/type';

function App() {
    type User = {
        id: string;
        name: string;
        age: string;
        major: string;
        email: string;
        birthday: string;
        birthdays: string;
    };

    const inputs: TInput<User>[] = [
        {
            key: 'id',
            type: 'show',
            value: '1',
        },
        {
            key: 'major',
            type: 'text',
            data: ['balc', 'jsj'],
            // colspan: 2,
            validate: {
                options: {
                    messages: {
                        required: 'Blalal',
                    },
                },
            },
        },

        {
            key: 'age',
            type: 'number',
            validate: {
                style: 'number',
                options: {
                    min: 10,
                    max: 12,
                },
            },
        },
        {
            key: 'name',
            type: 'text',
        },
        {
            key: 'email',
            type: 'text',
            validate: {
                style: 'email',
                options: {
                    messages: {
                        invalid: 'date khong hop le',
                    },
                },
            },
        },
        {
            key: 'birthday',
            type: 'date',
            validate: {
                style: 'date',
                options: {
                    min: '2024-09-24', // Giá trị min
                    max: '2024-09-30', // Giá trị max
                    dateFormat: 'YYYY-MM-DD', // Định dạng ngày
                    messages: {
                        required: 'date khong hop le',
                    },
                },
            },
        },
        {
            key: 'birthdays',
            type: 'datetime',
            validate: {
                style: 'date',
                options: {
                    min: '2024-09-24T09:00:00', // Giá trị min
                    max: '2024-09-30T18:00:00', // Giá trị max
                    dateFormat: 'YYYY-MM-DDTHH:mm:ss', // Định dạng datetime
                    messages: {
                        required: 'date khong hop le',
                    },
                },
            },
        },
    ];

    return (
        <GenerateForm<User>
            onSubmit={(values) => {
                console.log(values);
            }}
            layout={{
                xl: { col: 2, gap: 2 },
                lg: { col: 2 },
                md: { col: 1 },
            }}
            inputs={inputs}
        />
    );
}

export default App;
