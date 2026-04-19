import React, { useState, useEffect } from 'react';
import { categoriesAPI } from '../services/api';
import { Card, Button, Modal, Loading, Alert, EmptyState } from '../components/UI';
import { Trash2, Edit, Plus, Tag } from 'lucide-react';

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#3b82f6',
    description: '',
  });
  const [savingCategory, setSavingCategory] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      setAlert({
        type: 'error',
        title: 'Error',
        message: 'Failed to load categories',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        color: category.color,
        description: category.description,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        color: '#3b82f6',
        description: '',
      });
    }
    setShowModal(true);
  };

  const handleSaveCategory = async () => {
    if (!formData.name) {
      setAlert({
        type: 'error',
        title: 'Validation Error',
        message: 'Category name is required',
      });
      return;
    }

    try {
      setSavingCategory(true);
      if (editingCategory) {
        await categoriesAPI.update(editingCategory.id, formData);
        setAlert({
          type: 'success',
          title: 'Success',
          message: 'Category updated successfully',
        });
      } else {
        await categoriesAPI.create(formData);
        setAlert({
          type: 'success',
          title: 'Success',
          message: 'Category created successfully',
        });
      }
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      setAlert({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.detail || 'Failed to save category',
      });
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        setDeletingCategoryId(id);
        await categoriesAPI.delete(id);
        setAlert({
          type: 'success',
          title: 'Success',
          message: 'Category deleted successfully',
        });
        fetchCategories();
      } catch (error) {
        setAlert({
          type: 'error',
          title: 'Error',
          message: 'Failed to delete category',
        });
      } finally {
        setDeletingCategoryId(null);
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
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 inline mr-2" />
          Add Category
        </Button>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <EmptyState
          icon={Tag}
          title="No categories found"
          description="Create a new category to organize your expenses"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card key={category.id} className="relative">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                  </div>
                  {category.description && (
                    <p className="text-sm text-gray-600">{category.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenModal(category)}
                    className="!px-2 !py-1"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    loading={deletingCategoryId === category.id}
                    onClick={() => handleDeleteCategory(category.id)}
                    className="!px-2 !py-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        onClose={() => setShowModal(false)}
        onConfirm={handleSaveCategory}
        confirmText={editingCategory ? 'Update' : 'Create'}
        confirmLoading={savingCategory}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Food, Transportation"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-12 h-10 rounded cursor-pointer"
              />
              <span className="text-sm text-gray-600">{formData.color}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Optional description"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Categories;
