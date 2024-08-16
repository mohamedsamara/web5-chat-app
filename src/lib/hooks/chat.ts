import { useEffect, useState, useMemo, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAtom, useSetAtom, useAtomValue } from "jotai";
import { Record as DWNRecord } from "@web5/api";

import { useWeb5 } from "lib/contexts";
import {
  AddChatMemberPayload,
  Attachment,
  AttachmentDisplayStatus,
  Chat,
  ChatAttachmentMsgsFilterPayload,
  ChatMember,
  ChatMsg,
  CreateAttachmentMsgPayload,
  CreateGroupPayload,
  CreateMsgPayload,
  CreateOrUpdateLastMsgPayload,
  LastMsg,
  RemoveChatMemberPayload,
  UpdateChatPayload,
} from "lib/types";
import ProtocolDefinition from "lib/protocols/protocol.json";
import { CHAT_MSG_TYPES, CHAT_TYPES } from "lib/constants";
import {
  chatsAtom,
  getChatAtom,
  getMsgsAtom,
  chatsFetchedAtom,
  msgsFetchedAtom,
  attachmentsAtom,
  setAttachmentsAtom,
  setChatLastMsgAtom,
  setMsgsAtom,
  setChatAttachmentMsgsAtom,
  filterChatAttachmentMsgsAtom,
  getChatMembersAtom,
  setChatMembersAtom,
  chatMembersAtom,
  removeChatMemberAtom,
  addChatMemberAtom,
  setChatDetailsAtom,
  setChatMemberDidsAtom,
  removeChatAtom,
} from "lib/stores";
import {
  blobToBase64,
  fetchChatLastMsg,
  fetchProfile,
  getMemberDids,
  getRecords,
  handleError,
  processChat,
  processChats,
  processMsgs,
  sendRecord,
  updateRecord,
} from "lib/utils";
import { useProfile } from "./profile";

export const useSelectedChat = (chatUid: string) => {
  const selectedChat = useAtomValue(
    useMemo(() => getChatAtom(chatUid), [chatUid])
  );
  return { chat: selectedChat };
};

export const useChatMsgs = (chatUid: string) => {
  const { did } = useWeb5();
  const msgs = useAtomValue(useMemo(() => getMsgsAtom(chatUid), [chatUid]));
  const processedMsgs = useMemo(() => {
    if (!did || !msgs) return [];
    return processMsgs(msgs, chatUid, did);
  }, [chatUid, msgs.length]);

  return { msgs: processedMsgs };
};

