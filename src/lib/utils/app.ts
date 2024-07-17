import { RecordsQueryResponse, Web5 } from "@web5/api";
import {
  Chat,
  ChatMember,
  ChatMsg,
  MsgAttachmentType,
  Profile,
} from "lib/types";
import { ProtocolDefinition } from "lib/protocols";
import { CHAT_MSG_ATTACHMENT_TYPES } from "../constants";

export const handleError = (error: unknown) => {
  let message = "Unknown Error";
  if (error instanceof Error) message = error.message;
  console.log("message", message);
  return message;
};

export const updateRecord = async (
  web5: Web5,
  recordId: string,
  data: Record<string, unknown>,
  published: boolean = false
) => {
  try {
    const { record } = await web5.dwn.records.read({
      message: {
        filter: {
          recordId: recordId,
        },
      },
    });

    const existingData = await record.data.json();

    const updatedData = {
      ...existingData,
      ...data,
    };

    await record.update({
      data: updatedData,
      published,
    });

    return record;
  } catch (error) {
    throw new Error("Failed to update record");
  }
};

type RecordType = "json" | "blob";

export const getRecords = async (
  response: RecordsQueryResponse,
  type: RecordType = "json"
) => {
  try {
    if (!response.records || response.records.length === 0) return [];

    return await Promise.all(
      response.records.map(async (record) => {
        if (type === "json") {
          const data = await record.data.json();
          return { ...data, recordId: record.id };
        }

        const data = await record.data.blob();
        return { data, recordId: record.id };
      })
    );
  } catch (error) {
    return [];
  }
};

export const datesAreOnSameDay = (timestamp1: number, timestamp2: number) => {
  const first = new Date(timestamp1);
  const second = new Date(timestamp2);
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
};

export const getShowInfoBar = (msgs: ChatMsg[], msg: ChatMsg, i: number) => {
  const previous = getPreviousMsg(msgs, i);
  if (!previous) return true;

  const isSameSender = previous.sender.did === msg.sender.did;
  const isSameDay = datesAreOnSameDay(previous.createdAt, msg.createdAt);

  if (isSameSender && !isSameDay) return true;
  if (isSameSender) return false;

  return true;
};

const getPreviousMsg = (msgs: ChatMsg[], i: number) => {
  if (i === 0) return null;
  const previous = msgs[i - 1];
  return previous;
};

const extractReplyMsg = (msgs: ChatMsg[], replyUid: string) => {
  const reply = msgs.find((m) => m.uid === replyUid);
  return reply;
};

export const processMsgs = (msgs: ChatMsg[], chatUid: string, did: string) => {
  return msgs
    .sort((a, b) => a.createdAt - b.createdAt)
    .map((msg, i) => {
      msg.showInfoBar = getShowInfoBar(msgs, msg, i);
      msg.isMe = did === msg.sender.did;
      const reply = extractReplyMsg(msgs, msg.replyUid);
      msg.reply = reply ?? null;
      msg.chatUid = chatUid;
      return msg;
    });
};

export const processChat = async (
  web5: Web5,
  did: string,
  chat: Chat,
  profile: Profile
) => {
  /* CONVERSATION chat photo will be the contact photo */
  if (chat.type === "CONVERSATION") {
    const recipientDid = getConversationRecipientDid(chat, did);
    const contact = await fetchChatMember(web5, recipientDid);

    if (contact) {
      return {
        ...chat,
        name: contact.name,
        avatar: contact.avatar,
        members: [profile, contact],
      };
    }
    return chat;
  }
  return chat;
};

export const processChats = async (
  web5: Web5,
  did: string,
  chats: Chat[],
  profile: Profile
) => {
  const processedChats = await Promise.all(
    chats.map(async (chat) => {
      return await processChat(web5, did, chat, profile);
    })
  );
  return processedChats;
};

export const fetchChatMember = async (web5: Web5, did: string) => {
  try {
    if (!web5) return null;

    const response = await web5.dwn.records.read({
      from: did,
      message: {
        filter: {
          protocol: ProtocolDefinition.protocol,
          protocolPath: "profile",
          schema: ProtocolDefinition.types.profile.schema,
          author: did,
        },
      },
    });

    if (!response.record) return null;

    const profile = await response.record.data.json();

    return { ...profile, recordId: response.record.id } as Profile;
  } catch (error) {
    throw new Error("Failed to fetch profile");
  }
};

export const getChatMembers = async (web5: Web5, dids: string[]) => {
  const members: ChatMember[] = [];
  for (const did of dids) {
    const member = await fetchChatMember(web5, did);
    if (member) members.push(member);
  }
  return members;
};

export const getConversationRecipientDid = (chat: Chat, did: string) => {
  const theirDids = chat.memberDids.filter((d) => d !== did);
  const recipientDid = theirDids[0];
  return recipientDid;
};

export const isAttachmentTypeAllowed = (type: string) =>
  ProtocolDefinition.types.attachment.dataFormats.includes(type);

export const getTypeOfAttachment = (fileType: string) => {
  const type = fileType.substring(0, fileType.indexOf("/"));
  return CHAT_MSG_ATTACHMENT_TYPES[type.toUpperCase() as MsgAttachmentType];
};
