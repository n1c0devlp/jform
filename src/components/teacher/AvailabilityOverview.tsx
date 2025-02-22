'use client';

import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import frLocale from '@fullcalendar/core/locales/fr';
import { INSTRUMENTS, LEVELS } from '@/lib/constants';

interface StudentAvailability {
  id: string;
  firstName: string;
  lastName: string;
  instrument: string;
  level: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

// Couleurs pour chaque instrument
const INSTRUMENT_COLORS: { [key in typeof INSTRUMENTS[number]]: string } = {
  'Violon': '#EF4444', // Rouge
  'Alto': '#F97316', // Orange
  'Clarinette': '#3B82F6', // Bleu
  'Violoncelle': '#10B981', // Vert
  'Contrebasse': '#6366F1', // Indigo
  'Piano': '#8B5CF6', // Violet
  'Hautbois': '#EC4899', // Rose
};

type CalendarView = 'timeGridWeek' | 'listWeek';

export default function AvailabilityOverview() {
  const [availabilities, setAvailabilities] = useState<StudentAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    instruments: [] as string[],
    levels: [] as string[],
    searchQuery: '',
  });
  const [view, setView] = useState<CalendarView>('timeGridWeek');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        const response = await fetch('/api/availabilities');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des disponibilités');
        }
        const data = await response.json();
        setAvailabilities(data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailabilities();
  }, []);

  const filteredAvailabilities = availabilities.filter((availability) => {
    if (filters.instruments.length > 0 && !filters.instruments.includes(availability.instrument)) {
      return false;
    }
    if (filters.levels.length > 0 && !filters.levels.includes(availability.level)) {
      return false;
    }
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      const fullName = `${availability.firstName} ${availability.lastName}`.toLowerCase();
      if (!fullName.includes(searchLower)) {
        return false;
      }
    }
    return true;
  });

  const events = filteredAvailabilities.map((availability) => {
    // Créer une date pour cette semaine
    const date = new Date();
    const currentDay = date.getDay();
    const daysToAdd = availability.dayOfWeek - (currentDay === 0 ? 7 : currentDay);
    date.setDate(date.getDate() + daysToAdd);
    const dateStr = date.toISOString().split('T')[0];

    return {
      title: `${availability.firstName} ${availability.lastName} (${availability.level})`,
      start: `${dateStr}T${availability.startTime}`,
      end: `${dateStr}T${availability.endTime}`,
      backgroundColor: INSTRUMENT_COLORS[availability.instrument as keyof typeof INSTRUMENT_COLORS] || '#94A3B8',
      borderColor: INSTRUMENT_COLORS[availability.instrument as keyof typeof INSTRUMENT_COLORS] || '#94A3B8',
      extendedProps: {
        instrument: availability.instrument,
        level: availability.level,
      },
    };
  });

  const toggleInstrument = (instrument: string) => {
    setFilters(prev => ({
      ...prev,
      instruments: prev.instruments.includes(instrument)
        ? prev.instruments.filter(i => i !== instrument)
        : [...prev.instruments, instrument]
    }));
  };

  const toggleLevel = (level: string) => {
    setFilters(prev => ({
      ...prev,
      levels: prev.levels.includes(level)
        ? prev.levels.filter(l => l !== level)
        : [...prev.levels, level]
    }));
  };

  const clearFilters = () => {
    setFilters({
      instruments: [],
      levels: [],
      searchQuery: '',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* En-tête avec filtres et sélection de vue */}
      <div className="mb-6 space-y-4">
        {/* Barre de recherche et boutons */}
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Rechercher un élève..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              className="w-full px-4 py-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 dark:text-gray-100"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Filtres {showFilters ? '▼' : '▶'}
          </button>
          {(filters.instruments.length > 0 || filters.levels.length > 0 || filters.searchQuery) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Effacer les filtres
            </button>
          )}
        </div>

        {/* Panneau de filtres */}
        {showFilters && (
          <div className="grid grid-cols-2 gap-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {/* Filtres instruments */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Instruments ({filters.instruments.length} sélectionnés)
              </h3>
              <div className="space-y-2">
                {INSTRUMENTS.map((instrument) => (
                  <label key={instrument} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.instruments.includes(instrument)}
                      onChange={() => toggleInstrument(instrument)}
                      className="rounded border-gray-300 text-red-500 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {instrument}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filtres niveaux */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Niveaux ({filters.levels.length} sélectionnés)
              </h3>
              <div className="space-y-2">
                {LEVELS.map((level) => (
                  <label key={level.code} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.levels.includes(level.code)}
                      onChange={() => toggleLevel(level.code)}
                      className="rounded border-gray-300 text-red-500 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {level.code} ({level.description})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setView('timeGridWeek')}
            className={`px-4 py-2 rounded-md ${
              view === 'timeGridWeek'
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Semaine
          </button>
          <button
            onClick={() => setView('listWeek')}
            className={`px-4 py-2 rounded-md ${
              view === 'listWeek'
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Liste
          </button>
        </div>
      </div>

      {/* Légende des instruments */}
      <div className="mb-6 flex flex-wrap gap-4">
        {Object.entries(INSTRUMENT_COLORS).map(([instrument, color]) => (
          <div key={instrument} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: color }}
            ></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {instrument}
            </span>
          </div>
        ))}
      </div>

      {/* Calendrier */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg h-[600px]">
        <FullCalendar
          plugins={[timeGridPlugin, listPlugin]}
          initialView={view}
          headerToolbar={{
            left: '',
            center: 'title',
            right: '',
          }}
          views={{
            timeGridWeek: {
              dayHeaderFormat: { weekday: 'long' },
            },
            listWeek: {
              dayHeaderFormat: { weekday: 'long' },
              noEventsMessage: 'Aucune disponibilité pour les critères sélectionnés',
            },
          }}
          locale={frLocale}
          slotMinTime="08:00:00"
          slotMaxTime="22:00:00"
          allDaySlot={false}
          expandRows={true}
          events={events}
          hiddenDays={[0]}
          height="100%"
          slotDuration="01:00:00"
          eventDisplay="block"
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }}
          eventContent={(eventInfo) => {
            return (
              <div className="p-1 text-sm">
                <div className="font-medium">{eventInfo.event.title}</div>
                <div className="text-xs opacity-75">
                  {eventInfo.event.extendedProps.instrument}
                </div>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
} 