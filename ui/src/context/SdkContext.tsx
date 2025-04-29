import React, { createContext, useContext, useState, useEffect } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { MscpSdk } from "../../sdk";

interface SdkContextType {
  sdk: MscpSdk | null;
  connection: Connection | null;
}

const SdkContext = createContext<SdkContextType>({
  sdk: null,
  connection: null,
});

export const useSdk = () => useContext(SdkContext);

export const SdkProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { publicKey } = useWallet();
  const [sdk, setSdk] = useState<MscpSdk | null>(null);
  const [connection, setConnection] = useState<Connection | null>(null);

  useEffect(() => {
    if (publicKey) {
      const conn = new Connection("https://api.devnet.solana.com");
      setConnection(conn);
      const sdkInstance = new MscpSdk(conn);
      setSdk(sdkInstance);
    } else {
      setSdk(null);
      setConnection(null);
    }
  }, [publicKey]);

  return (
    <SdkContext.Provider value={{ sdk, connection }}>
      {children}
    </SdkContext.Provider>
  );
};
