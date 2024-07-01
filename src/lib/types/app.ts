import { CHAT_TYPES, CHAT_MSG_TYPES } from "../constants";

export type ChatType = keyof typeof CHAT_TYPES;
export type MsgType = keyof typeof CHAT_MSG_TYPES;

/* FORMS */
export type ProfilePayload = {
  name: string;
};

export type CreateMsgPayload = {
  chat: Chat;
  content: string;
};

/* RECORDS */
export type Avatar = {
  recordId: string;
  photo: Blob | null;
};

export type Profile = {
  recordId: string;
  uid: string;
  did: string;
  name: string;
  avatar: Avatar | null;
};

export type ChatMember = Profile;
export type Sender = Profile;

export type Chat = {
  recordId: string;
  uid: string;
  name: string;
  avatar: Avatar | null;
  type: ChatType;
  memberDids: string[];
  members: ChatMember[];
  ownerDid: string;
  // lastMsg: LastMsg;
  // unseenMsgsCount: UnseenMsgsCount[];
  // unseenMsgsBadgeCount: number;
  deleted: boolean;
  createdAt: number;
  updatedAt: number;
};

export type ChatMsg = {
  recordId: string;
  uid: string;
  sender: Sender;
  senderDid: string;
  content: string;
  type: MsgType;
  createdAt: number;
  showInfoBar: boolean;
  isMe: boolean;
  // chatId: string;
};
