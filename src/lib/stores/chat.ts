import { atom } from "jotai";

import {
  Chat,
  Attachment,
  ChatMsg,
  LastMsg,
  ChatAttachmentMsgsFilterPayload,
} from "lib/types";

/* Chats */
export const chatsAtom = atom<Chat[]>([]);
export const chatsFetchedAtom = atom<boolean>(false);

export const setChatLastMsgAtom = atom(
  null,
  (_, set, chatRecordId: string, lastMsg: LastMsg) => {
    set(chatsAtom, (prev) => {
      return prev.map((c) => {
        if (c.recordId === chatRecordId) {
          return { ...c, lastMsg };
        }
        return c;
      });
    });
  }
);

export const getChatAtom = (chatUid: string) => {
  return atom((get) => get(chatsAtom).find((c) => c.uid === chatUid) || null);
};

/* Msgs */
export const msgsAtom = atom<{ [key in string]: ChatMsg[] }>({});
export const msgsFetchedAtom = atom<boolean>(false);

export const getMsgsAtom = (chatUid: string) => {
  return atom((get) => get(msgsAtom)[chatUid] || []);
};

export const setMsgsAtom = atom(
  null,
  (get, set, chatUid: string, msgs: ChatMsg[], replace = false) => {
    set(msgsAtom, (prev) => {
      if (chatUid in get(msgsAtom)) {
        const mergedMsgs = [...get(msgsAtom)[chatUid], ...msgs];
        return { ...prev, [chatUid]: replace ? msgs : mergedMsgs };
      }
      return { ...prev, [chatUid]: msgs };
    });
  }
);

/* Attachments */
export const attachmentsAtom = atom<Attachment[]>([]);
export const setAttachmentsAtom = atom(
  null,
  (_, set, attachemnt: Attachment) => {
    set(attachmentsAtom, (prev) => [...prev, attachemnt]);
  }
);

/* Chat Attachments */
export const chatAttachmentMsgsAtom = atom<{
  [key in string]: ChatMsg[];
}>({});

export const filterChatAttachmentMsgsAtom = ({
  chatUid,
  type,
}: ChatAttachmentMsgsFilterPayload) => {
  return atom((get) => {
    if (chatUid in get(chatAttachmentMsgsAtom)) {
      if (type === "MEDIA") {
        return (
          get(chatAttachmentMsgsAtom)[chatUid].filter(
            (m) =>
              m.attachment?.type === "VIDEO" || m.attachment?.type === "IMAGE"
          ) || []
        );
      }
      return (
        get(chatAttachmentMsgsAtom)[chatUid].filter(
          (m) => m.attachment?.type === type
        ) || []
      );
    }

    return [];
  });
};

export const setChatAttachmentMsgsAtom = atom(
  null,
  (get, set, chatUid: string, msgs: ChatMsg[]) => {
    set(chatAttachmentMsgsAtom, (prev) => {
      if (chatUid in get(chatAttachmentMsgsAtom)) {
        return { ...prev, [chatUid]: msgs };
      }
      return { ...prev, [chatUid]: msgs };
    });
  }
);
