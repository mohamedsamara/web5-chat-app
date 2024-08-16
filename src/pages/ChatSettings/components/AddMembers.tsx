import { useState } from "react";
import { UserPlus } from "lucide-react";

import { Chat, ChatMember } from "lib/types";
import {
  useChatMembers,
  useGroupContacts,
  useGroupMembersForm,
} from "lib/hooks";
import Dialog from "components/Dialog";
import { Button } from "components/ui/button";
import { GroupMembersForm } from "pages/Chats/components";

const AddMembers = ({
  chat,
  members,
}: {
  chat: Chat;
  members: ChatMember[];
}) => {
  const { addMember } = useChatMembers(chat);
  const { contacts, existingContacts } = useGroupContacts(members);
  const { selectedMembers, onMemberSelectChange, resetGroupMembersForm } =
    useGroupMembersForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const onModalOpen = () => setModalOpen(true);
  const onModalClose = () => setModalOpen(false);

  const onAddMember = async () => {
    try {
      setIsSubmitting(true);
      await addMember({ chat, members: selectedMembers });
      resetGroupMembersForm();
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsSubmitting(false);
      onModalClose();
    }
  };

  return (
    <Dialog
      className="h-[calc(100vh-170px)]"
      title="Add members to group"
      open={modalOpen}
      onOpenChange={setModalOpen}
      onClose={onModalClose}
      trigger={
        <Button variant="link" onClick={onModalOpen} className="h-6">
          <UserPlus className="w-4 h-4 pr-1" />
          Add Members
        </Button>
      }
    >
      <GroupMembersForm
        contacts={contacts}
        existingContacts={existingContacts}
        selectedMembers={selectedMembers}
        onMemberSelectChange={onMemberSelectChange}
      />
      <Button
        disabled={selectedMembers.length === 0 || isSubmitting}
        onClick={onAddMember}
      >
        Done
      </Button>
    </Dialog>
  );
};

export default AddMembers;
