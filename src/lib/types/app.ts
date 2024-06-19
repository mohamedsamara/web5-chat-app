export enum MSG_TYPES {
  TEXT = "TEXT",
  VIDEO = "VIDEO",
  PHOTO = "PHOTO",
}

export type MsgType = keyof typeof MSG_TYPES;

/* FORMS */
export type CreateMsgPayload = {
  recipientDid: string;
  content: string;
};

/* RECORDS */
export type Msg = {
  uid: string;
  senderDid: string;
  senderPhoto: string;
  senderName: string;
  recipientDid: string;
  content: string;
  type: MsgType;
  createdAt: number;
  showInfoBar: boolean;
  isMe: boolean;
};

export type Contact = {
  did: string;
  name: string;
  photo: string;
};
