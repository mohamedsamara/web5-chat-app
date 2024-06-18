import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Web5 } from "@web5/api";

import { useWeb5 } from "../contexts";
import { CreateMsgPayload, Msg } from "../types";
import ProtocolDefinition from "../protocols/protocol.json";
import { processMsgs } from "../utils";

export const useMsgs = () => {
  const { web5, did } = useWeb5();
  const [msgs, setMsgs] = useState<Msg[]>([]);

  const fetchSentMsgs = async (web5: Web5) => {
    const response = await web5.dwn.records.query({
      message: {
        filter: {
          protocol: ProtocolDefinition.protocol,
          //   schema: ProtocolDefinition.types.message.schema,
        },
      },
    });

    if (!response || !response.records) return [];

    if (response.status.code === 200) {
      return await Promise.all(
        response.records.map(async (record) => {
          return await record.data.json();
        })
      );
    }

    return [];
  };

  const fetchReceivedMsgs = async (web5: Web5, did: string) => {
    const response = await web5.dwn.records.query({
      from: did,
      message: {
        filter: {
          protocol: ProtocolDefinition.protocol,
          schema: ProtocolDefinition.types.message.schema,
        },
      },
    });

    if (!response || !response.records) return [];

    if (response.status.code === 200) {
      return await Promise.all(
        response.records.map(async (record) => {
          return await record.data.json();
        })
      );
    }

    return [];
  };

  const fetchMsgs = async () => {
    try {
      if (!web5 || !did) return;

      const sentMsgs = await fetchSentMsgs(web5);
      console.log("sentMsgs", sentMsgs);
      const receivedMsgs = await fetchReceivedMsgs(web5, did);
      console.log("receivedMsgs", receivedMsgs);
      const allMsgs = [...sentMsgs, ...receivedMsgs] as Msg[];
      const msgs = processMsgs(allMsgs, did);

      console.log("msgs", msgs);

      setMsgs(msgs);
    } catch (error) {
      console.log("error", error);
    } finally {
      console.log("");
    }
  };

  const createMsg = async (payload: CreateMsgPayload) => {
    try {
      if (!web5 || !did) return;

      const { record } = await web5.dwn.records.create({
        data: {
          ...payload,
          uid: uuidv4(),
          type: "TEXT",
          senderDid: did,
          createdAt: new Date().getTime(),
        },
        message: {
          protocol: ProtocolDefinition.protocol,
          protocolPath: "message",
          schema: ProtocolDefinition.types.message.schema,
          dataFormat: ProtocolDefinition.types.message.dataFormats[0],
          recipient: payload.recipientDid,
        },
      });

      if (!record) {
        console.log("no record");
        return;
      }

      const data = await record.data.json();

      setMsgs([...msgs, data]);

      const { status } = await record.send(payload.recipientDid);

      if (status.code !== 202) {
        console.log("Unable to send to target did:" + status);
        return;
      } else {
        console.log("msg sent to recipient");
      }
    } catch (error) {
      console.log("error sending msg", error);
    }
  };

  return { fetchMsgs, createMsg, msgs };
};
