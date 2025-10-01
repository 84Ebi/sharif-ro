import Link from 'next/link';
import { useRouter } from 'next/router';
import { account } from '../lib/appwrite';
import styles from './Navbar.module.css';

const Navbar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/dashboard" legacyBehavior>
          <a className={styles.logo}>Sharif-Ro</a>
        </Link>
        <ul className={styles.navLinks}>
          <li>
            <Link href="/dashboard" legacyBehavior><a>Dashboard</a></Link>
          </li>
          <li>
            <Link href="/products" legacyBehavior><a>Products</a></Link>
          </li>
          <li>
            <Link href="/services" legacyBehavior><a>Services</a></Link>
          </li>
          <li>
            <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
