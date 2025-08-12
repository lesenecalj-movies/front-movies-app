'use client';

import { login } from '@/app/actions/auth';
import { useAuth } from '@/context/AuthContext';
import * as Dialog from '@radix-ui/react-dialog';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

type FormData = { email: string; password: string };

export default function LoginModal() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const { register, handleSubmit, formState } = useForm<FormData>();
  const [pending, startTransition] = useTransition();
  const { setUser } = useAuth();

  const onClose = () => {
    if (history.length > 1) router.back();
    else router.push('/');
  };

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const res = await login(data);
      if (res.ok) {
        const { user } = await fetch('/api/session', {
          cache: 'no-store',
        }).then((r) => r.json());
        setUser(user);
        router.refresh();
        onClose();
      } else {
        setErrorMessage(res.error || 'Identifiants invalides.');
      }
    });
  });

  return (
    <Dialog.Root open onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay style={overlayStyle} />
        <Dialog.Content style={contentStyle} aria-describedby={undefined}>
          <Dialog.Title style={{ fontWeight: 600 }}>Login</Dialog.Title>
          <form
            onSubmit={onSubmit}
            style={{ display: 'grid', gap: 12, marginTop: 12 }}
          >
            <input
              type="email"
              placeholder="Email"
              autoComplete="email"
              {...register('email', { required: true })}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              autoComplete="current-password"
              {...register('password', { required: true, minLength: 8 })}
            />

            {errorMessage && (
              <div style={{ color: 'red', fontSize: '0.875rem' }}>
                {errorMessage}
              </div>
            )}

            <button type="submit" disabled={pending || formState.isSubmitting}>
              {pending ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
          <button onClick={onClose} style={{ marginTop: 8 }}>
            Cancel
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.4)',
  zIndex: 1000,
};
const contentStyle: React.CSSProperties = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: 'white',
  padding: 20,
  borderRadius: 12,
  minWidth: 320,
  zIndex: 1001,
};
