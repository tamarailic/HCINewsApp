import '@/styles/globals.css'
import React, { useState } from 'react';

export const MyAppContext = React.createContext({});

export default function MyApp({ Component, pageProps }) {
  const [myGlobalData, setMyGlobalData] = useState(null);

  return (
    <MyAppContext.Provider value={{ myGlobalData, setMyGlobalData }}>
      <Component {...pageProps} />
    </MyAppContext.Provider>
  );
}

