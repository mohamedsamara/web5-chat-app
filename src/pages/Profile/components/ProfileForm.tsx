import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { REQUIRED_FIELD } from "lib/validations";

import { useProfile } from "lib/hooks";
import Loader from "components/Loader";
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

const formSchema = z.object({
  name: z.string().min(1, { message: REQUIRED_FIELD }),
});

const ProfileForm = ({ onDone }: { onDone?: () => void }) => {
  const { profile, createProfile, updateProfile, profileCreated } =
    useProfile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile.name,
    },
  });

  const { isValid, isDirty, isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (profileCreated) {
        await updateProfile({ name: values.name });
      } else {
        await createProfile({ name: values.name });
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      onDone && onDone();
    }
  };

  return (
    <>
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
            {isSubmitting && <Loader className="mr-1" />}
            {profileCreated ? "Save" : "Create"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ProfileForm;
