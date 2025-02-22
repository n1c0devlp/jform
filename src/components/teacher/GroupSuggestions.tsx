import { useState, useEffect } from 'react';
import { DAYS_OF_WEEK, INSTRUMENTS, LEVELS, Level } from '@/lib/constants';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  instrument: string;
  level: string;
}

interface GroupSuggestion {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  students: Student[];
  suggestedName: string;
}

interface InstrumentCount {
  instrument: string;
  count: number;
}

const TIME_SLOTS = Array.from({ length: 14 }, (_, i) => {
  const hour = (i + 8).toString().padStart(2, '0'); // De 8h à 21h
  return `${hour}:00`;
});

// Fonction utilitaire pour obtenir la description d'un niveau à partir de son code
const getLevelDescription = (code: string): string => {
  const level = LEVELS.find(l => l.code === code);
  return level ? `${level.code} (${level.description})` : code;
};

export default function GroupSuggestions() {
  const [suggestions, setSuggestions] = useState<GroupSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedInstruments, setSelectedInstruments] = useState<InstrumentCount[]>([]);
  const [filters, setFilters] = useState({
    level: '',
    dayOfWeek: '',
    startTime: '',
    endTime: '',
  });

  const handleAddInstrument = () => {
    setSelectedInstruments([...selectedInstruments, { instrument: INSTRUMENTS[0], count: 1 }]);
  };

  const handleRemoveInstrument = (index: number) => {
    setSelectedInstruments(selectedInstruments.filter((_, i) => i !== index));
  };

  const handleInstrumentChange = (index: number, field: 'instrument' | 'count', value: string | number) => {
    const newInstruments = [...selectedInstruments];
    if (field === 'instrument') {
      newInstruments[index].instrument = value as string;
    } else {
      newInstruments[index].count = Math.max(1, Number(value));
    }
    setSelectedInstruments(newInstruments);
  };

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instruments: selectedInstruments,
          level: filters.level || undefined,
          dayOfWeek: filters.dayOfWeek ? parseInt(filters.dayOfWeek) : undefined,
          startTime: filters.startTime || undefined,
          endTime: filters.endTime || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des suggestions');
      }

      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (suggestion: GroupSuggestion) => {
    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: suggestion.suggestedName,
          dayOfWeek: suggestion.dayOfWeek,
          startTime: suggestion.startTime,
          endTime: suggestion.endTime,
          level: suggestion.students[0].level,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du groupe');
      }

      alert('Groupe créé avec succès !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création du groupe');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Instruments requis
            </h3>
            <button
              onClick={handleAddInstrument}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-sm"
            >
              Ajouter un instrument
            </button>
          </div>
          
          <div className="space-y-3">
            {selectedInstruments.map((item, index) => (
              <div key={index} className="flex gap-3 items-center">
                <select
                  value={item.instrument}
                  onChange={(e) => handleInstrumentChange(index, 'instrument', e.target.value)}
                  className="flex-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 dark:text-gray-100"
                >
                  {INSTRUMENTS.map((instrument) => (
                    <option key={instrument} value={instrument}>
                      {instrument}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    Nombre :
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.count}
                    onChange={(e) => handleInstrumentChange(index, 'count', e.target.value)}
                    className="w-20 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 dark:text-gray-100"
                  />
                </div>
                <button
                  onClick={() => handleRemoveInstrument(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            ))}
            {selectedInstruments.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                Aucun instrument sélectionné
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Niveau
            </label>
            <select
              value={filters.level}
              onChange={(e) => setFilters({ ...filters, level: e.target.value })}
              className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 dark:text-gray-100"
            >
              <option value="">Tous</option>
              {LEVELS.map((level) => (
                <option key={level.code} value={level.code}>
                  {level.code} ({level.description})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Jour
            </label>
            <select
              value={filters.dayOfWeek}
              onChange={(e) =>
                setFilters({ ...filters, dayOfWeek: e.target.value })
              }
              className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 dark:text-gray-100"
            >
              <option value="">Tous</option>
              {DAYS_OF_WEEK.map((day, index) => (
                <option key={index + 1} value={index + 1}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Heure de début
            </label>
            <select
              value={filters.startTime}
              onChange={(e) =>
                setFilters({ ...filters, startTime: e.target.value })
              }
              className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 dark:text-gray-100"
            >
              <option value="">Toutes</option>
              {TIME_SLOTS.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Heure de fin
            </label>
            <select
              value={filters.endTime}
              onChange={(e) =>
                setFilters({ ...filters, endTime: e.target.value })
              }
              className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 dark:text-gray-100"
            >
              <option value="">Toutes</option>
              {TIME_SLOTS.slice(1).map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={fetchSuggestions}
        disabled={selectedInstruments.length === 0}
        className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Générer des suggestions
      </button>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
      ) : suggestions.length > 0 ? (
        <div className="grid gap-6">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {suggestion.suggestedName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {DAYS_OF_WEEK[suggestion.dayOfWeek - 1]} de{' '}
                    {suggestion.startTime} à {suggestion.endTime}
                  </p>
                </div>
                <button
                  onClick={() => handleCreateGroup(suggestion)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  Créer ce groupe
                </button>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Élèves disponibles ({suggestion.students.length})
                </h4>
                <ul className="space-y-2">
                  {suggestion.students.map((student) => (
                    <li
                      key={student.id}
                      className="text-sm text-gray-600 dark:text-gray-400 flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded"
                    >
                      <span>
                        {student.firstName} {student.lastName}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {student.instrument} - {getLevelDescription(student.level)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
          Aucune suggestion de groupe disponible avec ces critères.
        </p>
      )}
    </div>
  );
} 