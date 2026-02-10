import { useGraphQLMutation, useGraphQLQuery } from '@/hooks/useGraphQL';
import { CREATE_USER, DELETE_USER, GET_USERS } from '@repo/api';
import { CreateUserVariables, DeleteUserVariables, GetUsersVariables, User } from '@repo/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const UserList = () => {
  const { t } = useTranslation();
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });

  const { data, loading, error, refetch } = useGraphQLQuery<{ users: User[] }, GetUsersVariables>(GET_USERS, {
    variables: { limit: 10, offset: 0 },
    errorPolicy: 'all'
  });

  const [createUser, { loading: creating }] = useGraphQLMutation<{ createUser: User }, CreateUserVariables>(
    CREATE_USER,
    {
      onCompleted: () => {
        setNewUser({ name: '', email: '', password: '' });
        refetch();
      }
    }
  );

  const [deleteUser] = useGraphQLMutation<{ deleteUser: { success: boolean } }, DeleteUserVariables>(DELETE_USER, {
    onCompleted: () => refetch()
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    await createUser({
      variables: {
        input: newUser
      }
    });
  };

  const handleDeleteUser = async (id: string) => {
    await deleteUser({
      variables: { id }
    });
  };

  if (loading) return <div className="p-4">{t('userManagement.loadingUsers')}</div>;
  if (error)
    return <div className="p-4 text-red-500">{t('userManagement.errorLoadingUsers', { message: error.message })}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t('userManagement.title')}</h1>

      <form onSubmit={handleCreateUser} className="mb-8 p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-4">{t('userManagement.createNewUser')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder={t('userManagement.name')}
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="px-3 py-2 border rounded-md"
            required
          />
          <input
            type="email"
            placeholder={t('userManagement.email')}
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="px-3 py-2 border rounded-md"
            required
          />
          <input
            type="password"
            placeholder={t('userManagement.password')}
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            className="px-3 py-2 border rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          disabled={creating}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {creating ? t('userManagement.creating') : t('userManagement.createUser')}
        </button>
      </form>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{t('userManagement.users')}</h2>
        {data?.users?.map((user) => (
          <div key={user.id} className="p-4 border rounded-lg flex justify-between items-center">
            <div>
              <h3 className="font-medium">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">
                {t('userManagement.created')}: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => handleDeleteUser(user.id)}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              {t('common.delete')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
