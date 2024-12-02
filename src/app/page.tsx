'use client';

import styles from './page.module.css'; // Importing the CSS module for styling
import { useRouter } from 'next/navigation'; // Importing useRouter from Next.js to handle routing

export default function Home() {
  const router = useRouter(); // Creating the router object for navigation

  // Function to navigate the user to the login page
  const navigateToLogin = () => {
    router.push('/login'); // Pushing the login page route when the user clicks the button
  };

  return (
    <div className={styles.container}>
      {/* Header Section: Contains logo and login button */}
      <header className={styles.header}>
        {/* Logo Section */}
        <h1 className={styles.logo}>BUDGET BYTE</h1>
        {/* Login Button: Directs users to the login page */}
        <button className={styles.loginBtn} onClick={navigateToLogin}>
          Login
        </button>
      </header>

      <main className={styles.main}>
        {/* Section 1: Receipt Parsing */}
        <section className={styles.section}>
          <div className={styles.textBlock}>
            {/* Description of the Receipt Parsing feature */}
            <p>
              <strong>Smart Receipt Parsing</strong> | Upload your grocery
              receipts, and our AI will automatically parse and categorize the
              items into food groups like fruits, vegetables, grains, protein,
              and others. Easily edit items to ensure accurate tracking.
            </p>
            {/* Scan Receipt Button: Redirects to login or receipt scanning page */}
            <button className={styles.scanBtn} onClick={navigateToLogin}>
              Scan Receipt
            </button>
          </div>
          {/* Image representing receipt parsing */}
          <img
            src="/images/reciept.png"
            alt="Receipt Diagram"
            className={styles.image}
          />
        </section>

        {/* Section 2: Monthly Spending Analytics */}
        <section className={styles.section}>
          {/* Image showcasing the monthly spending graph */}
          <img
            src="/images/graph.png"
            alt="Monthly Spending Graph"
            className={styles.image}
          />
          <div className={styles.textBlock}>
            {/* Description of the Monthly Spending Analytics feature */}
            <p>
              <strong>Monthly Spending Analytics</strong> | Visualize your
              grocery expenses over time with detailed breakdowns by food group.
              Track trends in your spending habits and see where your budget is
              going.
            </p>
          </div>
        </section>

        {/* Section 3: Lifetime Stats */}
        <section className={styles.section}>
          <div className={styles.textBlock}>
            {/* Description of the Lifetime Stats feature */}
            <p>
              <strong>Lifetime Stats</strong> | Get a comprehensive summary of
              your grocery spending, including total receipts scanned and
              lifetime spending in each food category. Gain a deeper
              understanding of your purchasing habits.
            </p>
          </div>
          {/* Image representing the lifetime stats pie chart */}
          <img
            src="/images/pie.png"
            alt="Lifetime Stats Diagram"
            className={styles.image}
          />
        </section>
      </main>

      {/* Footer Section: Contact and Legal Information */}
      <footer className={styles.footer}>
        {/* Copyright Information */}
        <p>© 2024 BudgetByte</p>
        {/* Contact Information */}
        <p>Contact Us: BudgetByte@budgetbyte.com</p>
      </footer>
    </div>
  );
}
