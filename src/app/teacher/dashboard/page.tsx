import TeacherDashboard from '@/components/teacher/TeacherDashboard';

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Tableau de bord professeur</h1>
          <p className="text-gray-600">
            Gérez les groupes et consultez les disponibilités des élèves.
          </p>
        </div>

        <TeacherDashboard />
      </div>
    </div>
  );
} 