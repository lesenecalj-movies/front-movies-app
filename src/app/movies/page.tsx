'use client';
import ChatWindow from '@/components/chats/ChatWindow';
import CategoriesMovies from '@/components/movies/CategoriesMovies';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import GridMovies from '../../components/movies/GridMovies';
import styles from '../../styles/movies.module.scss';
import { useAuth } from '@/context/AuthContext';
import UserMenu from '@/components/users/UserMenu';

export default function Movies() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [viewMode, setViewMode] = useState<'search' | 'grid' | 'categories'>(
    'grid',
  );

  const openLogin = () => {
    router.push('/auth/login');
  };

  return (
    <div className={styles.container}>
      <header className={styles.container_movies_header}>
        <div className={styles.container_movies_title}>
          <h1>Movies 🎬</h1>
        </div>
        <div className={styles.container_movies_user}>
          {isAuthenticated ? (
            <UserMenu email={user?.email as string} />
          ) : (
            <button onClick={openLogin}>Log in</button>
          )}
        </div>
      </header>

      <main className={styles.container_movies_display}>
        <div className={styles.display}>
          <button onClick={() => setViewMode('search')}>
            <Image
              src="/icons/search.png"
              alt="Grille"
              width={24}
              height={24}
            />
          </button>
          <button onClick={() => setViewMode('grid')}>
            <Image src="/icons/grid.png" alt="Grille" width={24} height={24} />
          </button>
          <button onClick={() => setViewMode('categories')}>
            <Image
              src="/icons/menu.png"
              alt="Catégories"
              width={24}
              height={24}
            />
          </button>
        </div>

        {viewMode === 'search' && <ChatWindow />}
        {viewMode === 'grid' && <GridMovies active={viewMode === 'grid'} />}
        {viewMode === 'categories' && (
          <CategoriesMovies active={viewMode === 'categories'} />
        )}
      </main>
    </div>
  );
}
