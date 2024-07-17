import { useEffect, useState, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAtom, useSetAtom, useAtomValue } from "jotai";

import { useWeb5 } from "lib/contexts";
import {
  Attachment,
  AttachmentDisplayStatus,
  ChatMsg,
  CreateAttachmentMsgPayload,
  CreateMsgPayload,
} from "lib/types";
import ProtocolDefinition from "lib/protocols/protocol.json";
import { CHAT_MSG_TYPES, CHAT_TYPES } from "lib/constants";
import {
  chatsAtom,
  selectedChatAtom,
  chatsFetchedAtom,
  msgsFetchedAtom,
  chatMsgsAtom,
  attachmentsAtom,
  updateAttachmentsAtom,
} from "lib/stores";
import {
  blobToBase64,
  getConversationRecipientDid,
  getRecords,
  handleError,
  processChat,
  processChats,
  processMsgs,
} from "lib/utils";
import { useProfile } from "./profile";

export const useSelectedChat = (chatUid: string) => {
  const selectedChat = useAtomValue(
    useMemo(() => selectedChatAtom(chatUid), [chatUid])
  );
  return { chat: selectedChat || null };
};

export const useChatMsgs = (chatUid: string) => {
  const { did } = useWeb5();
  const chatMsgs = useAtomValue(chatMsgsAtom);
  const processedMsgs = useMemo(() => {
    if (!did) return [];
    return processMsgs(chatMsgs, chatUid, did);
  }, [chatUid, chatMsgs.length]);

  return { msgs: processedMsgs };
};

