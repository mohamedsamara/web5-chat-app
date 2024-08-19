import { useState } from "react";
import { Ellipsis } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Chat } from "lib/types";
import { useChat, useGroupDetailsForm } from "lib/hooks";
import { fileToBase64 } from "lib/utils";
import UserAvatar from "components/UserAvatar";
import { Button } from "components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { ChatName, GroupDetailsForm } from "pages/Chats/components";
import Dialog from "components/Dialog";

const ChatSettingsHeader = ({
  chat,
  canEdit,
}: {
  chat: Chat;
  canEdit: boolean;
}) => {
  const navigate = useNavigate();
  const { deleteChat, updateChat } = useChat();
  const { groupDetails, onNameChange, onPhotoChange } = useGroupDetailsForm({
    name: chat.name,
    photo: null,
  });
  const [groupModalOpen, setGroupModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onGroupModalOpen = () => setGroupModal(true);
  const onGroupModalClose = () => setGroupModal(false);

  const onDeleteGroup = async () => {
    try {
      await deleteChat(chat);

      navigate("/chats");
    } catch (error) {
      console.log("error", error);
    }
  };

  const onUpdateGroup = async () => {
    try {
      setIsSubmitting(true);

      const photo = groupDetails.photo as File;

      let base64 = chat.avatar;
      if (photo) base64 = await fileToBase64(photo);

      const groupToUpdate = {
        chat,
        name: groupDetails.name,
        avatar: base64,
      };

      await updateChat(groupToUpdate);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsSubmitting(false);
      onGroupModalClose();
    }
  };

  return (
    <>
      <div className="grid grid-cols-3">
        <div />
        <div className="flex flex-col items-center gap-2">
          <UserAvatar size="3xl" src={chat.avatar} alias={chat.name} />
          <ChatName className="text-center" name={chat.name} />
        </div>
        {canEdit && (
          <div className="flex justify-end">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="relative rounded-full aspect-1 p-0 w-8 h-8"
                >
                  <Ellipsis className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuItem onClick={onGroupModalOpen}>
                  Edit Group Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDeleteGroup}>
                  Delete Group
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Group Details Modal */}
      <Dialog
        className="h-[calc(100vh-170px)]"
        title="Edit Group"
        open={groupModalOpen}
        onOpenChange={setGroupModal}
        onClose={onGroupModalClose}
      >
        <GroupDetailsForm
          groupDetails={groupDetails}
          onNameChange={onNameChange}
          onPhotoChange={onPhotoChange}
        />

        <Button
          disabled={isSubmitting || !groupDetails.name}
          onClick={onUpdateGroup}
        >
          Save
        </Button>
      </Dialog>
    </>
  );
};

export default ChatSettingsHeader;
