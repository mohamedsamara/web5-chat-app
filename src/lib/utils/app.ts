import { RecordsQueryResponse, Web5 } from "@web5/api";
import { Chat, ChatMember, ChatMsg, Profile } from "lib/types";
import { ProtocolDefinition } from "lib/protocols";

export const handleError = (error: unknown) => {
  let message = "Unknown Error";
  if (error instanceof Error) message = error.message;
  console.log("message", message);
  return message;
};

export const updateRecord = async (
  web5: Web5,
  recordId: string,
  data: unknown,
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

    await record.update({
      data: data,
      published,
    });

    return record;
  } catch (error) {
    throw new Error("Failed to update record");
  }
};

export const getRecords = async (response: RecordsQueryResponse) => {
  try {
    if (!response.records || response.records.length === 0) return [];

    const data = await Promise.all(
      response.records.map(async (record) => {
        const data = await record.data.json();
        return { ...data, recordId: record.id };
      })
    );

    return data;
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

export const processMsgs = (msgs: ChatMsg[], chat: Chat, did: string) => {
  return msgs
    .sort((a, b) => a.createdAt - b.createdAt)
    .map((msg, i) => {
      msg.showInfoBar = getShowInfoBar(msgs, msg, i);
      msg.isMe = did === msg.sender.did;
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

export const fileToBase64 = async (file: File) => {
  const binaryImage = await file.arrayBuffer();
  const base64 = btoa(
    new Uint8Array(binaryImage).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );
  return base64;
};

export const getAvatarUrl = (base64: string) =>
  `data:image/png;base64,${base64}`;
