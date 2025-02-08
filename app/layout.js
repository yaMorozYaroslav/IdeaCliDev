'use client';

import StyledComponentsRegistry from '../lib/StyledComponentsRegistry';
import Header from '../comps/Header';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function RootLayout({ children }) {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const response = await axios.get('http://localhost:5000/google/me', {
        withCredentials: true,
      });
      setUser(response.data);
    } catch (error) {
      console.log('User not authenticated');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <Header user={user} refreshUser={fetchUser} />
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
