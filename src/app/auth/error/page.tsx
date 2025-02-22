'use client';

import { useSearchParams } from 'next/navigation';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  let errorMessage = 'Une erreur est survenue l\'authentification';

  switch (error) {
    case 'Configuration':
      errorMessage = 'Erreur de configuration du serveur';
      break;
    case 'AccessDenied':
      errorMessage = 'Accès refusé';
      break;
    case 'Verification':
      errorMessage = 'La vérification a échoué';
      break;
    default:
      if (error) {
        errorMessage = error;
      }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Erreur d'authentification
          </h2>
          <p className="mt-2 text-center text-sm text-red-500">
            {errorMessage}
          </p>
        </div>
        <div className="mt-4 text-center">
          <a
            href="/"
            className="text-red-500 hover:text-red-400 font-medium"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
} 