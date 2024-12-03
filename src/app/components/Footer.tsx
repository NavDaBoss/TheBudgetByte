import React from 'react';
import styles from '../styles/Footer.module.css'; // Assuming you're using CSS modules for styling

// This component goes on every page
// dashboard
// analytics
// profile
// login
// register
// landing --

// Usage
// import Footer from '../components/Footer';
// <Footer />

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div>
        {/* Copyright Information */}
        <p>© 2024 BudgetByte</p>
      </div>
      <div>
        {/* Contact Information */}
        <p>Contact Us: BudgetByte@budgetbyte.com</p>
      </div>
    </footer>
  );
};

export default Footer;
