import Head from 'next/head';
import styles from '../styles/Home.module.css';

const products = [
  {
    id: 1,
    name: 'Smartwatch',
    description: 'Stay connected and track your fitness goals with this sleek and powerful smartwatch.',
    price: 249.99,
    image: '/smartwatch.jpg', // Replace with your image path
  },
  {
    id: 2,
    name: 'Wireless Headphones',
    description: 'Immerse yourself in high-quality audio with these comfortable and noise-cancelling wireless headphones.',
    price: 179.99,
    image: '/headphones.jpg', // Replace with your image path
  },
  {
    id: 3,
    name: 'Portable Blender',
    description: 'Enjoy fresh smoothies and shakes on the go with this compact and rechargeable portable blender.',
    price: 49.99,
    image: '/blender.jpg', // Replace with your image path
  },
];

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

export default function Dashboard() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Sharif-Ro - Products and Services</title>
        <meta name="description" content="Your one-stop shop for innovative products and professional services." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Sharif-Ro
        </h1>

        <p className={styles.description}>
          Your one-stop shop for innovative products and professional services.
        </p>

        <section className={styles.section}>
          <h2>Our Products</h2>
          <div className={styles.grid}>
            {products.map((product) => (
              <div key={product.id} className={styles.card}>
                {/* You can add an Image component here if you have images */}
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p className={styles.price}>${product.price.toFixed(2)}</p>
                <button className={styles.button}>Add to Cart</button>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2>Our Services</h2>
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
        </section>
      </main>

      <footer className={styles.footer}>
        <p>
          Powered by{' '}
          <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
            Vercel
          </a>
        </p>
      </footer>
    </div>
  );
}
