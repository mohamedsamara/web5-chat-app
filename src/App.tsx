import { useEffect } from "react";
import { useWeb5 } from "./lib/contexts";
import { useMsgs } from "./lib/hooks";

const App = () => {
  const { did, connect, disconnect } = useWeb5();
  const { fetchMsgs, createMsg, msgs } = useMsgs();

  useEffect(() => {
    fetchMsgs();
  }, []);

  const onCreateMsg = async () => {
    if (!did) return;

    await createMsg({
      recipientDid:
        "did:dht:zxzf1bgtt69me4986pqo5a4z4q8hbb3x9aasm6m3odfymmxcu33y",
      content: "Hello!",
    });
  };

  return (
    <>
      <p>{did}</p>
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>

      <div>
        <button onClick={onCreateMsg}>Send</button>
      </div>

      <div>
        {msgs.map((msg) => (
          <div key={msg.uid}>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default App;
