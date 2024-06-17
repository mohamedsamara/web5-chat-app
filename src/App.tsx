import { useWeb5 } from "./lib/contexts";

const App = () => {
  const { did, connect, disconnect } = useWeb5();

  return (
    <>
      <p>{did}</p>
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
    </>
  );
};

export default App;
