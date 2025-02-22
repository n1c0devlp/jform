import { useState } from 'react';
import { INSTRUMENTS, LEVELS, TEACHERS, Level } from '@/lib/constants';
import { useSession } from 'next-auth/react';

interface SettingsSection {
  title: string;
  description: string;
  type: 'instruments' | 'levels' | 'teachers' | 'users';
  requiresSuperAdmin?: boolean;
  requiresAdmin?: boolean;
}

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN' | 'SUPER_ADMIN';
  isActive: boolean;
}

const SECTIONS: SettingsSection[] = [
  {
    title: 'Instruments',
    description: 'Gérer la liste des instruments disponibles',
    type: 'instruments',
    requiresSuperAdmin: false,
    requiresAdmin: true,
  },
  {
    title: 'Niveaux',
    description: 'Gérer les différents niveaux d\'études',
    type: 'levels',
    requiresSuperAdmin: false,
    requiresAdmin: true,
  },
  {
    title: 'Professeurs',
    description: 'Gérer la liste des professeurs',
    type: 'teachers',
    requiresSuperAdmin: false,
    requiresAdmin: true,
  },
  {
    title: 'Utilisateurs',
    description: 'Gérer les accès des utilisateurs',
    type: 'users',
    requiresSuperAdmin: true,
    requiresAdmin: false,
  },
];

