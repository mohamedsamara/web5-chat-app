import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { REQUIRED_FIELD } from "lib/validations";

import { useProfile } from "lib/hooks";
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
import EditUserPhoto from "./EditUserPhoto";

const formSchema = z.object({
  name: z.string().min(1, { message: REQUIRED_FIELD }),
});

const Profile = ({
  isProfileCreated,
  onDone,
}: {
  isProfileCreated: boolean;
  onDone: () => void;
}) => {
  const { profile, createProfile, updateProfile } = useProfile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile.name,
    },
  });
  const { isValid, isDirty, isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isProfileCreated) {
        await updateProfile({ name: values.name });
      } else {
        await createProfile({ name: values.name });
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      onDone();
    }
  };

  return (
    <>
      <EditUserPhoto />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          <Button type="submit" disabled={!isValid || !isDirty || isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
            Save
          </Button>
        </form>
      </Form>
    </>
  );
};

export default Profile;