export const useChat = () => {
  const { web5, did } = useWeb5();
  const { profile } = useProfile();
  const [chats, setChats] = useAtom(chatsAtom);
  const [chatsFetched, setChatsFetched] = useAtom(chatsFetchedAtom);
  const setMsgs = useSetAtom(setMsgsAtom);
  const [msgsFetched, setMsgsFetched] = useAtom(msgsFetchedAtom);
  const setChatDetails = useSetAtom(setChatDetailsAtom);
  const removeChat = useSetAtom(removeChatAtom);

  const { createOrUpdateLastMsg } = useChatLastMsg();

  const createConversation = async (recipientDid: string) => {
    try {
      if (!web5 || !did) return;

      const isPresent = await isChatPresent(recipientDid);
      if (isPresent) return;

      const { record } = await web5.dwn.records.create({
        data: {
          uid: uuidv4(),
          name: "",
          avatar: "",
          type: CHAT_TYPES.CONVERSATION,
          memberDids: [did, recipientDid],
          ownerDid: did,
          createdAt: new Date().getTime(),
          updatedAt: new Date().getTime(),
        },
        message: {
          protocol: ProtocolDefinition.protocol,
          protocolPath: "chat",
          schema: ProtocolDefinition.types.chat.schema,
          dataFormat: ProtocolDefinition.types.chat.dataFormats[0],
          recipient: recipientDid,
        },
      });

      if (!record) return;

      await record.send(recipientDid);

      const data = await record.data.json();
      const chat = { ...data, recordId: record.id };

      const processedChat = await processChat(web5, did, chat, profile);
      setChats([processedChat, ...chats]);
    } catch (error) {
      const msg = handleError(error);
      console.log("msg", msg);
    }
  };

  const createGroup = async (payload: CreateGroupPayload) => {
    try {
      if (!web5 || !did) return;

      const { memberDids, name, avatar } = payload;

      const { record } = await web5.dwn.records.create({
        data: {
          uid: uuidv4(),
          name,
          avatar,
          type: CHAT_TYPES.GROUP,
          memberDids: [did, ...memberDids],
          ownerDid: did,
          createdAt: new Date().getTime(),
          updatedAt: new Date().getTime(),
        },
        message: {
          protocol: ProtocolDefinition.protocol,
          protocolPath: "chat",
          schema: ProtocolDefinition.types.chat.schema,
          dataFormat: ProtocolDefinition.types.chat.dataFormats[0],
        },
      });

      if (!record) return;

      await sendRecord(record, memberDids);

      const data = await record.data.json();
      const chat = { ...data, recordId: record.id };

      const processedChat = await processChat(web5, did, chat, profile);
      setChats([processedChat, ...chats]);
    } catch (error) {
      const msg = handleError(error);
      console.log("msg", msg);
    }
  };

  const fetchChats = async () => {
    try {
      if (!web5 || !did) return [];

      const response = await web5.dwn.records.query({
        message: {
          filter: {
            protocol: ProtocolDefinition.protocol,
            schema: ProtocolDefinition.types.chat.schema,
          },
        },
      });

      const chats = await getRecords(response);
      const processedChats = await processChats(web5, did, chats, profile);

      setChats(processedChats);
    } catch (error) {
      console.log("Failed to fetch chats : error", error);
    } finally {
      setChatsFetched(true);
    }
  };

  const fetchChatMsgs = async (chat: Chat) => {
    try {
      if (!web5 || !did) return;
      const response = await web5.dwn.records.query({
        message: {
          filter: {
            protocol: ProtocolDefinition.protocol,
            protocolPath: "chat/message",
            parentId: chat.recordId,
          },
        },
      });
      const msgs = (await getRecords(response)) as ChatMsg[];

      setMsgs(chat.uid, msgs, true);
    } catch (error) {
      console.log("error", error);
    } finally {
      setMsgsFetched(true);
    }
  };

  const createMsg = async (payload: CreateMsgPayload) => {
    try {
      if (!web5 || !did) return;
      const { chat, replyUid, text } = payload;

      const memberDids = getMemberDids(chat, did);
      const chatRecordId = chat.recordId;

      const { record } = await web5.dwn.records.create({
        data: {
          uid: uuidv4(),
          type: CHAT_MSG_TYPES.TEXT,
          text,
          sender: {
            name: profile.name,
            avatar: profile.avatar,
            did,
          },
          replyUid,
          attachment: null,
          createdAt: new Date().getTime(),
        },
        message: {
          protocol: ProtocolDefinition.protocol,
          protocolPath: "chat/message",
          schema: ProtocolDefinition.types.message.schema,
          dataFormat: ProtocolDefinition.types.message.dataFormats[0],
          // recipient: recipientDid,
          parentContextId: chatRecordId,
          tags: {
            msgType: CHAT_MSG_TYPES.TEXT,
          },
        },
      });

      if (!record) return;

      await sendRecord(record, memberDids);

      const msgRecordId = record.id;
      const msg = await record.data.json();

      await createOrUpdateLastMsg({
        chatRecordId,
        msgRecordId,
        memberDids,
      });

      setMsgs(chat.uid, [{ ...msg, recordId: msgRecordId }]);
    } catch (error) {
      console.log("error sending msg", error);
    }
  };

  const createAttachmentMsg = async (payload: CreateAttachmentMsgPayload) => {
    try {
      if (!web5 || !did) return;

      const { chat, replyUid, text, blob, attachment } = payload;

      const memberDids = getMemberDids(chat, did);
      const chatRecordId = chat.recordId;

      /* create attachment record */
      const { record: attachmentRecord } = await web5.dwn.records.create({
        data: blob,
        message: {
          protocol: ProtocolDefinition.protocol,
          protocolPath: "chat/attachment",
          schema: ProtocolDefinition.types.attachment.schema,
          dataFormat: attachment.mimeType,
          // recipient: recipientDid,
          parentContextId: chatRecordId,
        },
      });

      if (!attachmentRecord) return;

      const attachmentToAdd = {
        recordId: attachmentRecord.id,
        ...attachment,
      };

      /* create msg with attachment type */
      const { record: msgRecord } = await web5.dwn.records.create({
        data: {
          uid: uuidv4(),
          type: CHAT_MSG_TYPES.ATTACHMENT,
          text,
          sender: {
            name: profile.name,
            avatar: profile.avatar,
            did,
          },
          attachment: attachmentToAdd,
          replyUid,
          createdAt: new Date().getTime(),
        },
        message: {
          protocol: ProtocolDefinition.protocol,
          protocolPath: "chat/message",
          schema: ProtocolDefinition.types.message.schema,
          dataFormat: ProtocolDefinition.types.message.dataFormats[0],
          // recipient: recipientDid,
          parentContextId: chatRecordId,
          tags: {
            msgType: CHAT_MSG_TYPES.ATTACHMENT,
            attachmentType: attachment.type,
          },
        },
      });

      if (!msgRecord) return;
      const msgRecordId = msgRecord.id;

      await sendRecord(msgRecord, memberDids);
      await sendRecord(attachmentRecord, memberDids);

      const msg = await msgRecord.data.json();

      await createOrUpdateLastMsg({
        chatRecordId,
        msgRecordId,
        memberDids,
      });

      setMsgs(chat.uid, [{ ...msg, recordId: msgRecordId }]);
    } catch (error) {
      console.log("error sending attachemnt msg", error);
    }
  };

  const isChatPresent = async (recipientDid: string) => {
    try {
      if (!web5) return;

      const response = await web5.dwn.records.query({
        from: recipientDid,
        message: {
          filter: {
            protocol: ProtocolDefinition.protocol,
            schema: ProtocolDefinition.types.chat.schema,
          },
        },
      });

      if (!response.records) return false;
      return response.records.length > 0;
    } catch (error) {
      return false;
    }
  };

  const deleteChat = async (chat: Chat) => {
    try {
      if (!web5 || !did) return [];
      const { record } = await web5.dwn.records.read({
        message: {
          filter: {
            recordId: chat.recordId,
          },
        },
      });

      await record.delete({ prune: true });
      removeChat(chat.uid);
    } catch (error) {
      console.log("Failed to delete chat", error);
    }
  };

  const updateChat = async (payload: UpdateChatPayload) => {
    try {
      if (!web5 || !did) return [];
      const { chat, name, avatar } = payload;

      const memberDids = getMemberDids(chat, did);

      const record = await updateRecord(web5, chat.recordId, {
        name,
        avatar,
      });

      await sendRecord(record, memberDids);
      setChatDetails(chat.uid, name, avatar);
    } catch (error) {
      console.log("Failed to update chat", error);
    }
  };

  return {
    chats,
    chatsFetched,
    msgsFetched,
    createConversation,
    createGroup,
    fetchChats,
    fetchChatMsgs,
    createMsg,
    createAttachmentMsg,
    deleteChat,
    updateChat,
  };
};

