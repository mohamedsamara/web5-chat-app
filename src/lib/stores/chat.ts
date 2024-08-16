import { atom } from "jotai";

import {
  Chat,
  Attachment,
  ChatMsg,
  LastMsg,
  ChatAttachmentMsgsFilterPayload,
  ChatMember,
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

export const setChatDetailsAtom = atom(
  null,
  (_, set, chatUid: string, name: string, avatar: string) => {
    set(chatsAtom, (prev) =>
      prev.map((c) => {
        if (c.uid === chatUid) {
          return {
            ...c,
            name,
            avatar,
          };
        }
        return c;
      })
    );
  }
);

export const removeChatAtom = atom(null, (_, set, chatUid: string) => {
  set(chatsAtom, (prev) => prev.filter((c) => c.uid !== chatUid));
});

export const setChatMemberDidsAtom = atom(
  null,
  (_, set, chatUid: string, memberDids: string[]) => {
    set(chatsAtom, (prev) =>
      prev.map((c) => {
        if (c.uid === chatUid) {
          return {
            ...c,
            memberDids,
          };
        }
        return c;
      })
    );
  }
);

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

/* Chat Members */
export const chatMembersAtom = atom<{ [key in string]: ChatMember[] }>({});

export const getChatMembersAtom = (chatUid: string) => {
  return atom((get) => get(chatMembersAtom)[chatUid] || []);
};

export const setChatMembersAtom = atom(
  null,
  (get, set, chatUid: string, members: ChatMember[]) => {
    set(chatMembersAtom, (prev) => {
      if (chatUid in get(chatMembersAtom)) {
        return { ...prev, [chatUid]: members };
      }
      return { ...prev, [chatUid]: members };
    });
  }
);

export const removeChatMemberAtom = atom(
  null,
  (get, set, chatUid: string, memberDid: string) => {
    set(chatMembersAtom, (prev) => {
      if (chatUid in get(chatMembersAtom)) {
        const newMembers = get(chatMembersAtom)[chatUid].filter(
          (m) => m.did !== memberDid
        );
        return { ...prev, [chatUid]: newMembers };
      }
      return prev;
    });
  }
);

export const addChatMemberAtom = atom(
  null,
  (get, set, chatUid: string, members: ChatMember[]) => {
    set(chatMembersAtom, (prev) => {
      if (chatUid in get(chatMembersAtom)) {
        const newMembers = [...get(chatMembersAtom)[chatUid], ...members];
        return { ...prev, [chatUid]: newMembers };
      }
      return prev;
    });
  }
);
