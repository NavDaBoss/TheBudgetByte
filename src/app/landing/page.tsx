'use client';

  // git config --global user.email "you@example.com"
  // git config --global user.name "Your Name"

// pages/BudgetBytePage.js
import Head from 'next/head';
import '../globals.css';
import styles from './landing.module.css';
import { useRouter } from 'next/navigation';

export default function BudgetBytePage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <div>
      <Head>
        <title>Budget Byte</title>
      </Head>
      <div className={styles.titleContainer}>
        <h1 className={styles.h1}>BUDGET BYTE</h1>
      </div>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <h2 className={styles.h2}>Your website for health and wealth</h2>
          <p className={styles.description}>
            Scan your receipt from your most recent grocery trip
          </p>
          <div className={styles.buttonGroup}>
            <button className={styles.scanButton}>SCAN RECEIPT</button>
            <button className={styles.loginButton} onClick={handleLogin}>
              LOGIN
            </button>
          </div>
        </div>
        <div className={styles.rightSection}>
          <div className={styles.receipt}>
            <p className={styles.date}>Thursday, October 10, 2024</p>
            <h3>Grocery Trip #0001 for Eric</h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>QTY</th>
                  <th>ITEMS</th>
                  <th>CATEGORY</th>
                  <th>PRICE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>01</td>
                  <td>Bagels</td>
                  <td>Grains</td>
                  <td>$4.66</td>
                </tr>
                <tr>
                  <td>02</td>
                  <td>Cheese</td>
                  <td>Dairy</td>
                  <td>$3.45</td>
                </tr>
                <tr>
                  <td>03</td>
                  <td>Apples</td>
                  <td>Fruits</td>
                  <td>$1.99</td>
                </tr>
              </tbody>
            </table>
            <div className={styles.summary}>
              <p>Item Count: 6</p>
              <p>Total: $17.53</p>
            </div>
            <div className={styles.chart}>{/* Placeholder for chart */}</div>
          </div>
        </div>
      </div>
    </div>
  );
}