export const useChat = () => {
  const { web5, did } = useWeb5();
  const { profile } = useProfile();
  const [chats, setChats] = useAtom(chatsAtom);
  const setChatMsgs = useSetAtom(chatMsgsAtom);
  const [chatsFetched, setChatsFetched] = useAtom(chatsFetchedAtom);
  const [msgsFetched, setMsgsFetched] = useAtom(msgsFetchedAtom);

  const createConversation = async (recipientDid: string) => {
    try {
      if (!web5 || !did) return;

      const isPresent = await isChatPresent(recipientDid);
      if (isPresent) return;

      const { record } = await web5.dwn.records.create({
        data: {
          uid: uuidv4(),
          name: "",
          avatar: "",
          type: CHAT_TYPES.CONVERSATION,
          memberDids: [did, recipientDid],
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

      const data = await record.data.json();
      const chat = { ...data, recordId: record.id };

      const processedChat = await processChat(web5, did, chat, profile);
      setChats([processedChat, ...chats]);
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
      const processedChats = await processChats(web5, did, chats, profile);

      setChats(processedChats);
    } catch (error) {
      console.log("Failed to fetch chats : error", error);
    } finally {
      setChatsFetched(true);
    }
  };

  const fetchChatMsgs = async (chatRecordId: string) => {
    try {
      if (!web5 || !did) return;
      const response = await web5.dwn.records.query({
        message: {
          filter: {
            protocol: ProtocolDefinition.protocol,
            protocolPath: "chat/message",
            parentId: chatRecordId,
          },
        },
      });

      const msgs = (await getRecords(response)) as ChatMsg[];

      // const newMsgs = msgs.slice(msgs.length - 2);

      setChatMsgs(msgs);
    } catch (error) {
      console.log("error", error);
    } finally {
      setMsgsFetched(true);
    }
  };

  const createMsg = async (payload: CreateMsgPayload) => {
    try {
      if (!web5 || !did) return;
      const { chat, replyUid, text } = payload;

      /* Default to one-to-one conversation. */
      const recipientDid = getConversationRecipientDid(chat, did);
      const chatRecordId = chat.recordId;

      const { record } = await web5.dwn.records.create({
        data: {
          uid: uuidv4(),
          type: CHAT_MSG_TYPES.TEXT,
          text,
          sender: {
            name: profile.name,
            avatar: profile.avatar,
            did,
          },
          replyUid,
          attachment: null,
          createdAt: new Date().getTime(),
        },
        message: {
          protocol: ProtocolDefinition.protocol,
          protocolPath: "chat/message",
          schema: ProtocolDefinition.types.message.schema,
          dataFormat: ProtocolDefinition.types.message.dataFormats[0],
          recipient: recipientDid,
          parentContextId: chatRecordId,
        },
      });

      if (!record) return;

      const data = await record.data.json();
      await record.send(recipientDid);

      setChatMsgs((prev) => [...prev, { ...data, recordId: record.id }]);
    } catch (error) {
      console.log("error sending msg", error);
    }
  };

  const createAttachmentMsg = async (payload: CreateAttachmentMsgPayload) => {
    try {
      if (!web5 || !did) return;

      const { chat, replyUid, text, blob, attachmentType } = payload;

      /* Default to one-to-one conversation. */
      const recipientDid = getConversationRecipientDid(chat, did);
      const chatRecordId = chat.recordId;

      /* create attachment record */
      const { record: attachmentRecord } = await web5.dwn.records.create({
        data: blob,
        message: {
          protocol: ProtocolDefinition.protocol,
          protocolPath: "chat/attachment",
          schema: ProtocolDefinition.types.attachment.schema,
          dataFormat: blob.type,
          recipient: recipientDid,
          parentContextId: chatRecordId,
        },
      });

      if (!attachmentRecord) return;

      const attachment = {
        type: attachmentType,
        recordId: attachmentRecord.id,
      };

      /* create msg with attachment type */
      const { record: msgRecord } = await web5.dwn.records.create({
        data: {
          uid: uuidv4(),
          type: CHAT_MSG_TYPES.ATTACHMENT,
          text,
          sender: {
            name: profile.name,
            avatar: profile.avatar,
            did,
          },
          attachment,
          replyUid,
          createdAt: new Date().getTime(),
        },
        message: {
          protocol: ProtocolDefinition.protocol,
          protocolPath: "chat/message",
          schema: ProtocolDefinition.types.message.schema,
          dataFormat: ProtocolDefinition.types.message.dataFormats[0],
          recipient: recipientDid,
          parentContextId: chatRecordId,
        },
      });

      if (!msgRecord) return;

      await msgRecord.send(recipientDid);
      await attachmentRecord.send(recipientDid);
      const msg = await msgRecord.data.json();

      setChatMsgs((prev) => [...prev, { ...msg, recordId: msgRecord.id }]);
    } catch (error) {
      console.log("error sending attachemnt msg", error);
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
    chatsFetched,
    msgsFetched,
    createConversation,
    fetchChats,
    fetchChatMsgs,
    createMsg,
    createAttachmentMsg,
  };
};

const cache: { [key in string]: string } = {};

export const useAttachment = ({
  visible,
  attachment,
}: {
  visible: boolean;
  attachment: Attachment;
}) => {
  const { web5 } = useWeb5();
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const chatAttachments = useAtomValue(attachmentsAtom);
  const setChatsAttachments = useSetAtom(updateAttachmentsAtom);
  const [status, setStatus] = useState<AttachmentDisplayStatus>("LOADING");

  const processBlob = async (recordId: string, blob: Blob) => {
    try {
      const base64 = (await blobToBase64(blob)) as string;
      setUrl(base64);
      cache[recordId] = base64;
    } catch (error) {
      console.log("eeror", error);
    } finally {
      setLoading(false);
    }
  };

  const checkAttachment = ({ recordId }: Attachment) => {
    if (recordId in cache) {
      setUrl(cache[recordId]);
      setLoading(false);
      return;
    }

    const foundAttachment = chatAttachments.find(
      (a) => a.recordId === recordId
    );

    if (foundAttachment) {
      processBlob(recordId, foundAttachment.blob);
      return;
    }

    fetchAttachment(attachment);
  };

  useEffect(() => {
    if (!visible || !attachment) return;
    checkAttachment(attachment);
  }, [visible, attachment]);

  const fetchAttachment = async (attachment: Attachment) => {
    try {
      if (!web5) return;

      const response = await web5.dwn.records.read({
        message: {
          filter: {
            recordId: attachment.recordId,
          },
        },
      });

      if (!response.record) return;
      const data = await response.record.data.blob();
      processBlob(attachment.recordId, data);
      setChatsAttachments({ ...attachment, url: "", blob: data });
    } catch (error) {
      console.log("error", error);
    }
  };

  return { loading, status, setStatus, url };
};

export const useReplyMsg = (msg: ChatMsg, isReply: boolean): ChatMsg => {
  const m = useMemo(() => {
    const text =
      msg.text || isReply ? msg.text : msg.attachment?.type.toLowerCase() || "";
    return { ...msg, text };
  }, [msg, isReply]);

  return m;
};
