'use client';

import styles from './page.module.css';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const navigateToLogin = () => {
    router.push('/login');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>   {/*  Might change this later on */}
        <h1 className={styles.logo}>BUDGET BYTE</h1>
        <button className={styles.loginBtn} onClick={navigateToLogin}>Login</button>
      </header>

      <main className={styles.main}>
        {/* Section 1: Receipt Parsing */}
        <section className={styles.section}>
          <div className={styles.textBlock}>
            <p>
              <strong>Smart Receipt Parsing</strong> | Upload your grocery receipts, and our AI will automatically parse
              and categorize the items into food groups like fruits, vegetables,
              grains, protein, and others. Easily edit items to ensure accurate
              tracking.
            </p>
            <button className={styles.scanBtn} onClick={navigateToLogin}>Scan Receipt</button>
          </div>
          <img
            src="/images/reciept.png"
            alt="Receipt Diagram"
            className={styles.image}
          />
        </section>

        {/* Section 2: Monthly Spending Analytics */}
        <section className={styles.section}>
          <img
            src="/images/graph.png"
            alt="Monthly Spending Graph"
            className={styles.image}
          />
          <div className={styles.textBlock}>
            <p>
              <strong>Monthly Spending Analytics</strong> | Visualize your grocery expenses over time with detailed
              breakdowns by food group. Track trends in your spending habits and
              see where your budget is going.
            </p>
          </div>
        </section>

        {/* Section 3: Lifetime Stats */}
        <section className={styles.section}>
          <div className={styles.textBlock}>
            <p>
              <strong>Lifetime Stats</strong> | Get a comprehensive summary of your grocery spending, including
              total receipts scanned and lifetime spending in each food
              category. Gain a deeper understanding of your purchasing habits.
            </p>
          </div>
          <img
            src="/images/pie.png"
            alt="Lifetime Stats Diagram"
            className={styles.image}
          />
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© 2024 BudgetByte</p>
        <p>Contact Us: BudgetByte@budgetbyte.com</p>
        {/* <div className={styles.socials}>
          <span>✖</span>
          <span>✕</span>
          <span>✕</span>
        </div> */}
      </footer>
    </div>
  );
}
