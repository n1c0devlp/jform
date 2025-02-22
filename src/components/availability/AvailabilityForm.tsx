'use client';

import { useState } from 'react';
import { TimeSlot, StudentInfo, StudentInfoErrors } from './types';
import AvailabilityCalendar from './AvailabilityCalendar';
import { DAYS_OF_WEEK, INSTRUMENTS, LEVELS, TEACHERS } from '@/lib/constants';

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

export default function AvailabilityForm() {
  const [availabilities, setAvailabilities] = useState<TimeSlot[]>([]);
  const [currentSlot, setCurrentSlot] = useState<TimeSlot>({
    dayOfWeek: 1,
    startTime: '08:00',
    endTime: '09:00',
  });

  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    firstName: '',
    lastName: '',
    age: null,
    instrument: INSTRUMENTS[0],
    secondaryInstrument: null,
    level: LEVELS[0].code,
    teacher: TEACHERS[0],
    phone: '',
    email: '',
  });

  const [errors, setErrors] = useState<StudentInfoErrors>({});

  const validateForm = (): boolean => {
    const newErrors: StudentInfoErrors = {};

    if (!studentInfo.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }

    if (!studentInfo.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }

    if (!studentInfo.age || studentInfo.age < 10 || studentInfo.age > 70) {
      newErrors.age = 'L\'âge doit être compris entre 10 et 70 ans';
    }

    const phoneRegex = /^(\d{2} ){4}\d{2}$/;
    if (!phoneRegex.test(studentInfo.phone)) {
      newErrors.phone = 'Format invalide. Utilisez le format 00 00 00 00 00';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentInfo.email)) {
      newErrors.email = 'Adresse email invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSlot = () => {
    setAvailabilities([...availabilities, currentSlot]);
    setCurrentSlot({
      dayOfWeek: 1,
      startTime: '08:00',
      endTime: '09:00',
    });
  };

  const handleRemoveSlot = (index: number) => {
    setAvailabilities(availabilities.filter((_, i) => i !== index));
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const chars = numbers.split('');
    const formatted = chars
      .reduce((acc, curr, i) => {
        if (i && i % 2 === 0 && i < 10) return `${acc} ${curr}`;
        return `${acc}${curr}`;
      }, '');
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setStudentInfo({ ...studentInfo, phone: formatted });
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setStudentInfo({ ...studentInfo, age: null });
    } else {
      const age = parseInt(value, 10);
      setStudentInfo({ ...studentInfo, age: isNaN(age) ? null : age });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    if (availabilities.length === 0) {
      alert('Veuillez ajouter au moins une disponibilité');
      return;
    }

    try {
      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentInfo,
          availabilities,
        }),
      });
      
      if (response.ok) {
        alert('Vos informations ont été enregistrées avec succès !');
        setAvailabilities([]);
      } else {
        alert('Une erreur est survenue lors de l\'enregistrement.');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de l\'enregistrement.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Informations personnelles</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input
              type="text"
              value={studentInfo.lastName}
              onChange={(e) => setStudentInfo({ ...studentInfo, lastName: e.target.value })}
              className="w-full bg-gray-50 border-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              required
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom
            </label>
            <input
              type="text"
              value={studentInfo.firstName}
              onChange={(e) => setStudentInfo({ ...studentInfo, firstName: e.target.value })}
              className="w-full bg-gray-50 border-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              required
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Âge
            </label>
            <input
              type="number"
              min="10"
              max="70"
              value={studentInfo.age === null ? '' : studentInfo.age.toString()}
              onChange={handleAgeChange}
              className="w-full bg-gray-50 border-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              required
            />
            {errors.age && (
              <p className="text-red-500 text-sm mt-1">{errors.age}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instrument principal
            </label>
            <select
              value={studentInfo.instrument}
              onChange={(e) => setStudentInfo({ ...studentInfo, instrument: e.target.value })}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              {INSTRUMENTS.map((instrument) => (
                <option key={instrument} value={instrument}>
                  {instrument}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Niveau instrument principal
            </label>
            <select
              value={studentInfo.level}
              onChange={(e) => setStudentInfo({ ...studentInfo, level: e.target.value })}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              {LEVELS.map((level) => (
                <option key={level.code} value={level.code}>
                  {level.code} ({level.description})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instrument secondaire
            </label>
            <select
              value={studentInfo.secondaryInstrument || ''}
              onChange={(e) => setStudentInfo({ ...studentInfo, secondaryInstrument: e.target.value || null })}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Aucun instrument secondaire</option>
              {INSTRUMENTS.map((instrument) => (
                <option key={instrument} value={instrument}>
                  {instrument}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Professeur d'instrument
            </label>
            <select
              value={studentInfo.teacher}
              onChange={(e) => setStudentInfo({ ...studentInfo, teacher: e.target.value })}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              {TEACHERS.map((teacher) => (
                <option key={teacher} value={teacher}>
                  {teacher}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input
              type="text"
              value={studentInfo.phone}
              onChange={handlePhoneChange}
              placeholder="00 00 00 00 00"
              maxLength={14}
              className="w-full bg-gray-50 border-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              required
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={studentInfo.email}
              onChange={(e) => setStudentInfo({ ...studentInfo, email: e.target.value })}
              className="w-full bg-gray-50 border-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-2xl font-bold mb-6">Ajouter vos disponibilités</h2>
          
          <div className="mb-8 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jour
                </label>
                <select
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={currentSlot.dayOfWeek}
                  onChange={(e) => setCurrentSlot({
                    ...currentSlot,
                    dayOfWeek: parseInt(e.target.value),
                  })}
                >
                  {DAYS_OF_WEEK.map((day, index) => (
                    <option key={index + 1} value={index + 1}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heure de début
                </label>
                <select
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={currentSlot.startTime}
                  onChange={(e) => setCurrentSlot({
                    ...currentSlot,
                    startTime: e.target.value,
                  })}
                >
                  {TIME_SLOTS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heure de fin
                </label>
                <select
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={currentSlot.endTime}
                  onChange={(e) => setCurrentSlot({
                    ...currentSlot,
                    endTime: e.target.value,
                  })}
                >
                  {TIME_SLOTS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddSlot}
              className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
            >
              Ajouter ce créneau
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Créneaux sélectionnés :</h3>
            {availabilities.length === 0 ? (
              <p className="text-gray-500 italic">Aucun créneau sélectionné</p>
            ) : (
              <ul className="space-y-2">
                {availabilities.map((slot, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded"
                  >
                    <span>
                      {DAYS_OF_WEEK[slot.dayOfWeek - 1]} de {slot.startTime} à{' '}
                      {slot.endTime}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSlot(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Supprimer
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {availabilities.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Aperçu du calendrier</h2>
            <AvailabilityCalendar availabilities={availabilities} />
          </div>
        )}

        <button
          type="submit"
          disabled={availabilities.length === 0}
          className="w-full mt-8 bg-green-600 text-white py-3 px-4 rounded hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-semibold"
        >
          Enregistrer mes disponibilités
        </button>
      </form>
    </div>
  );
} 