export const useFilteredChatAttachmentMsgs = ({
  chatUid,
  type,
}: ChatAttachmentMsgsFilterPayload) => {
  const msgs = useAtomValue(
    useMemo(
      () => filterChatAttachmentMsgsAtom({ chatUid, type }),
      [chatUid, type]
    )
  );

  return { msgs };
};

export const useChatAttachments = () => {
  const { web5, did } = useWeb5();
  const setChatAttachmentMsgs = useSetAtom(setChatAttachmentMsgsAtom);

  const fetchChatAttachments = async (chat: Chat) => {
    try {
      if (!web5 || !did) return;

      const response = await web5.dwn.records.query({
        message: {
          filter: {
            protocol: ProtocolDefinition.protocol,
            protocolPath: "chat/message",
            parentId: chat.recordId,
            tags: {
              msgType: CHAT_MSG_TYPES.ATTACHMENT,
            },
          },
        },
      });
      const attachmentMsgs = await getRecords(response);

      setChatAttachmentMsgs(chat.uid, attachmentMsgs);
    } catch (error) {
      console.log("error", error);
    }
  };

  return { fetchChatAttachments };
};

export const useChatLastMsg = () => {
  const { web5, did } = useWeb5();
  const [chats] = useAtom(chatsAtom);
  const setChatLastMsg = useSetAtom(setChatLastMsgAtom);

  const createOrUpdateLastMsg = async (
    payload: CreateOrUpdateLastMsgPayload
  ) => {
    try {
      if (!web5 || !did) return;

      const { chatRecordId, msgRecordId, memberDids } = payload;
      const chat = chats.find((c) => c.recordId === chatRecordId);
      if (!chat) return;

      let record: DWNRecord;

      if (chat.lastMsg) {
        const lastMsgRecordId = chat.lastMsg.recordId;
        record = await updateRecord(web5, lastMsgRecordId, {
          msgRecordId,
        });
      } else {
        const response = await web5.dwn.records.create({
          data: {
            msgRecordId,
          },
          message: {
            protocol: ProtocolDefinition.protocol,
            protocolPath: "chat/lastMsg",
            schema: ProtocolDefinition.types.lastMsg.schema,
            dataFormat: ProtocolDefinition.types.lastMsg.dataFormats[0],
            // recipient: recipientDid,
            parentContextId: chatRecordId,
          },
        });
        if (!response.record) return;
        record = response.record;
      }

      await sendRecord(record, memberDids);

      const lastMsg = await fetchChatLastMsg(web5, chat.recordId);
      if (!lastMsg) return;

      setChatLastMsg(chatRecordId, lastMsg);
    } catch (error) {
      console.log("error sending msg", error);
    }
  };

  return { createOrUpdateLastMsg };
};

