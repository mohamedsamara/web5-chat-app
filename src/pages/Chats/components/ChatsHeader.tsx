import { useState } from "react";
import { PencilIcon } from "lucide-react";

import { useWeb5 } from "lib/contexts";
import { useProfile } from "lib/hooks";
import { Button } from "components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import UserAvatar from "components/UserAvatar";
import Dialog from "components/Dialog";
import { ProfileForm, UploadAvatar } from "pages/Profile/components";
import CreateGroup from "./CreateGroup";
import CreateConversation from "./CreateConversation";
import { DidDetails } from "pages/ChatSettings/components";

const ChatsHeader = () => {
  const { profile, profileCreated } = useProfile();
  const { did } = useWeb5();
  const [profileModalOpen, setProfileModal] = useState(false);
  const onProfileModalOpen = () => setProfileModal(true);
  const onProfileModalClose = () => setProfileModal(false);

  const [conversationModalOpen, setConversationModal] = useState(false);
  const onConversationModalOpen = () => setConversationModal(true);
  const onConversationModalClose = () => setConversationModal(false);

  const [groupModalOpen, setGroupModal] = useState(false);
  const onGroupModalOpen = () => setGroupModal(true);
  const onGroupModalClose = () => setGroupModal(false);

  return (
    <>
      <header className="flex justify-between items-center px-3 border-b border-b-slate-100 h-12">
        <div className="flex-1">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="relative rounded-full aspect-1 p-0 w-8 h-8"
              >
                <UserAvatar src={profile.avatar} alias={profile.name} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent forceMount>
              <DropdownMenuLabel className="font-normal">
                <DidDetails did={did || ""} />
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onProfileModalOpen}>
                {profileCreated ? "Edit Profile" : "Create Profile"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Create Conversation/Group */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="relative rounded-full aspect-1 p-0 w-8 h-8"
            >
              <PencilIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end" forceMount>
            <DropdownMenuItem onClick={onConversationModalOpen}>
              New Private Conversation
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onGroupModalOpen}>
              New Group Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Profile Form Modal */}
      <Dialog
        title={profileCreated ? "Edit Profile" : "Create Profile"}
        open={profileModalOpen}
        onOpenChange={setProfileModal}
        onClose={onProfileModalClose}
      >
        <UploadAvatar />
        <ProfileForm onDone={onProfileModalClose} />
      </Dialog>

      {/* Conversation Modal */}
      <CreateConversation
        open={conversationModalOpen}
        onOpenChange={setConversationModal}
        onClose={onConversationModalClose}
      />

      {/* Group Modal */}
      <CreateGroup
        open={groupModalOpen}
        onOpenChange={setGroupModal}
        onClose={onGroupModalClose}
      />
    </>
  );
};

export default ChatsHeader;
