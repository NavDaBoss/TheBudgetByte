"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, signOut } from "../firebase/firebaseConfig";
import "./dashboard.css";

const NavigationBar = () => {
  const router = useRouter();
  const profile = async () => {
    router.push("/profile"); // Redirect to profile
  };
  const scanReceipt = async () => {
    console.log("Scanning receipt...");
  };
  const logout = async () => {
    await signOut(auth);
    router.push("/login"); // Redirect to login
  };

  return (
    <div className="nav-bar">
      <h1>Budget Byte</h1>
      <div className="title-line"></div>
      <div className="links">
        <button onClick={profile}>Profile</button>
        <button onClick={scanReceipt}>Scan Receipt</button>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

const Table = () => {
  return (
    <>
      <table>
        <thead className="receipt-head">
          <tr>
            <th>Qty</th>
            <th>Items</th>
            <th>Category</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody className="receipt-body">
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
    </>
  );
};

const Receipt = () => {
  return (
    <div className="receipt">
      <div className="receipt-title">
        <div className="receipt-date">
          <h3>Thursday, October 10, 2024</h3>
        </div>
        <div className="dashed-line"></div>
        <p>Grocery Trip #0001 for Eric</p>
      </div>
      <div className="dashed-line"></div>
      <Table />
      <div className="dashed-line"></div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="page">
      <main>
        <NavigationBar />
        <Receipt />
      </main>
    </div>
  );
};

export default Dashboard;
