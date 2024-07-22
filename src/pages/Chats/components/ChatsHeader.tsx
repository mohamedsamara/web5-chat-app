import { useState } from "react";

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

import { CopyButton } from "components/Buttons";
import UserAvatar from "components/UserAvatar";
import Dialog from "components/Dialog";
import CreateConversation from "./CreateConversation";
import { ProfileForm, UploadAvatar } from "pages/Profile/components";

const ChatsHeader = () => {
  const { profile, profileCreated } = useProfile();
  const { did } = useWeb5();
  const [profileModalOpen, setProfileModal] = useState(false);
  const onProfileModalOpen = () => setProfileModal(true);
  const onProfileModalClose = () => setProfileModal(false);

  return (
    <>
      <header className="flex justify-between items-center h-12 px-3 border-b border-b-gray-100">
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

            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-center justify-center gap-4">
                  <div className="truncate flex-1 text-gray-600">
                    <span>{did}</span>
                  </div>
                  <div className="w-10">
                    <CopyButton value={did || ""} />
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onProfileModalOpen}>
                {profileCreated ? "Edit Profile" : "Create Profile"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Create Conversation */}
        <CreateConversation />
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
    </>
  );
};

export default ChatsHeader;
