import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { account } from '../lib/appwrite';
import styles from '../styles/Home.module.css';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await account.createEmailPasswordSession(email, password);
      } else {
        await account.create('unique()', email, password, name);
        await account.createEmailPasswordSession(email, password);
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>{isLogin ? 'Sign In' : 'Sign Up'} - Sharif-Ro</title>
        <meta name="description" content="Sign in or sign up to access your account." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.authCard}>
          <h1 className={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</h1>
          {error && <p className={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit} className={styles.form}>
            {!isLogin && (
              <div className={styles.formGroup}>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={styles.button}>
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>
          <p className={styles.toggle}>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button onClick={() => setIsLogin(!isLogin)} className={styles.toggleButton}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
