import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Graph({data}) {
    return (
        <ResponsiveContainer width="95%" height="75%" minWidth="200px" minHeight="300px">
            <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="ships" stroke="#82ca9d" />
            </LineChart>
        </ResponsiveContainer>
    );
}