import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { X, PencilIcon, Loader2 } from "lucide-react";

import { useChat } from "lib/hooks";
import { REQUIRED_FIELD } from "lib/validations";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";

const formSchema = z.object({
  did: z.string().min(1, { message: REQUIRED_FIELD }),
});

const CreateConversation = () => {
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
    } catch (error) {
      console.log("error", error);
    } finally {
      onModalClose();
    }
  };

  return (
    <Dialog open={modalOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="relative rounded-full aspect-1 p-0 w-8 h-8 mr-2"
          onClick={onModalOpen}
        >
          <PencilIcon className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" hideClose>
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>New Private Conversation</DialogTitle>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={onModalClose}
              >
                <span className="sr-only">Close modal</span>
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
              <Button
                type="submit"
                disabled={!isValid || !isDirty || isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                )}
                Create
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateConversation;
