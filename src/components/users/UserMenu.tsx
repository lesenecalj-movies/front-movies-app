import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from '@/styles/user.menu.module.scss';

type Props = { email: string };

export default function UserMenu({ email }: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const { logout } = useAuth();

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    const mouseDownClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!wrapRef.current?.contains(t)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', mouseDownClick);
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('mousedown', mouseDownClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className={styles.wrapper_user_menu} ref={wrapRef}>
      <button
        className={styles.trigger_user_menu}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => {
          setOpen((o: boolean) => !o);
        }}
      >
        {email} <span className={styles.caret}>▾</span>
      </button>

      {open && (
        <div className={styles.user_menu} role="menu">
          <button className={styles.user_menu_item} role="menuitem">
            Profile
          </button>
          <button className={styles.user_menu_item} role="menuitem">
            Settings
          </button>
          <hr className={styles.sep} />
          <button className={styles.user_menu_item} role="menuitem" onClick={logout}>
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
