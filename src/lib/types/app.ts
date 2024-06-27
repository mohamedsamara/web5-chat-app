import { CHAT_TYPES, CHAT_MSG_TYPES } from "../constants";

export type ChatType = keyof typeof CHAT_TYPES;
export type MsgType = keyof typeof CHAT_MSG_TYPES;

/* FORMS */
export type CreateProfilePayload = {
  name: string;
};

export type UpdateProfilePayload = {
  name: string;
};

export type CreateMsgPayload = {
  chat: Chat;
  content: string;
};

/* RECORDS */

export type Profile = {
  recordId: string;
  uid: string;
  did: string;
  name: string;
  photo: string;
};

export type ChatMember = Profile;

export type Chat = {
  recordId: string;
  uid: string;
  name: string;
  photo: string;
  type: ChatType;
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
  content: string;
  type: MsgType;
  createdAt: number;
  showInfoBar: boolean;
  isMe: boolean;
  // chatId: string;
};

export type Sender = {
  did: string;
  name: string;
  photo: string;
};

export type Recipient = {
  did: string;
  name: string;
  photo: string;
};
