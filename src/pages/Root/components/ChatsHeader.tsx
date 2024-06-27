import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { z } from "zod";

import { REQUIRED_FIELD } from "lib/validations";

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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import { Input } from "components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import CopyButton from "components/CopyButton";
import CreateConversation from "./CreateConversation";
import UserAvatar from "@/components/UserAvatar";

const formSchema = z.object({
  name: z.string().min(1, { message: REQUIRED_FIELD }),
});

const ChatsHeader = () => {
  const { profile, createProfile, updateProfile, fetchProfile } = useProfile();
  const { did } = useWeb5();
  const [profileModalOpen, setProfileModal] = useState(false);
  const onProfileModalOpen = () => setProfileModal(true);
  const onProfileModalClose = () => setProfileModal(false);

  const isProfileCreated = profile?.recordId ? true : false;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const { isValid, isDirty, isSubmitting } = form.formState;

  useEffect(() => {
    fetchProfile();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isProfileCreated) {
        await updateProfile({ name: values.name });
      } else {
        await createProfile({ name: values.name });
      }
      onProfileModalClose();
    } catch (error) {
      console.log("error", error);
    }
  };

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
                <UserAvatar
                  src={profile.photo ?? ""}
                  alias={profile.name ?? ""}
                />
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
      <Dialog open={profileModalOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-[425px]" hideClose>
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>
                {isProfileCreated ? "Edit Profile" : "Create Profile"}
              </DialogTitle>
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={onProfileModalClose}
                >
                  <span className="sr-only">Close profile modal</span>
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={!isValid || !isDirty || isSubmitting}
                >
                  Save
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatsHeader;
