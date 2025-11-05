'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/lib/i18n'

/**
 * Landing Page - Checks authentication and redirects
 * - If authenticated → /role
 * - If not authenticated → /auth
 */
export default function Home() {
  const router = useRouter();
  const { user, loading, checkSession } = useAuth();
  const { t } = useI18n();

  useEffect(() => {
    const handleInitialRoute = async () => {
      // Wait for auth check to complete
      if (loading) return;

      try {
        // Verify session is valid
        const hasValidSession = await checkSession();
        
        if (hasValidSession && user) {
          // User is authenticated, redirect to role selection
          router.replace('/role');
        } else {
          // User is not authenticated, redirect to auth page
          router.replace('/auth');
        }
      } catch (error) {
        console.error('Session check failed:', error);
        // On error, redirect to auth
        router.replace('/auth');
      }
    };

    handleInitialRoute();
  }, [user, loading, router, checkSession]);

  // Show loading screen while checking authentication
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      fontSize: '1.2rem',
      fontFamily: 'Rubik, Arial, sans-serif',
      backgroundColor: '#0d47a1',
      color: 'white',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div className="spinner" style={{
        width: '50px',
        height: '50px',
        border: '5px solid rgba(255, 255, 255, 0.3)',
        borderTop: '5px solid white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <div>{t('home.checking_auth')}</div>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}