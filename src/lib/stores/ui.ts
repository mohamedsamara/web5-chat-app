import { atom } from "jotai";

type ReplyScroll = {
  visible: boolean;
  uid: string;
};

export const replyScrollAtom = atom<ReplyScroll>({ visible: false, uid: "" });
