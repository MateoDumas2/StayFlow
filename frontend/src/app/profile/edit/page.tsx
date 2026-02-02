'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
      avatar
    }
  }
`;

const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($input: UpdateUserInput!) {
    updateProfile(input: $input) {
      id
      name
      email
      avatar
    }
  }
`;

export default function EditProfilePage() {
  const router = useRouter();
  const { data, loading, error } = useQuery(ME_QUERY);
  const [updateProfile, { loading: updating }] = useMutation(UPDATE_PROFILE_MUTATION);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (data?.me) {
      setName(data.me.name || '');
      setEmail(data.me.email || '');
      setAvatar(data.me.avatar || '');
    }
  }, [data]);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !data?.me && !localStorage.getItem('token')) {
       router.push('/');
    }
  }, [data, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const input: any = {};
      if (name !== data.me.name) input.name = name;
      if (email !== data.me.email) input.email = email;
      if (avatar !== data.me.avatar) input.avatar = avatar;
      if (password) input.password = password;

      if (Object.keys(input).length === 0) {
        return;
      }

      await updateProfile({
        variables: { input },
      });

      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
      setPassword(''); // Clear password field
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error al actualizar perfil' });
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando perfil...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error al cargar perfil. Intenta iniciar sesión nuevamente.</div>;

  if (!data?.me) return null; // Will redirect

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Editar Perfil</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Preview */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-4 relative">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
              )}
            </div>
            <div className="w-full">
               <label className="block text-sm font-medium text-gray-700 mb-1">URL del Avatar</label>
               <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                placeholder="https://ejemplo.com/foto.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">Pega una URL de imagen para tu foto de perfil</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña (opcional)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
              placeholder="Deja en blanco para mantener la actual"
              minLength={6}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="button"
              variant="ghost"
              className="mr-4"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updating}
            >
              {updating ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
