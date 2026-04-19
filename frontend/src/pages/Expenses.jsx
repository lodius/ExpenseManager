import React, { useState, useEffect } from 'react';
import { expensesAPI } from '../services/api';
import { Card, Button, Modal, Loading, Alert, EmptyState } from '../components/UI';
import { Trash2, Edit, Plus, Search } from 'lucide-react';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    source: 'Manual',
    date: new Date().toISOString().split('T')[0],
  });
  const [filters, setFilters] = useState({ category: '', source: '' });
  const [savingExpense, setSavingExpense] = useState(false);
  const [deletingExpenseId, setDeletingExpenseId] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, [filters]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await expensesAPI.getAll(0, 100, filters);
      setExpenses(response.data);
    } catch (error) {
      setAlert({
        type: 'error',
        title: 'Error',
        message: 'Failed to load expenses',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (expense = null) => {
    if (expense) {
      setEditingExpense(expense);
      setFormData({
        amount: expense.amount,
        description: expense.description,
        category: expense.category,
        source: expense.source,
        date: expense.date.split('T')[0],
      });
    } else {
      setEditingExpense(null);
      setFormData({
        amount: '',
        description: '',
        category: '',
        source: 'Manual',
        date: new Date().toISOString().split('T')[0],
      });
    }
    setShowModal(true);
  };

  const handleSaveExpense = async () => {
    if (!formData.amount || !formData.description || !formData.category) {
      setAlert({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields',
      });
      return;
    }

    try {
      setSavingExpense(true);
      if (editingExpense) {
        await expensesAPI.update(editingExpense.id, formData);
        setAlert({
          type: 'success',
          title: 'Success',
          message: 'Expense updated successfully',
        });
      } else {
        await expensesAPI.create(formData);
        setAlert({
          type: 'success',
          title: 'Success',
          message: 'Expense created successfully',
        });
      }
      setShowModal(false);
      fetchExpenses();
    } catch (error) {
      setAlert({
        type: 'error',
        title: 'Error',
        message: 'Failed to save expense',
      });
    } finally {
      setSavingExpense(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        setDeletingExpenseId(id);
        await expensesAPI.delete(id);
        setAlert({
          type: 'success',
          title: 'Success',
          message: 'Expense deleted successfully',
        });
        fetchExpenses();
      } catch (error) {
        setAlert({
          type: 'error',
          title: 'Error',
          message: 'Failed to delete expense',
        });
      } finally {
        setDeletingExpenseId(null);
      }
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

      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Expenses</h1>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 inline mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Filters */}
      <Card className="flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Filter by category..."
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1">
          <select
            value={filters.source}
            onChange={(e) => setFilters({ ...filters, source: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Sources</option>
            <option value="Manual">Manual</option>
            <option value="Email">Email</option>
          </select>
        </div>
      </Card>

      {/* Expenses List */}
      {expenses.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No expenses found"
          description="Create a new expense to get started"
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Description</th>
                  <th className="text-left py-3 px-4 font-semibold">Category</th>
                  <th className="text-left py-3 px-4 font-semibold">Source</th>
                  <th className="text-right py-3 px-4 font-semibold">Amount</th>
                  <th className="text-right py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">{expense.description}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{expense.source}</td>
                    <td className="py-3 px-4 text-right font-semibold">
                      ${expense.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenModal(expense)}
                        className="!px-2 !py-1"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        loading={deletingExpenseId === expense.id}
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="!px-2 !py-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}
        onClose={() => setShowModal(false)}
        onConfirm={handleSaveExpense}
        confirmText={editingExpense ? 'Update' : 'Create'}
        confirmLoading={savingExpense}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Food, Transportation"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source
            </label>
            <select
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Manual">Manual</option>
              <option value="Email">Email</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Expenses;