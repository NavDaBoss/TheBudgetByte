// pages/profile.jsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/router'; // Correct import for Pages Router
import "./profile.css";

export default function Profile() {
  return (
    <div>
      <h1>Profile</h1>
      <p>Hey Display Name</p>
    </div>
  );
};
