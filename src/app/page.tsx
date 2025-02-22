export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Bienvenue sur JForm
      </h1>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Espace Élèves</h2>
          <p className="text-gray-600 mb-4">
            Remplissez vos disponibilités pour la semaine et rejoignez un groupe adapté à votre niveau.
          </p>
          <a
            href="/student/availability"
            className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Accéder au formulaire
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Espace Professeurs</h2>
          <p className="text-gray-600 mb-4">
            Gérez les groupes et consultez les disponibilités des élèves.
          </p>
          <a
            href="/teacher/dashboard"
            className="block w-full text-center bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
          >
            Accéder au tableau de bord
          </a>
        </div>
      </div>
    </div>
  )
}
