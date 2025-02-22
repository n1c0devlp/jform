import { useState, useEffect } from 'react';

interface AnalyticsData {
  totalUsers: number;
  usersByRole: {
    STUDENT: number;
    TEACHER: number;
    ADMIN: number;
    SUPER_ADMIN: number;
  };
  activeUsers: number;
  totalGroups: number;
  totalAvailabilities: number;
  instrumentDistribution: {
    [key: string]: number;
  };
  levelDistribution: {
    [key: string]: number;
  };
  recentConnections: Array<{
    id: string;
    email: string;
    role: string;
    lastConnection: string;
  }>;
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données analytiques');
        }
        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-200 mb-2">Utilisateurs totaux</h3>
          <p className="text-3xl font-bold text-red-500">{data.totalUsers}</p>
          <p className="text-sm text-gray-400 mt-2">Dont {data.activeUsers} actifs</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-200 mb-2">Groupes</h3>
          <p className="text-3xl font-bold text-red-500">{data.totalGroups}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-200 mb-2">Disponibilités</h3>
          <p className="text-3xl font-bold text-red-500">{data.totalAvailabilities}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-200 mb-2">Taux de remplissage</h3>
          <p className="text-3xl font-bold text-red-500">
            {Math.round((data.activeUsers / data.totalUsers) * 100)}%
          </p>
        </div>
      </div>

      {/* Distribution des rôles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-200 mb-4">Distribution des rôles</h3>
          <div className="space-y-3">
            {Object.entries(data.usersByRole).map(([role, count]) => (
              <div key={role} className="flex justify-between items-center">
                <span className="text-gray-300">{role}</span>
                <span className="text-red-500 font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-200 mb-4">Distribution des instruments</h3>
          <div className="space-y-3">
            {Object.entries(data.instrumentDistribution).map(([instrument, count]) => (
              <div key={instrument} className="flex justify-between items-center">
                <span className="text-gray-300">{instrument}</span>
                <span className="text-red-500 font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Distribution des niveaux */}
      <div className="bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-200 mb-4">Distribution des niveaux</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(data.levelDistribution).map(([level, count]) => (
            <div key={level} className="bg-gray-700 p-4 rounded">
              <p className="text-gray-300 font-medium">{level}</p>
              <p className="text-2xl font-bold text-red-500">{count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Connexions récentes */}
      <div className="bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-200 mb-4">Connexions récentes</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Dernière connexion
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {data.recentConnections.map((connection) => (
                <tr key={connection.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {connection.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {connection.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {new Date(connection.lastConnection).toLocaleString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 