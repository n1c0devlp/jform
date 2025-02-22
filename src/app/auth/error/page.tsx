import { Suspense } from 'react';
import ErrorPage from '@/components/auth/ErrorPage';

export default function AuthError() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ErrorPage />
    </Suspense>
  );
} 