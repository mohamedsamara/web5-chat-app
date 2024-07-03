import { atom } from "jotai";

import { Chat, ChatMsg } from "lib/types";

export const chatsAtom = atom<Chat[]>([]);

export const selectedChatAtom = (chatId: string) => {
  const foundChat = atom((get) => get(chatsAtom).find((c) => c.uid === chatId));
  if (!foundChat) {
    throw new Error("no chat found");
  }
  return foundChat;
};

export const chatMsgsAtom = atom<ChatMsg[]>([]);

export const chatsFetchedAtom = atom<boolean>(false);
export const msgsFetchedAtom = atom<boolean>(false);