const cache: { [key in string]: string } = {};

export const useAttachment = ({
  visible,
  attachment,
}: {
  visible: boolean;
  attachment: Attachment;
}) => {
  const { web5 } = useWeb5();
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const attachments = useAtomValue(attachmentsAtom);
  const setAttachments = useSetAtom(setAttachmentsAtom);
  const [status, setStatus] = useState<AttachmentDisplayStatus>("LOADING");

  const processBlob = async (recordId: string, blob: Blob) => {
    try {
      const base64 = (await blobToBase64(blob)) as string;
      setUrl(base64);
      cache[recordId] = base64;
    } catch (error) {
      console.log("eeror", error);
    } finally {
      setLoading(false);
    }
  };

  const checkAttachment = ({ recordId }: Attachment) => {
    if (recordId in cache) {
      setUrl(cache[recordId]);
      setLoading(false);
      return;
    }

    const foundAttachment = attachments.find((a) => a.recordId === recordId);

    if (foundAttachment) {
      processBlob(recordId, foundAttachment.blob);
      return;
    }

    fetchAttachment(attachment);
  };

  useEffect(() => {
    if (!visible || !attachment) return;
    checkAttachment(attachment);
  }, [visible, attachment]);

  const fetchAttachment = async (attachment: Attachment) => {
    try {
      if (!web5) return;

      const response = await web5.dwn.records.read({
        message: {
          filter: {
            recordId: attachment.recordId,
          },
        },
      });

      if (!response.record) return;
      const data = await response.record.data.blob();
      processBlob(attachment.recordId, data);
      setAttachments({ ...attachment, blob: data });
    } catch (error) {
      console.log("error", error);
    }
  };

  return { loading, status, setStatus, url };
};

export const useMsgText = (msg: ChatMsg, isReply: boolean = false): string => {
  const t = useMemo(() => {
    const text =
      msg.text || isReply
        ? msg.text
        : msg.attachment?.type.toLowerCase() + " Attachment" || "";
    return text;
  }, [msg]);

  return t;
};

