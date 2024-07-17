import { atom } from "jotai";

import { AttachmentViewer, ReplyScroll } from "lib/types";

export const replyScrollAtom = atom<ReplyScroll>({ visible: false, uid: "" });

export const isMsgSwipingAtom = atom<boolean>(false);

export const attachmentViewerAtom = atom<AttachmentViewer>({
  visible: false,
  params: null,
});
