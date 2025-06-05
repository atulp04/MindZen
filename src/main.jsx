
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import App from '@/App';
    import '@/index.css';
    import { AuthProvider } from '@/contexts/AuthContext';
    import { Toaster } from '@/components/ui/toaster'; // Toaster already in MainLayout, but AuthProvider might need it earlier

    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <AuthProvider>
          <App />
          {/* Redundant Toaster here if MainLayout already has it, but good for early toasts if any */}
          <Toaster /> 
        </AuthProvider>
      </React.StrictMode>
    );
  