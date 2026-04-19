import React from 'react';
import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';

export const Alert = ({ type = 'info', title, message, onClose }) => {
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  return (
    <div className={`border rounded-lg p-4 flex items-start gap-3 ${colors[type]}`}>
      <div className="flex-shrink-0">{icons[type]}</div>
      <div className="flex-1">
        {title && <h3 className="font-semibold text-sm mb-1">{title}</h3>}
        {message && <p className="text-sm">{message}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-lg hover:opacity-60"
        >
          ×
        </button>
      )}
    </div>
  );
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`
        font-semibold rounded-lg transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed
        ${loading ? 'animate-pulse opacity-90' : ''}
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="inline-block animate-spin">⏳</span>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
    {children}
  </div>
);

export const Modal = ({ isOpen, title, children, onClose, onConfirm, confirmText = 'Save', confirmLoading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            disabled={confirmLoading}
          >
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
        <div className="flex gap-3 p-6 border-t justify-end">
          <Button variant="secondary" onClick={onClose} disabled={confirmLoading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} loading={confirmLoading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export const Loading = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

export const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
    {Icon && <Icon className="w-16 h-16 mb-4 text-gray-300" />}
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-sm text-gray-400">{description}</p>
  </div>
);
