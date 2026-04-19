import React, { useState, useEffect } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { reportsAPI, syncAPI } from '../services/api';
import { Card, Button, Loading, Alert } from '../components/UI';
import { TrendingUp, Mail } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';

const CURRENCY_STORAGE_KEY = 'expense_manager_currency';

const currencyFormatter = (currency, value) => {
  const amount = Number(value) || 0;
  const options =
    currency === 'VND'
      ? { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }
      : { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 };
  return new Intl.NumberFormat(currency === 'VND' ? 'vi-VN' : 'en-US', options).format(amount);
};

const SummaryCards = ({ summary, currency }) => (
  <>
    <Card className="min-h-[140px]">
      <div className="flex flex-col justify-between h-full">
        <div>
          <p className="text-gray-500 text-sm font-medium">Total Expenses</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-2">
            {currencyFormatter(currency, summary?.total)}
          </h3>
        </div>
        <TrendingUp className="w-8 h-8 text-blue-500 self-end" />
      </div>
    </Card>

    <Card className="min-h-[140px]">
      <div className="flex flex-col justify-between h-full">
        <div>
          <p className="text-gray-500 text-sm font-medium">Number of Expenses</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-2">
            {summary?.count || 0}
          </h3>
        </div>
      </div>
    </Card>

    <Card className="min-h-[140px]">
      <div className="flex flex-col justify-between h-full">
        <div>
          <p className="text-gray-500 text-sm font-medium">Average Expense</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-2">
            {currencyFormatter(currency, summary?.average)}
          </h3>
        </div>
      </div>
    </Card>
  </>
);

const SyncPanel = ({ syncing, currency, setCurrency, onSync }) => (
  <Card className="space-y-4 p-5">
    <div className="flex items-start gap-3">
      <Mail className="w-5 h-5 text-blue-600 mt-1" />
      <div>
        <h3 className="font-semibold text-lg">Sync Bank Statements</h3>
        <p className="text-sm text-gray-500">Import expenses from email and keep totals up to date.</p>
      </div>
    </div>

    <div className="grid gap-4">
      <div className="space-y-2">
        <label className="text-sm text-gray-500">Currency</label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-sm"
        >
          <option value="USD">USD</option>
          <option value="VND">VND</option>
        </select>
      </div>

      <Button loading={syncing} onClick={onSync}>
        {syncing ? 'Syncing...' : 'Sync Now'}
      </Button>
    </div>
  </Card>
);

const DailyTrendCard = ({ daily, currency }) => (
  <Card className="p-5">
    <h3 className="font-semibold text-lg mb-4">Daily Trend</h3>
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={daily} margin={{ top: 0, right: 10, left: -20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" angle={-45} textAnchor="end" height={70} />
        <YAxis />
        <Tooltip formatter={(value) => currencyFormatter(currency, value)} />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#2563eb"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
        <Bar dataKey="total" fill="#3b82f6" barSize={18} radius={[6, 6, 0, 0]} />
      </ComposedChart>
    </ResponsiveContainer>
  </Card>
);

const CategoryChartCard = ({ byCategory, currency, COLORS }) => (
  <Card className="p-5">
    <h3 className="font-semibold text-lg mb-4">By Category</h3>
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={byCategory}
          dataKey="total"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {byCategory.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => currencyFormatter(currency, value)} />
      </PieChart>
    </ResponsiveContainer>
  </Card>
);

const BreakdownSection = ({ byCategory, currency }) => (
  <Card className="p-5">
    <h3 className="font-semibold text-lg mb-4">Category Breakdown</h3>
    <div className="space-y-4">
      {byCategory.map((cat) => (
        <div key={cat.category} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">{cat.category}</span>
            <span className="text-sm text-gray-500">{currencyFormatter(currency, cat.total)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${cat.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  </Card>
);

export const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [daily, setDaily] = useState([]);
  const [byCategory, setByCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [alert, setAlert] = useState(null);
  const [currency, setCurrency] = useState(() => localStorage.getItem(CURRENCY_STORAGE_KEY) || 'USD');

  useEffect(() => {
    localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
  }, [currency]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [summaryRes, dailyRes, categoryRes] = await Promise.all([
        reportsAPI.getSummary(),
        reportsAPI.getDaily(),
        reportsAPI.getByCategory(),
      ]);

      setSummary(summaryRes.data);
      setDaily(dailyRes.data);
      setByCategory(categoryRes.data);
    } catch (error) {
      setAlert({
        type: 'error',
        title: 'Error',
        message: 'Failed to load dashboard data',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSyncEmails = async () => {
    try {
      setSyncing(true);
      const response = await syncAPI.fetchEmails();
      setAlert({
        type: 'success',
        title: 'Success',
        message: response.data.message,
      });
      fetchData();
    } catch (error) {
      setAlert({
        type: 'error',
        title: 'Sync Failed',
        message: error.response?.data?.message || 'Failed to sync emails',
      });
    } finally {
      setSyncing(false);
    }
  };

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-slate-50 flex gap-6">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {alert && (
            <Alert
              {...alert}
              onClose={() => setAlert(null)}
            />
          )}

          <Card className="p-6">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Overview of daily expenses and category breakdown.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="space-y-2">
                  <label className="text-sm text-gray-500">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm"
                  >
                    <option value="USD">USD</option>
                    <option value="VND">VND</option>
                  </select>
                </div>

                <Button loading={syncing} onClick={handleSyncEmails}>
                  {syncing ? 'Syncing...' : 'Sync Now'}
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SummaryCards summary={summary} currency={currency} />
            </div>

            <SyncPanel
              syncing={syncing}
              currency={currency}
              setCurrency={setCurrency}
              onSync={handleSyncEmails}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className="grid gap-6">
              <DailyTrendCard daily={daily} currency={currency} />
              <CategoryChartCard byCategory={byCategory} currency={currency} COLORS={COLORS} />
            </div>

            <BreakdownSection byCategory={byCategory} currency={currency} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
