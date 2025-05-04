import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { HeartPulse, Syringe } from 'lucide-react';

interface RiskHistoryChartProps {
  diabetesHistory: { date: string; risk_score: number }[];
  heartHistory: { date: string; risk_score: number }[];
}

const RiskHistoryChart = ({ diabetesHistory, heartHistory }: RiskHistoryChartProps) => {
  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              />
              <YAxis
                domain={[0, 1.01]} // slight overshoot ensures 1 is fully rendered
                tickFormatter={(value) => `${(value).toFixed(1)}%`}
                ticks={[0, 0.5, 1]} // still enforce ticks at 0%, 50%, 100%
              />

              <Tooltip
                formatter={(value: number) => `${(value).toFixed(2)}%`}
                labelFormatter={(label: string) => format(parseISO(label), 'PPpp')} // e.g., "May 4, 2025 at 12:00 PM"
              />


              <Legend />
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
            <LineChart data={diabetesHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(dateStr) => format(parseISO(dateStr), 'MMM d')} 
              />
              <YAxis 
                tickFormatter={(value) => `${(value).toFixed(1)}%`} // Format Y-axis ticks as percentage
              />
              <Tooltip
                formatter={(value: number) => `${(value).toFixed(2)}%`}
                labelFormatter={(label: string) => format(parseISO(label), 'PPpp')} // e.g., "May 4, 2025 at 12:00 PM"
              />


              <Legend />
              <Line type="monotone" dataKey="risk_score" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RiskHistoryChart;
