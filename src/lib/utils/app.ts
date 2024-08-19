import { Record as DWNRecord, RecordsQueryResponse, Web5 } from "@web5/api";
import * as linkify from "linkifyjs";

import {
  Chat,
  ChatMember,
  ChatMsg,
  LastMsg,
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

export const sendRecord = async (record: DWNRecord, dids: string[]) => {
  for (const did of dids) {
    await record.send(did);
  }
};

export const updateRecord = async (
  web5: Web5,
  recordId: string,
  data: Record<string, unknown>,
  published: boolean = false,
  tags?: Record<string, string>
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
      tags,
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

export const fetchChatLastMsg = async (web5: Web5, chatRecordId: string) => {
  try {
    if (!web5) return null;

    /* fetch last msg record */
    const response = await web5.dwn.records.read({
      message: {
        filter: {
          protocol: ProtocolDefinition.protocol,
          protocolPath: "chat/lastMsg",
          parentId: chatRecordId,
        },
      },
    });

    if (!response.record) return null;

    const lastMsgRecord = await response.record.data.json();

    /* fetch msg record */
    const msgResponse = await web5.dwn.records.read({
      message: {
        filter: {
          protocol: ProtocolDefinition.protocol,
          protocolPath: "chat/message",
          recordId: lastMsgRecord.msgRecordId,
        },
      },
    });

    if (!msgResponse.record) return null;

    const msg = (await msgResponse.record.data.json()) as ChatMsg;

    const lastMsg: LastMsg = {
      recordId: response.record.id,
      msg: {
        ...msg,
        recordId: msgResponse.record.id,
      },
    };

    return lastMsg;
  } catch (error) {
    throw new Error("Failed to fetch last msg");
  }
};

export const processChat = async (
  web5: Web5,
  did: string,
  chat: Chat,
  profile: Profile
) => {
  const lastMsg = await fetchChatLastMsg(web5, chat.recordId);

  /* CONVERSATION chat photo will be the contact photo */
  if (chat.type === "CONVERSATION") {
    const recipientDid = getConversationRecipientDid(chat, did);
    const contact = await fetchProfile(web5, recipientDid);

    if (contact) {
      return {
        ...chat,
        name: contact.name,
        avatar: contact.avatar,
        members: [profile, contact],
        lastMsg,
      };
    }

    return { ...chat, lastMsg };
  }

  return { ...chat, lastMsg };
};

export const processChats = async (
  web5: Web5,
  did: string,
  chats: Chat[],
  profile: Profile
) => {
  const filteredChats = chats.filter((c) => c.memberDids.includes(did));
  const processedChats = await Promise.all(
    filteredChats.map(async (chat) => {
      return await processChat(web5, did, chat, profile);
    })
  );
  return processedChats;
};

export const fetchProfile = async (web5: Web5, did: string) => {
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
    return null;
    // throw new Error("Failed to fetch profile");
  }
};

export const getChatMembers = async (web5: Web5, dids: string[]) => {
  const members: ChatMember[] = [];
  for (const did of dids) {
    const member = await fetchProfile(web5, did);
    if (member) members.push(member);
  }
  return members;
};

export const getMemberDids = (chat: Chat, did: string) => {
  const theirDids = chat.memberDids.filter((d) => d !== did);
  return theirDids;
};

export const getConversationRecipientDid = (chat: Chat, did: string) => {
  const theirDids = getMemberDids(chat, did);
  const recipientDid = theirDids[0];
  return recipientDid;
};

export const isAttachmentTypeAllowed = (type: string) =>
  ProtocolDefinition.types.attachment.dataFormats.includes(type);

export const getTypeOfAttachment = (mimeType: string) => {
  let type = "file";
  if (mimeType.startsWith("image/")) type = "image";
  if (mimeType.includes("video/")) type = "video";
  if (mimeType.includes("audio/")) type = "audio";

  return CHAT_MSG_ATTACHMENT_TYPES[type.toUpperCase() as MsgAttachmentType];
};

export const isLink = (text: string) => linkify.find(text, "url").length > 0;
export const extractLink = (text: string) => linkify.find(text, "url")[0].href;

export const isValidLink = (str: string) => {
  const res = str.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g
  );
  return res !== null;
};

export const segregateMsgText = (text: string) => {
  const words = text.split(" ");
  const content = [];

  let link = "";
  let isValid = false;

  for (const word of words) {
    const isLinkPresent = isLink(word);

    if (isLinkPresent && isValidLink(word)) {
      isValid = true;
      link = isLinkPresent ? extractLink(word) : "";

      content.push({
        isLink: true,
        text: word,
      });
    } else {
      content.push({
        isLink: false,
        text: word,
        isDid: isDid(word),
      });
    }
  }

  return { content, link, isValidLink: isValid };
};

export const isDid = (str: string) => {
  // TODO: Need to check kif there is an existing utlity
  const didStr = str.split(":");
  const identifier = didStr[2];
  return str.startsWith("did:dht") && identifier.length === 52;
};
