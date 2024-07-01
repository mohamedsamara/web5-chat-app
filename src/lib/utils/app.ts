import { RecordsQueryResponse, Web5 } from "@web5/api";
import { Avatar, Chat, ChatMember, ChatMsg, Profile } from "lib/types";
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

  const isSameSender = previous.senderDid === msg.senderDid;
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
      msg.isMe = did === msg.senderDid;
      const sender = chat.members.find((m) => m.did === msg.senderDid);
      if (sender) msg.sender = sender;

      return msg;
    });
};

export const processChats = async (web5: Web5, did: string, chats: Chat[]) => {
  try {
    const processedChats = await Promise.all(
      chats.map(async (chat) => {
        /* CONVERSATION chat photo will be the contact photo */
        if (chat.type === "CONVERSATION") {
          const members = await getChatMembers(web5, chat.memberDids);
          const contact = members.find((m) => m.did !== did);

          if (!contact) throw new Error("Something went wrong!");

          return {
            ...chat,
            name: contact?.name ?? "",
            avatar: contact?.avatar || null,
            members,
          };
        }

        return chat;
      })
    );
    return processedChats;
  } catch (error) {
    return [];
  }
};

export const fetchAvatar = async (web5: Web5, did: string) => {
  try {
    if (!web5) return null;

    console.log("fetch avatar for:", did);

    const response = await web5.dwn.records.read({
      from: did,
      message: {
        filter: {
          protocol: ProtocolDefinition.protocol,
          protocolPath: "avatar",
          schema: ProtocolDefinition.types.avatar.schema,
          author: did,
        },
      },
    });

    if (!response.record) return null;
    const photo = await response.record.data.blob();
    return { photo, recordId: response.record.id };
  } catch (error) {
    throw new Error("Failed to fetch avatar");
  }
};

export const fetchChatMember = async (web5: Web5, did: string) => {
  try {
    if (!web5) return null;

    // TODO: change to read
    const response = await web5.dwn.records.query({
      from: did,
      message: {
        filter: {
          protocol: ProtocolDefinition.protocol,
          protocolPath: "profile",
          schema: ProtocolDefinition.types.profile.schema,
        },
      },
    });

    if (!response.records || response.records.length === 0) return null;
    const profileRecord = response.records[0];
    const profile = await profileRecord.data.json();

    const avatar = await fetchAvatar(web5, did);

    return { ...profile, avatar, recordId: profileRecord.id } as Profile;
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

export const blobToUrl = (blob: Blob | null) => {
  if (!blob) return "";
  const url = URL.createObjectURL(blob);
  return url;
};

export const fileToBlob = (file: File) => {
  const blob = new Blob([file], { type: "image/png" });
  return blob;
};

export const getAvatar = (avatar: Avatar | null) => {
  if (!avatar || !avatar.photo) return "";
  const url = blobToUrl(avatar.photo);
  return url;
};

export const getConversationRecipientDid = (chat: Chat, did: string) => {
  const theirDids = chat.memberDids.filter((d) => d !== did);
  const recipientDid = theirDids[0];
  return recipientDid;
};