export default function Settings() {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === 'SUPER_ADMIN';
  const isAdmin = session?.user?.role === 'ADMIN' || isSuperAdmin;

  // Filtrer les sections en fonction du rôle de l'utilisateur
  const availableSections = SECTIONS.filter(section => {
    if (section.requiresSuperAdmin && !isSuperAdmin) return false;
    if (section.requiresAdmin && !isAdmin) return false;
    return true;
  });

  // Si l'utilisateur n'a accès à aucune section, afficher un message
  if (availableSections.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-400">Vous n'avez pas accès aux paramètres.</p>
      </div>
    );
  }

  const [activeSection, setActiveSection] = useState<SettingsSection['type']>('instruments');
  const [instruments, setInstruments] = useState<string[]>(INSTRUMENTS);
  const [levels, setLevels] = useState<Level[]>(LEVELS);
  const [teachers, setTeachers] = useState<string[]>(TEACHERS);
  const [users, setUsers] = useState<User[]>([]);
  const [newItem, setNewItem] = useState('');
  const [newLevel, setNewLevel] = useState({ code: '', description: '' });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [newUser, setNewUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'TEACHER' as User['role'],
    password: '',
  });

  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserUpdate = async (userId: string, data: Partial<User>) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de l\'utilisateur');
      }

      const updatedUser = await response.json();
      setUsers(users.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de la mise à jour');
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: activeSection,
          data: activeSection === 'levels' ? levels : activeSection === 'instruments' ? instruments : teachers,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      alert('Paramètres sauvegardés avec succès !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde des paramètres');
    }
  };

  const handleAdd = () => {
    if (activeSection === 'levels') {
      if (newLevel.code && newLevel.description) {
        setLevels([...levels, newLevel]);
        setNewLevel({ code: '', description: '' });
      }
    } else {
      if (newItem.trim()) {
        if (activeSection === 'instruments') {
          setInstruments([...instruments, newItem.trim()]);
        } else {
          setTeachers([...teachers, newItem.trim()]);
        }
        setNewItem('');
      }
    }
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    if (activeSection === 'levels') {
      setNewLevel(levels[index]);
    } else {
      setNewItem(activeSection === 'instruments' ? instruments[index] : teachers[index]);
    }
  };

  const handleUpdate = () => {
    if (editIndex === null) return;

    if (activeSection === 'levels') {
      if (newLevel.code && newLevel.description) {
        const newLevels = [...levels];
        newLevels[editIndex] = newLevel;
        setLevels(newLevels);
      }
    } else {
      if (newItem.trim()) {
        if (activeSection === 'instruments') {
          const newInstruments = [...instruments];
          newInstruments[editIndex] = newItem.trim();
          setInstruments(newInstruments);
        } else {
          const newTeachers = [...teachers];
          newTeachers[editIndex] = newItem.trim();
          setTeachers(newTeachers);
        }
      }
    }
    setEditIndex(null);
    setNewItem('');
    setNewLevel({ code: '', description: '' });
  };

  const handleDelete = (index: number) => {
    if (activeSection === 'levels') {
      setLevels(levels.filter((_, i) => i !== index));
    } else if (activeSection === 'instruments') {
      setInstruments(instruments.filter((_, i) => i !== index));
    } else {
      setTeachers(teachers.filter((_, i) => i !== index));
    }
  };

  const handleCreateUser = async () => {
    try {
      const response = await fetch('/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la création de l\'utilisateur');
      }

      const createdUser = await response.json();
      setUsers([...users, createdUser]);
      setShowNewUserModal(false);
      setNewUser({
        email: '',
        firstName: '',
        lastName: '',
        role: 'TEACHER',
        password: '',
      });
      alert('Utilisateur créé avec succès !');
    } catch (error) {
      console.error('Erreur:', error);
      alert(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUserId || !newPassword) return;

    try {
      const response = await fetch(`/api/users/${selectedUserId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la réinitialisation du mot de passe');
      }

      setShowResetPasswordModal(false);
      setSelectedUserId(null);
      setNewPassword('');
      alert('Mot de passe réinitialisé avec succès !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la réinitialisation du mot de passe');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-700">
          <nav className="flex space-x-4 px-4" aria-label="Tabs">
            {availableSections.map((section) => (
              <button
                key={section.type}
                onClick={() => {
                  setActiveSection(section.type);
                  if (section.type === 'users') {
                    fetchUsers();
                  }
                  setEditIndex(null);
                  setNewItem('');
                  setNewLevel({ code: '', description: '' });
                }}
                className={`px-3 py-2 text-sm font-medium border-b-2 ${
                  activeSection === section.type
                    ? 'border-red-500 text-red-500'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                }`}
              >
                {section.title}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-100 mb-2">
              {availableSections.find((s) => s.type === activeSection)?.title}
            </h2>
            <p className="text-sm text-gray-400">
              {availableSections.find((s) => s.type === activeSection)?.description}
            </p>
          </div>

          {activeSection === 'users' && isSuperAdmin ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-100 mb-4">Gestion des utilisateurs</h2>
                <button
                  onClick={() => setShowNewUserModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  Nouvel utilisateur
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                </div>
              ) : (
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
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col space-y-1">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={user.firstName || ''}
                                  onChange={(e) => handleUserUpdate(user.id, { firstName: e.target.value })}
                                  placeholder="Prénom"
                                  className="text-sm bg-gray-700 border-gray-600 text-gray-100 rounded-md w-32"
                                />
                                <input
                                  type="text"
                                  value={user.lastName || ''}
                                  onChange={(e) => handleUserUpdate(user.id, { lastName: e.target.value })}
                                  placeholder="Nom"
                                  className="text-sm bg-gray-700 border-gray-600 text-gray-100 rounded-md w-32"
                                />
                              </div>
                              <div className="text-sm text-gray-400">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={user.role}
                              onChange={(e) => handleUserUpdate(user.id, { role: e.target.value as User['role'] })}
                              className="bg-gray-700 border-gray-600 text-gray-100 rounded-md"
                            >
                              <option value="STUDENT">Étudiant</option>
                              <option value="TEACHER">Professeur</option>
                              <option value="ADMIN">Administrateur</option>
                              <option value="SUPER_ADMIN">Super Admin</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleUserUpdate(user.id, { isActive: !user.isActive })}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                user.isActive
                                  ? 'bg-green-900 text-green-100'
                                  : 'bg-red-900 text-red-100'
                              }`}
                            >
                              {user.isActive ? 'Actif' : 'Inactif'}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            <button
                              onClick={() => {
                                setSelectedUserId(user.id);
                                setShowResetPasswordModal(true);
                              }}
                              className="text-red-500 hover:text-red-400"
                            >
                              Réinitialiser MDP
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Formulaire d'ajout/édition */}
              <div className="mb-6 space-y-4">
                {activeSection === 'levels' ? (
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Code
                      </label>
                      <input
                        type="text"
                        value={newLevel.code}
                        onChange={(e) => setNewLevel({ ...newLevel, code: e.target.value })}
                        className="w-full border-gray-600 bg-gray-700 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 text-gray-100"
                        placeholder="ex: 3CD1"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={newLevel.description}
                        onChange={(e) => setNewLevel({ ...newLevel, description: e.target.value })}
                        className="w-full border-gray-600 bg-gray-700 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 text-gray-100"
                        placeholder="ex: CEM 1ère année"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      {activeSection === 'instruments' ? 'Instrument' : 'Professeur'}
                    </label>
                    <input
                      type="text"
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      className="w-full border-gray-600 bg-gray-700 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 text-gray-100"
                      placeholder={`Nouveau ${activeSection === 'instruments' ? 'instrument' : 'professeur'}`}
                    />
                  </div>
                )}

                <button
                  onClick={editIndex !== null ? handleUpdate : handleAdd}
                  className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
                >
                  {editIndex !== null ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>

              {/* Liste des éléments */}
              <ul className="space-y-2">
                {activeSection === 'levels' ? (
                  levels.map((level, index) => (
                    <li
                      key={`level-${level.code}-${index}`}
                      className="flex items-center justify-between p-3 bg-gray-700 rounded"
                    >
                      <span className="text-gray-100">
                        {level.code} ({level.description})
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(index)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Supprimer
                        </button>
                      </div>
                    </li>
                  ))
                ) : (
                  (activeSection === 'instruments' ? instruments : teachers).map((item, index) => (
                    <li
                      key={`${activeSection}-${item}-${index}`}
                      className="flex items-center justify-between p-3 bg-gray-700 rounded"
                    >
                      <span className="text-gray-100">{item}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(index)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Supprimer
                        </button>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </>
          )}

          <div className="mt-6">
            <button
              onClick={handleSave}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
            >
              Enregistrer les modifications
            </button>
          </div>
        </div>
      </div>

      {/* Modal de création d'utilisateur */}
      {showNewUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-100 mb-4">Créer un nouvel utilisateur</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full bg-gray-700 border-gray-600 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Prénom
                </label>
                <input
                  type="text"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                  className="w-full bg-gray-700 border-gray-600 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                  className="w-full bg-gray-700 border-gray-600 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Rôle
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as User['role'] })}
                  className="w-full bg-gray-700 border-gray-600 rounded-md"
                >
                  <option value="STUDENT">Étudiant</option>
                  <option value="TEACHER">Professeur</option>
                  <option value="ADMIN">Administrateur</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full bg-gray-700 border-gray-600 rounded-md"
                  required
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowNewUserModal(false)}
                className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateUser}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de réinitialisation de mot de passe */}
      {showResetPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-100 mb-4">Réinitialiser le mot de passe</h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-gray-700 border-gray-600 rounded-md"
                required
              />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowResetPasswordModal(false);
                  setSelectedUserId(null);
                  setNewPassword('');
                }}
                className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700"
              >
                Annuler
              </button>
              <button
                onClick={handleResetPassword}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 