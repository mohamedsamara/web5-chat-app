import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PencilIcon } from "lucide-react";

import { useChat } from "lib/hooks";
import { REQUIRED_FIELD } from "lib/validations";
import Loader from "components/Loader";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import Dialog from "components/Dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";

const formSchema = z.object({
  did: z.string().min(1, { message: REQUIRED_FIELD }),
});

type ButtonType = "full" | "icon";

const CreateConversation = ({ btnType = "icon" }: { btnType?: ButtonType }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const onModalOpen = () => setModalOpen(true);
  const onModalClose = () => setModalOpen(false);
  const { createConversation } = useChat();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      did: "",
    },
  });

  const { isValid, isDirty, isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createConversation(values.did);
      form.reset();
    } catch (error) {
      console.log("error", error);
    } finally {
      onModalClose();
    }
  };

  return (
    <Dialog
      title="New Private Conversation"
      open={modalOpen}
      onOpenChange={setModalOpen}
      onClose={onModalClose}
      trigger={
        btnType === "icon" ? (
          <Button
            size="icon"
            variant="ghost"
            className="relative rounded-full aspect-1 p-0 w-8 h-8"
            onClick={onModalOpen}
          >
            <PencilIcon className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={onModalOpen}>Start Chatting</Button>
        )
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            name="did"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Did</FormLabel>
                <FormControl>
                  <Input placeholder="did:..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={!isValid || !isDirty || isSubmitting}>
            {isSubmitting && <Loader className="mr-1" />}
            Create
          </Button>
        </form>
      </Form>
    </Dialog>
  );
};

export default CreateConversation;
