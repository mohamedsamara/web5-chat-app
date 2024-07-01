import { useRef, ChangeEvent, useState } from "react";
import { Loader2 } from "lucide-react";

import { fileToBlob } from "lib/utils";
import { useProfile } from "lib/hooks";
import UserAvatar from "components/UserAvatar";
import { Button } from "components/ui/button";

const EditUserPhoto = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { profile, uploadAvatar } = useProfile();
  const hiddenFileInput = useRef<HTMLInputElement | null>(null);

  const onClick = () => {
    hiddenFileInput.current?.click();
  };

  const _onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      setIsSubmitting(true);
      const photo = event.target?.files?.[0] as File;
      const blob = fileToBlob(photo);
      await uploadAvatar(blob);

      event.target.value = "";
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="mr-4">
          <UserAvatar avatar={profile.avatar} alias={profile.name} />
        </div>
        <Button onClick={onClick} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
          Upload photo
        </Button>
        <input
          type="file"
          accept="image/*"
          ref={hiddenFileInput}
          onChange={_onChange}
          style={{ display: "none" }}
        />
      </div>
    </>
  );
};

export default EditUserPhoto;
