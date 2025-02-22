'use client';

import { useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import frLocale from '@fullcalendar/core/locales/fr';
import { TimeSlot } from './types';

interface AvailabilityCalendarProps {
  availabilities: TimeSlot[];
}

export default function AvailabilityCalendar({ availabilities }: AvailabilityCalendarProps) {
  const events = availabilities.map((slot) => {
    // Créer une date pour cette semaine
    const date = new Date();
    const currentDay = date.getDay(); // 0 = Dimanche, 1 = Lundi, ...
    const daysToAdd = slot.dayOfWeek - (currentDay === 0 ? 7 : currentDay);
    date.setDate(date.getDate() + daysToAdd);

    // Formater la date
    const dateStr = date.toISOString().split('T')[0];

    return {
      title: 'Disponible',
      start: `${dateStr}T${slot.startTime}`,
      end: `${dateStr}T${slot.endTime}`,
      backgroundColor: '#3B82F6', // blue-500
      borderColor: '#2563EB', // blue-600
    };
  });

  return (
    <div className="h-[600px] bg-white p-4 rounded-lg shadow-lg">
      <FullCalendar
        plugins={[timeGridPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: '',
          center: 'title',
          right: '',
        }}
        locale={frLocale}
        slotMinTime="08:00:00"
        slotMaxTime="22:00:00"
        allDaySlot={false}
        expandRows={true}
        dayHeaderFormat={{ weekday: 'long' }}
        events={events}
        hiddenDays={[0]} // Cacher le dimanche
        height="100%"
        slotDuration="01:00:00"
        eventDisplay="block"
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
      />
    </div>
  );
} 