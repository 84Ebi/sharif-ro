import Head from 'next/head';
import styles from '../styles/Home.module.css';

const products = [
  {
    id: 1,
    name: 'Smartwatch',
    description: 'Stay connected and track your fitness goals with this sleek and powerful smartwatch.',
    price: 249.99,
    image: '/smartwatch.jpg',
  },
  {
    id: 2,
    name: 'Wireless Headphones',
    description: 'Immerse yourself in high-quality audio with these comfortable and noise-cancelling wireless headphones.',
    price: 179.99,
    image: '/headphones.jpg',
  },
  {
    id: 3,
    name: 'Portable Blender',
    description: 'Enjoy fresh smoothies and shakes on the go with this compact and rechargeable portable blender.',
    price: 49.99,
    image: '/blender.jpg',
  },
];

export default function ProductsPage() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Our Products - Sharif-Ro</title>
        <meta name="description" content="Browse our collection of innovative products." />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Our Products</h1>
        <div className={styles.grid}>
          {products.map((product) => (
            <div key={product.id} className={styles.card}>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className={styles.price}>${product.price.toFixed(2)}</p>
              <button className={styles.button}>Add to Cart</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
