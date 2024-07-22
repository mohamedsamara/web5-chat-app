import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Web5 } from "@web5/api";

import { ProtocolDefinition } from "lib/protocols";
import SpinnerOverlay from "components/SpinnerOverlay";

// const DID_STORAGE_KEY = "did-key";

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

  useEffect(() => {
    connect();
  }, []);

  const connect = useCallback(async () => {
    try {
      const { web5, did } = await Web5.connect({ sync: "2s" });

      setWeb5(web5);
      setDid(did);

      configureProtocol(web5, did);
    } catch (error) {
      console.log("error", error);
    }
  }, []);

  const disconnect = () => {
    setWeb5(null);
    setDid(null);
  };

  const configureProtocol = async (web5: Web5, did: string) => {
    try {
      const { protocols, status } = await web5.dwn.protocols.query({
        message: {
          filter: {
            protocol: ProtocolDefinition.protocol,
          },
        },
      });

      if (status.code !== 200) {
        console.error("Error querying protocols");
        console.error("Error querying protocols", status);
        return;
      }

      if (protocols.length > 0) {
        console.log("Protocol already exists");
        return;
      }

      const { status: configureStatus, protocol } =
        await web5.dwn.protocols.configure({
          message: {
            definition: ProtocolDefinition,
          },
        });

      console.log("Protocol configured", configureStatus, protocol);

      if (!protocol) return;

      const { status: configureRemoteStatus } = await protocol.send(did);
      console.log("Protocol configured on remote DWN", configureRemoteStatus);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
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
      {loading ? <SpinnerOverlay /> : children}
    </Web5Context.Provider>
  );
};

export const useWeb5 = () => useContext(Web5Context);
