import {
  createContext,
  PropsWithChildren,
  useCallback,
  //   useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Web5 } from "@web5/api";

const DID_STORAGE_KEY = "did-key";

interface Web5ContextType {
  web5: Web5 | null;
  did: string | null;
  loading: boolean;
  //   error: string | null;
  connect: () => void;
  disconnect: () => void;
}

export const Web5Context = createContext<Web5ContextType>(
  {} as Web5ContextType
);

export const Web5Provider = ({ children }: PropsWithChildren) => {
  //   const [error, setError] = useState<string | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const [web5, setWeb5] = useState<Web5 | null>(null);
  const [did, setDid] = useState<string | null>(null);

  const connect = useCallback(async () => {
    try {
      setLoading(true);
      const storedDid = localStorage.getItem(DID_STORAGE_KEY);

      const { web5, did } = await Web5.connect();
      if (did !== storedDid) {
        console.log("");
      }

      setWeb5(web5);
      setDid(did);

      localStorage.setItem(DID_STORAGE_KEY, did);
    } catch (error) {
      // console.log("error", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    connect();
  }, [connect]);

  const disconnect = () => {
    setWeb5(null);
    setDid(null);
    localStorage.removeItem(DID_STORAGE_KEY);
  };

  const memoizedValue = useMemo(
    () => ({
      web5,
      did,
      loading,
      //   error,
      connect,
      disconnect,
    }),
    [loading, web5, did, connect]
  );

  return (
    <Web5Context.Provider value={memoizedValue}>
      {loading ? <div>Loading...</div> : children}
    </Web5Context.Provider>
  );
};

export const useWeb5 = () => useContext(Web5Context);
