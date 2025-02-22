import AvailabilityForm from '@/components/availability/AvailabilityForm';

export default function AvailabilityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Mes disponibilités</h1>
          <p className="text-gray-600">
            Indiquez vos disponibilités pour la semaine. Vous pouvez ajouter autant de créneaux que vous le souhaitez.
            Les créneaux doivent être d'au moins une heure.
          </p>
        </div>

        <AvailabilityForm />
      </div>
    </div>
  );
} 