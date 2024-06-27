import { RecordsQueryResponse, Web5 } from "@web5/api";
import { Chat, ChatMember, ChatMsg, Profile } from "lib/types";
import { ProtocolDefinition } from "lib/protocols";

export const handleError = (error: unknown) => {
  let message = "Unknown Error";
  if (error instanceof Error) message = error.message;
  console.log("message", message);
  return message;
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

export const processMsgs = (msgs: ChatMsg[], did: string) => {
  return msgs
    .sort((a, b) => a.createdAt - b.createdAt)
    .map((msg, i) => {
      msg.showInfoBar = getShowInfoBar(msgs, msg, i);
      msg.isMe = did === msg.sender.did;
      return msg;
    });
};

export const processChats = (chats: Chat[], did: string) => {
  return chats.map((chat) => {
    /* CONVERSATION chat photo will be the contact photo */
    if (chat.type === "CONVERSATION") {
      const notMe = chat.members.find((m) => m.did !== did) as ChatMember;
      return {
        ...chat,
        name: notMe.name,
        photo: notMe.photo,
      };
    }

    return chat;
  });
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

export const getChatMember = async (web5: Web5, did: string) => {
  try {
    if (!web5) return null;

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

    return { ...profile, recordId: profileRecord.id } as Profile;
  } catch (error) {
    throw new Error("Failed to fetch profile");
  }
};

export const getChatMembers = async (web5: Web5, dids: string[]) => {
  const members: ChatMember[] = [];
  for (const did of dids) {
    const member = await getChatMember(web5, did);
    if (!member) return;
    members.push(member);
  }
  return members;
};
