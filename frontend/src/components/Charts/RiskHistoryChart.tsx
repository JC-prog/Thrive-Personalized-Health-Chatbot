import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import { format, parseISO } from 'date-fns';
import { HeartPulse, Syringe } from 'lucide-react';
import type { TooltipProps } from 'recharts';
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-300 rounded-md shadow p-2 text-sm">
        <p className="text-slate-500 mb-1">{format(parseISO(label), 'PPpp')}</p>
        <p className="text-slate-700 font-medium">
          {(payload[0].value as number).toFixed(2)}%
        </p>
      </div>
    );
  }

  return null;
};

interface RiskHistoryChartProps {
  diabetesHistory: { date: string; risk_score: number }[];
  heartHistory: { date: string; risk_score: number }[];
}

const RiskHistoryChart = ({ diabetesHistory, heartHistory }: RiskHistoryChartProps) => {
  return (
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col gap-6">
          {/* Heart Disease Risk Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <HeartPulse className="text-red-500" size={24} />
              <h3 className="text-lg font-semibold text-slate-800">Heart Disease Risk History</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={heartHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(dateStr) => format(parseISO(dateStr), 'MMM d')}
                >
                  {/* Adjusted Label positioning */}
                  <Label value="Risk Percentage" offset={10} position="bottom" />
                </XAxis>
                <YAxis tickFormatter={(value) => `${(value).toFixed(1)}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="risk_score" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>

          </div>

          {/* Diabetes Risk Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <Syringe className="text-blue-500" size={24} />
              <h3 className="text-lg font-semibold text-slate-800">Diabetes Risk History</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={heartHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(dateStr) => format(parseISO(dateStr), 'MMM d')}
                >
                  {/* Adjusted Label positioning */}
                  <Label value="Risk Percentage" offset={10} position="bottom" />
                </XAxis>
                <YAxis tickFormatter={(value) => `${(value).toFixed(1)}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="risk_score" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>

          </div>
        </div>

        {/* Horizontal Legend */}
        <div className="flex justify-center mt-4">
          <Legend
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
            wrapperStyle={{
              padding: "10px 10px",
            }}
          />
        </div>
      </div>
  );
};

export default RiskHistoryChart;
