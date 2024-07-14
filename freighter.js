import {
  requestAccess,
  signTransaction,
  setAllowed,
} from "@stellar/freighter-api";

// Check if Freighter is connected and allowed
async function checkConnection() {
  try {
    const isAllowed = await setAllowed();
    return isAllowed;
  } catch (error) {
    console.error("Error checking connection status:", error);
    return false;
  }
}

// Retrieve the user's public key from Freighter
const retrievePublicKey = async () => {
  try {
    const publicKey = await requestAccess();
    return publicKey;
  } catch (error) {
    console.error("Error retrieving public key:", error);
    return error;
  }
};

// Get the user's public key
const getPublicKey = async () => {
  try {
    const publicKey = await retrievePublicKey();
    return publicKey;
  } catch (error) {
    console.error("Error getting public key:", error);
    return error;
  }
};

// Sign a transaction using Freighter
const userSignTransaction = async (xdr, network, signWith) => {
  try {
    const signedTransaction = await signTransaction(xdr, {
      network,
      accountToSign: signWith,
    });
    return signedTransaction;
  } catch (error) {
    console.error("Error signing transaction:", error);
    return error;
  }
};

export { retrievePublicKey, checkConnection, userSignTransaction, getPublicKey };
