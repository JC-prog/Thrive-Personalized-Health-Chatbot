

const DashboardContent = () => (
    <div className="flex-1 bg-slate-50 p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Welcome back, John 👋</h1>
  
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card
          title="Heart Rate"
          value="72"
          unit="bpm"
          icon={<HeartPulse size={28} />}
          bg="bg-red-100"
        />
        <Card
          title="Steps Today"
          value="6,530"
          unit="steps"
          icon={<Activity size={28} />}
          bg="bg-green-100"
        />
        <Card
          title="Sleep"
          value="7.8"
          unit="hours"
          icon={<svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" /></svg>}
          bg="bg-indigo-100"
        />
        <Card
          title="Calories Burned"
          value="590"
          unit="kcal"
          icon={<svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3C8.13 3 5 6.13 5 10c0 4.61 7 11 7 11s7-6.39 7-11c0-3.87-3.13-7-7-7z" /></svg>}
          bg="bg-orange-100"
        />
      </div>
  
      {/* Chart Placeholder */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Weekly Activity Summary</h2>
        <div className="w-full h-64 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
          Chart goes here (use Recharts or Chart.js)
        </div>
      </div>
    </div>
  );