export const useChatsLastMsgPolling = () => {
  const { web5 } = useWeb5();
  const [chats] = useAtom(chatsAtom);
  const setChatLastMsg = useSetAtom(setChatLastMsgAtom);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      lastMsgPolling();
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [chats.length]);

  const lastMsgPolling = async () => {
    try {
      if (!web5) return;

      for (const chat of chats) {
        const lastMsg = await fetchChatLastMsg(web5, chat.recordId);

        if (!lastMsg) return;

        gotUpdates(chat.recordId, lastMsg);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const gotUpdates = (chatRecordId: string, lastMsg: LastMsg) => {
    const chat = chats.find((c) => c.recordId === chatRecordId);
    if (!chat) return;

    /* same msg - do not update */
    if (chat.lastMsg?.msg.recordId === lastMsg.msg.recordId) return;

    setChatLastMsg(chat.recordId, lastMsg);
  };
};

export const useContacts = () => {
  const { profile } = useProfile();
  const [chats] = useAtom(chatsAtom);

  const members = chats
    .filter((c) => c.type === "CONVERSATION")
    .map((c) => {
      if (!c.members) return [];
      return c.members.filter((m) => m.uid !== profile.uid);
    })
    .flat();

  const memberIds = members.map(({ uid }) => uid);
  const uniqueMembers = members.filter(
    ({ uid }, index) => !memberIds.includes(uid, index + 1)
  );

  return { contacts: uniqueMembers };
};

export const useGroupContacts = (members: ChatMember[]) => {
  const { contacts } = useContacts();
  const membersMap = new Map();
  for (const member of members) {
    membersMap.set(member.did, member);
  }

  const filteredContacts = contacts.filter((m) => {
    if (membersMap.has(m.did)) return;
    return m;
  });

  return {
    contacts: filteredContacts,
    existingContacts: [...filteredContacts, ...members],
  };
};

export const useChatMembers = (chat: Chat) => {
  const { web5, did } = useWeb5();
  const { profile } = useProfile();
  const { contacts } = useContacts();
  const [loading, setLoading] = useState(false);
  const [chats] = useAtom(chatsAtom);
  const [chatMembers] = useAtom(chatMembersAtom);
  const setChatMembers = useSetAtom(setChatMembersAtom);
  const removeChatMember = useSetAtom(removeChatMemberAtom);
  const addChatMember = useSetAtom(addChatMemberAtom);
  const setChatMemberDids = useSetAtom(setChatMemberDidsAtom);
  const members = useAtomValue(
    useMemo(() => getChatMembersAtom(chat.uid), [chat.uid, chatMembers.length])
  );

  const getMembers = async () => {
    try {
      setLoading(true);
      if (chatMembers[chat.uid]) {
        setLoading(false);
        return;
      }
      await getAllChatMembers();
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const getAllChatMembers = async () => {
    if (!web5 || !did) return;

    const members: ChatMember[] = [profile];

    const memberDids = getMemberDids(chat, did);

    for (const memberDid of memberDids) {
      const foundMember = contacts.find((c) => c.did === memberDid);
      const memberInChat = isMemberInChatMembers(memberDid);

      if (foundMember) {
        members.push(foundMember);
      } else if (memberInChat) {
        members.push(memberInChat);
      } else {
        console.log(
          "memberDid cant be found anywhere? --- attempt to get member",
          memberDid
        );

        const member = await fetchProfile(web5, memberDid);
        if (member) members.push(member);
      }
    }

    setChatMembers(chat.uid, members);
  };

  const isMemberInChatMembers = (memberDid: string) => {
    let member: ChatMember | null = null;
    chats.map((c) => {
      if (!chatMembers[c.uid]) return;
      const foundInChats = chatMembers[c.uid].find((m) => m.did === memberDid);

      if (foundInChats) member = foundInChats;
    });

    return member;
  };

  const removeMember = async (payload: RemoveChatMemberPayload) => {
    try {
      if (!web5 || !did) return [];
      const { chat, memberDid } = payload;

      const memberDids = chat.memberDids;
      const newMemberDids = memberDids.filter((m) => m !== memberDid);
      const withoutMe = memberDids.filter((d) => d !== did);

      const record = await updateRecord(web5, chat.recordId, {
        memberDids: newMemberDids,
      });

      await sendRecord(record, withoutMe);
      removeChatMember(chat.uid, memberDid);
      setChatMemberDids(chat.uid, newMemberDids);
    } catch (error) {
      console.log("Failed to update chat", error);
    }
  };

  const addMember = async (payload: AddChatMemberPayload) => {
    try {
      if (!web5 || !did) return [];
      const { chat, members } = payload;
      const memberDids = chat.memberDids;

      const newMemberDids = [...memberDids, ...members.map((m) => m.did)];
      const withoutMe = newMemberDids.filter((d) => d !== did);

      const record = await updateRecord(web5, chat.recordId, {
        memberDids: newMemberDids,
      });

      await sendRecord(record, withoutMe);
      addChatMember(chat.uid, members);
      setChatMemberDids(chat.uid, newMemberDids);
    } catch (error) {
      console.log("Failed to update chat", error);
    }
  };

  const sortedMembers = useMemo(
    () =>
      members.sort((a, b) => {
        const owner =
          a.did === chat.ownerDid ? -1 : b.did === chat.ownerDid ? 1 : 0;
        const me = a.did === profile.did ? -1 : b.did === profile.did ? 1 : 0;
        return owner || me;
      }),
    [members, chat.ownerDid, profile.did]
  );

  return {
    loading,
    members: sortedMembers,
    getMembers,
    removeMember,
    addMember,
  };
};
