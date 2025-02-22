'use client';

import { useState } from 'react';
import { DAYS_OF_WEEK } from '@/lib/constants';

interface Group {
  id: string;
  name: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  level: string;
}

export default function GroupManagement() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    dayOfWeek: 1,
    startTime: '08:00',
    endTime: '09:00',
    level: 'PPES',
  });

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGroup),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du groupe');
      }

      const createdGroup = await response.json();
      setGroups([...groups, createdGroup]);
      setIsCreating(false);
      setNewGroup({
        name: '',
        dayOfWeek: 1,
        startTime: '08:00',
        endTime: '09:00',
        level: 'PPES',
      });
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de la création du groupe');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Groupes existants</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Créer un groupe
        </button>
      </div>

      {/* Liste des groupes */}
      <div className="grid gap-4 mb-8">
        {groups.map((group) => (
          <div
            key={group.id}
            className="bg-gray-50 p-4 rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-medium">{group.name}</h3>
              <p className="text-sm text-gray-600">
                {DAYS_OF_WEEK[group.dayOfWeek - 1]} de {group.startTime} à{' '}
                {group.endTime}
              </p>
              <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                {group.level}
              </span>
            </div>
            <button
              onClick={() => {
                // Logique pour supprimer un groupe
              }}
              className="text-red-500 hover:text-red-700"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>

      {/* Formulaire de création de groupe */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Créer un nouveau groupe</h3>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du groupe
                </label>
                <input
                  type="text"
                  value={newGroup.name}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, name: e.target.value })
                  }
                  className="w-full border-2 border-gray-300 rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jour
                </label>
                <select
                  value={newGroup.dayOfWeek}
                  onChange={(e) =>
                    setNewGroup({
                      ...newGroup,
                      dayOfWeek: parseInt(e.target.value),
                    })
                  }
                  className="w-full border-2 border-gray-300 rounded-md p-2"
                >
                  {DAYS_OF_WEEK.map((day, index) => (
                    <option key={index + 1} value={index + 1}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heure de début
                  </label>
                  <input
                    type="time"
                    value={newGroup.startTime}
                    onChange={(e) =>
                      setNewGroup({ ...newGroup, startTime: e.target.value })
                    }
                    className="w-full border-2 border-gray-300 rounded-md p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heure de fin
                  </label>
                  <input
                    type="time"
                    value={newGroup.endTime}
                    onChange={(e) =>
                      setNewGroup({ ...newGroup, endTime: e.target.value })
                    }
                    className="w-full border-2 border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Niveau
                </label>
                <select
                  value={newGroup.level}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, level: e.target.value })
                  }
                  className="w-full border-2 border-gray-300 rounded-md p-2"
                >
                  <option value="PPES">PPES</option>
                  <option value="CCEM">CCEM</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 