import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAtom } from "jotai";

import { useWeb5 } from "lib/contexts";
import { CreateMsgPayload } from "lib/types";
import ProtocolDefinition from "lib/protocols/protocol.json";
import { CHAT_MSG_TYPES, CHAT_TYPES } from "../constants";
import { chatsAtom, msgsAtom, selectedChatAtom } from "lib/stores";
import {
  getChatMembers,
  getRecords,
  handleError,
  processChats,
  processMsgs,
} from "lib/utils";
import { useProfile } from "./profile";

export const useSelectedChat = (chatId: string) => {
  const [selectedChat] = useAtom(
    useMemo(() => selectedChatAtom(chatId), [chatId])
  );
  return { chat: selectedChat || null };
};

export const useChat = () => {
  const { web5, did } = useWeb5();
  const { profile } = useProfile();
  const [chats, setChats] = useAtom(chatsAtom);
  const [chatMsgs, setChatMsgs] = useAtom(msgsAtom);

  const createConversation = async (recipientDid: string) => {
    try {
      if (!web5 || !did) return;

      const isPresent = await isChatPresent(recipientDid);
      if (isPresent) return;

      const members = await getChatMembers(web5, [recipientDid]);
      if (!members) throw new Error("Members not found.");

      const { record } = await web5.dwn.records.create({
        data: {
          uid: uuidv4(),
          name: "",
          photo: "",
          type: CHAT_TYPES.CONVERSATION,
          members: [...members, profile],
          ownerDid: did,
          createdAt: new Date().getTime(),
          updatedAt: new Date().getTime(),
        },
        message: {
          protocol: ProtocolDefinition.protocol,
          protocolPath: "chat",
          schema: ProtocolDefinition.types.chat.schema,
          dataFormat: ProtocolDefinition.types.chat.dataFormats[0],
          recipient: recipientDid,
        },
      });

      if (!record) return;

      await record.send(recipientDid);
    } catch (error) {
      const msg = handleError(error);
      console.log("msg", msg);
    }
  };

  const fetchChats = async () => {
    try {
      if (!web5 || !did) return [];

      const response = await web5.dwn.records.query({
        message: {
          filter: {
            protocol: ProtocolDefinition.protocol,
            schema: ProtocolDefinition.types.chat.schema,
          },
        },
      });

      const chats = await getRecords(response);
      const processedChats = processChats(chats, did);

      setChats(processedChats);
    } catch (error) {
      throw new Error("Failed to fetch chats");
    }
  };

  const fetchChatMsgs = async (parentId: string) => {
    try {
      if (!web5 || !did) return;

      const response = await web5.dwn.records.query({
        message: {
          filter: {
            protocol: ProtocolDefinition.protocol,
            protocolPath: "chat/message",
            parentId: parentId,
          },
        },
      });

      const msgs = await getRecords(response);
      const processedMsgs = processMsgs(msgs, did);
      setChatMsgs(processedMsgs);
    } catch (error) {
      console.log("error", error);
    }
  };

  const createMsg = async (payload: CreateMsgPayload) => {
    try {
      if (!web5 || !did) return;

      // Default to one-to-one conversation.
      const theirDids = payload.chat.members.filter((m) => m.did !== did);
      const recipientDid = theirDids[0].did;
      const parentId = payload.chat.recordId;

      const { record } = await web5.dwn.records.create({
        data: {
          uid: uuidv4(),
          type: CHAT_MSG_TYPES.TEXT,
          content: payload.content,
          sender: {
            did: profile.did,
            name: profile.name,
            photo: profile.photo,
          },
          createdAt: new Date().getTime(),
        },
        message: {
          protocol: ProtocolDefinition.protocol,
          protocolPath: "chat/message",
          schema: ProtocolDefinition.types.message.schema,
          dataFormat: ProtocolDefinition.types.message.dataFormats[0],
          recipient: recipientDid,
          parentContextId: parentId,
        },
      });

      if (!record) return;

      const data = await record.data.json();
      await record.send(recipientDid);

      setChatMsgs([...chatMsgs, data]);
    } catch (error) {
      console.log("error sending msg", error);
    }
  };

  const isChatPresent = async (recipientDid: string) => {
    try {
      if (!web5) return;

      const response = await web5.dwn.records.query({
        from: recipientDid,
        message: {
          filter: {
            protocol: ProtocolDefinition.protocol,
            schema: ProtocolDefinition.types.chat.schema,
          },
        },
      });

      if (!response.records) return false;
      return response.records.length > 0;
    } catch (error) {
      return false;
    }
  };

  return {
    chats,
    chatMsgs,
    createConversation,
    fetchChats,
    fetchChatMsgs,
    createMsg,
  };
};
