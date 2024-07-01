import { useEffect, useState } from "react";

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

import CopyButton from "components/CopyButton";
import UserAvatar from "components/UserAvatar";
import Dialog from "components/Dialog";
import CreateConversation from "./CreateConversation";
import Profile from "./Profile";

const ChatsHeader = () => {
  const { profile, fetchProfile } = useProfile();
  const { did } = useWeb5();
  const [profileModalOpen, setProfileModal] = useState(false);
  const onProfileModalOpen = () => setProfileModal(true);
  const onProfileModalClose = () => setProfileModal(false);

  const isProfileCreated = profile?.recordId ? true : false;

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      <header className="flex justify-between items-center h-12 p-4 border-b border-b-gray-100">
        <div className="flex-1">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="relative rounded-full aspect-1 p-0 w-8 h-8"
              >
                <UserAvatar avatar={profile.avatar} alias={profile.name} />
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
                {isProfileCreated ? "Edit Profile" : "Create Profile"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Create Conversation */}
        <CreateConversation />
      </header>

      {/* Profile Modal */}
      <Dialog
        title={isProfileCreated ? "Edit Profile" : "Create Profile"}
        open={profileModalOpen}
        onOpenChange={setProfileModal}
        onClose={onProfileModalClose}
      >
        <Profile
          isProfileCreated={isProfileCreated}
          onDone={onProfileModalClose}
        />
      </Dialog>
    </>
  );
};

export default ChatsHeader;
