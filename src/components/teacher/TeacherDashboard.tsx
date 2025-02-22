'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import StudentsList from './StudentsList';
import GroupManagement from './GroupManagement';
import AvailabilityOverview from './AvailabilityOverview';
import GroupSuggestions from './GroupSuggestions';
import Settings from './Settings';
import Analytics from './Analytics';

type TabType = 'students' | 'groups' | 'availability' | 'suggestions' | 'settings' | 'analytics';

export default function TeacherDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>('students');
  const isSuperAdmin = session?.user?.role === 'SUPER_ADMIN';

  const tabs = [
    { id: 'students', label: 'Liste des élèves' },
    { id: 'groups', label: 'Gestion des groupes' },
    { id: 'availability', label: 'Vue des disponibilités' },
    { id: 'suggestions', label: 'Suggestions de groupes' },
    { id: 'settings', label: 'Paramètres' },
    ...(isSuperAdmin ? [{ id: 'analytics', label: 'Analytics' }] : []),
  ];

  return (
    <div>
      {/* Message de bienvenue */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-100">
          Bienvenue, {session?.user?.name || 'Professeur'} !
        </h2>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Navigation des onglets */}
        <div className="border-b border-gray-700">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`
                  py-4 px-6 text-center border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-500'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu des onglets */}
        <div className="p-6">
          {activeTab === 'students' && <StudentsList />}
          {activeTab === 'groups' && <GroupManagement />}
          {activeTab === 'availability' && <AvailabilityOverview />}
          {activeTab === 'suggestions' && <GroupSuggestions />}
          {activeTab === 'settings' && <Settings />}
          {activeTab === 'analytics' && isSuperAdmin && <Analytics />}
        </div>
      </div>
    </div>
  );
} 