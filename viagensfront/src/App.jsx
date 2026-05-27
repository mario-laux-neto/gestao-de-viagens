import { AppRoutes } from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

export function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'var(--white)',
            color: 'var(--ink)',
            fontFamily: 'var(--font-sans)',
            fontSize: '14px',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          },
          success: {
            iconTheme: {
              primary: 'var(--ok)',
              secondary: 'var(--white)',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--accent)',
              secondary: 'var(--white)',
            },
          },
        }} 
      />
    </AuthProvider>
  );
}
