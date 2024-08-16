import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { fileToBase64 } from "lib/utils";
import {
  useChat,
  useContacts,
  useGroupDetailsForm,
  useGroupMembersForm,
} from "lib/hooks";
import { Button } from "components/ui/button";
import Dialog from "components/Dialog";
import GroupDetailsForm from "./GroupDetailsForm";
import GroupMembersForm from "./GroupMembersForm";

type Props = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onClose: () => void;
};

const CreateGroup = ({ open, onOpenChange, onClose }: Props) => {
  const { createGroup } = useChat();
  const { contacts } = useContacts();
  const { groupDetails, onNameChange, onPhotoChange, resetGroupDetailsForm } =
    useGroupDetailsForm();
  const { selectedMembers, onMemberSelectChange, resetGroupMembersForm } =
    useGroupMembersForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [steps, setSteps] = useState(1);

  const onCreateGroup = async () => {
    try {
      setIsSubmitting(true);

      const memberDids = selectedMembers.map((m) => m.did);
      const photo = groupDetails.photo as File;

      let base64 = "";
      if (photo) base64 = await fileToBase64(photo);

      const groupToCreate = {
        name: groupDetails.name,
        avatar: base64,
        memberDids,
      };

      await createGroup(groupToCreate);
      resetGroupDetailsForm();
      resetGroupMembersForm();
      setSteps(1);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <Dialog
      className="h-[calc(100vh-170px)]"
      title="Start Group Chat"
      open={open}
      onOpenChange={onOpenChange}
      onClose={onClose}
    >
      {steps === 1 ? (
        <div className="flex flex-col h-full">
          <GroupDetailsForm
            groupDetails={groupDetails}
            onNameChange={onNameChange}
            onPhotoChange={onPhotoChange}
          />
          <div className="text-right">
            <Button
              size="icon"
              className="rounded-full"
              disabled={!groupDetails.name}
              onClick={() => setSteps(2)}
            >
              <ArrowRight />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full gap-4">
          <GroupMembersForm
            contacts={contacts}
            existingContacts={contacts}
            selectedMembers={selectedMembers}
            onMemberSelectChange={onMemberSelectChange}
          />
          <div className="absolute bottom-[8px] right-0 left-0 p-6 flex justify-between">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full"
              onClick={() => setSteps(1)}
            >
              <ArrowLeft />
            </Button>
            <Button
              size="icon"
              className="rounded-full"
              disabled={selectedMembers.length === 0 || isSubmitting}
              onClick={onCreateGroup}
            >
              <Check />
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default CreateGroup;
