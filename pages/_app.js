import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/propstyle.css';
import { useEffect, useState } from 'react';
import { getPublicKey } from '@stellar/freighter-api';
import { checkConnection, retrievePublicKey } from '../components/freighter'; // Assuming you still need to check connection status

function MyApp({ Component, pageProps }) {
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState('');

  useEffect(() => {
    async function init() {
      try {
        const connected = await checkConnection();
        setIsConnected(connected);

        if (connected) {
          const key = await getPublicKey();
          setPublicKey(key);
        }
      } catch (error) {
        console.error("Error checking connection or retrieving public key:", error);
      }
    }

    init();
  }, []);

  return (
    <div className="back">
      {isConnected ? (
        <Component {...pageProps} publicKey={publicKey} />
      ) : (
        <div className="container">
          <h1>Please connect to Freighter</h1>
        </div>
      )}
    </div>
  );
}

export default MyApp;
