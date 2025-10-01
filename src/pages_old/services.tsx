import Head from 'next/head';
import styles from '../styles/Home.module.css';

const services = [
  {
    id: 1,
    name: 'Web Development',
    description: 'We build modern, responsive, and user-friendly websites tailored to your business needs.',
    price: 'Starting at $1,500',
  },
  {
    id: 2,
    name: 'Mobile App Development',
    description: 'From concept to launch, we create native and cross-platform mobile apps for iOS and Android.',
    price: 'Starting at $5,000',
  },
  {
    id: 3,
    name: 'Digital Marketing',
    description: 'Boost your online presence and reach your target audience with our comprehensive digital marketing strategies.',
    price: 'Contact for quote',
  },
];

export default function ServicesPage() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Our Services - Sharif-Ro</title>
        <meta name="description" content="Explore our professional service offerings." />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Our Services</h1>
        <div className={styles.grid}>
          {services.map((service) => (
            <div key={service.id} className={styles.card}>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <p className={styles.price}>{service.price}</p>
              <button className={styles.button}>Learn More</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
