import {
  CHAT_TYPES,
  CHAT_MSG_TYPES,
  CHAT_MSG_ATTACHMENT_TYPES,
  ATTACHMENT_DISPLAY_STATUS,
} from "lib/constants";

export type ChatType = keyof typeof CHAT_TYPES;
export type MsgType = keyof typeof CHAT_MSG_TYPES;
export type MsgAttachmentType = keyof typeof CHAT_MSG_ATTACHMENT_TYPES;

/* FORMS */
export type ProfilePayload = {
  name: string;
};

export type CreateMsgPayload = {
  chat: Chat;
  text: string;
  replyUid: string;
};

export type CreateAttachmentMsgPayload = CreateMsgPayload & {
  blob: Blob;
  attachmentType: MsgAttachmentType;
};

/* RECORDS */
export type Profile = {
  recordId: string;
  uid: string;
  did: string;
  name: string;
  avatar: string;
};

export type ChatMember = Profile;
export type Sender = Profile;

export type Chat = {
  recordId: string;
  uid: string;
  name: string;
  avatar: string;
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
  text: string;
  type: MsgType;
  createdAt: number;
  showInfoBar: boolean;
  isMe: boolean;
  replyUid: string;
  reply: ChatMsg | null;
  attachment: Attachment | null;
  chatUid: string;
};

export type Attachment = {
  recordId: string;
  type: MsgAttachmentType;
  url?: string;
  blob: Blob;
};

/* UI */
export type ReplyScroll = {
  visible: boolean;
  uid: string;
};

export type AttachmentViewerParams = {
  caption: string;
  attachment: Attachment;
};

export type AttachmentViewer = {
  visible: boolean;
  params: AttachmentViewerParams | null;
};

export type AttachmentDisplayStatus = keyof typeof ATTACHMENT_DISPLAY_STATUS;
