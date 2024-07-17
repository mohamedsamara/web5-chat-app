import { atom } from "jotai";

import { Chat, Attachment, ChatMsg } from "lib/types";

export const chatsAtom = atom<Chat[]>([]);

export const selectedChatAtom = (chatUid: string) => {
  const foundChat = atom((get) =>
    get(chatsAtom).find((c) => c.uid === chatUid)
  );
  return foundChat;
};

export const chatMsgsAtom = atom<ChatMsg[]>([]);

export const chatsFetchedAtom = atom<boolean>(false);
export const msgsFetchedAtom = atom<boolean>(false);

export const attachmentsAtom = atom<Attachment[]>([]);

export const updateAttachmentsAtom = atom(
  null,
  (_, set, attachemnt: Attachment) => {
    set(attachmentsAtom, (prev) => [...prev, attachemnt]);
  }
);
