import React, { useState, useEffect } from 'react';
import { settingsAPI } from '../services/api';
import { Card, Button, Loading, Alert } from '../components/UI';
import { Mail, Check, AlertCircle } from 'lucide-react';

export const Settings = () => {
  const [emailSettings, setEmailSettings] = useState(null);
  const [formData, setFormData] = useState({
    imap_server: '',
    email_user: '',
    email_pass: '',
  });
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsAPI.getEmailSettings();
      setEmailSettings(response.data);
      setFormData({
        imap_server: response.data.imap_server,
        email_user: response.data.email_user,
        email_pass: '',
      });
    } catch (error) {
      setAlert({
        type: 'error',
        title: 'Error',
        message: 'Failed to load settings',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!formData.imap_server || !formData.email_user || !formData.email_pass) {
      setAlert({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all fields',
      });
      return;
    }

    try {
      setSaving(true);
      await settingsAPI.saveEmailSettings(formData);
      setAlert({
        type: 'success',
        title: 'Success',
        message: 'Email settings saved successfully',
      });
      fetchSettings();
    } catch (error) {
      setAlert({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.detail || 'Failed to save settings',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      setTesting(true);
      const response = await settingsAPI.testEmailConnection();
      setAlert({
        type: 'success',
        title: 'Connection Successful',
        message: response.data.message,
      });
    } catch (error) {
      setAlert({
        type: 'error',
        title: 'Connection Failed',
        message: error.response?.data?.detail || 'Failed to connect to email',
      });
    } finally {
      setTesting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {alert && (
        <Alert
          {...alert}
          onClose={() => setAlert(null)}
        />
      )}

      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Email Configuration */}
      <Card>
        <div className="flex items-start gap-4 mb-6">
          <Mail className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h2 className="text-xl font-semibold mb-2">Email Configuration</h2>
            <p className="text-sm text-gray-600">
              Configure your email account to automatically import bank statements
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> If Gmail rejects your password, use an App Password for IMAP access.
            <br />
            The Gmail error can say: <span className="font-semibold">"Application-specific password required"</span>.
            <br />
            <a href="https://support.google.com/accounts/answer/185833" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Learn how to generate an App Password
            </a>
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              IMAP Server *
            </label>
            <input
              type="text"
              value={formData.imap_server}
              onChange={(e) => setFormData({ ...formData, imap_server: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., imap.gmail.com"
            />
            <p className="text-xs text-gray-500 mt-1">Common: imap.gmail.com, imap.outlook.com</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email_user}
              onChange={(e) => setFormData({ ...formData, email_user: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your_email@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password / App Password *
            </label>
            <input
              type="password"
              value={formData.email_pass}
              onChange={(e) => setFormData({ ...formData, email_pass: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-500 mt-1">Your password is never stored, only used to connect</p>
          </div>
        </div>

        {/* Status */}
        {emailSettings && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center gap-2">
              {emailSettings.status === 'configured' ? (
                <>
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-green-600 font-medium">Email is configured</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <span className="text-yellow-600 font-medium">Email is not configured</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button
            onClick={handleTestConnection}
            variant="outline"
            loading={testing}
          >
            Test Connection
          </Button>
          <Button
            onClick={handleSaveSettings}
            loading={saving}
          >
            Save Settings
          </Button>
        </div>
      </Card>

      {/* General Settings */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">General Settings</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-900">Application Version</h3>
            <p className="text-sm text-gray-600 mt-1">1.0.0</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-900">Database Location</h3>
            <p className="text-sm text-gray-600 mt-1">./data/expense_manager.db</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-900">API Endpoint</h3>
            <p className="text-sm text-gray-600 mt-1">
              {import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}
            </p>
          </div>
        </div>
      </Card>

      {/* Help Section */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
        <div className="space-y-3 text-sm">
          <p>
            <strong>Q: How do I add expenses?</strong>
            <br />
            A: Go to the Expenses page and click "Add Expense" to manually add expenses, or configure email sync to auto-import from bank statements.
          </p>
          <p>
            <strong>Q: How do I categorize expenses?</strong>
            <br />
            A: Go to the Categories page to create and manage expense categories. Then assign categories when creating or editing expenses.
          </p>
          <p>
            <strong>Q: How do I sync bank statements?</strong>
            <br />
            A: Configure your email settings here, then go to the Dashboard and click "Sync Now" to fetch emails and import expenses.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
