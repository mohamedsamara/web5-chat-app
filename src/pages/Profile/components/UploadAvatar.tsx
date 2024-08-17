import { useRef, ChangeEvent, useState } from "react";

import { fileToBase64 } from "lib/utils";
import { useProfile } from "lib/hooks";
import UserAvatar from "components/UserAvatar";
import { Button } from "components/ui/button";
import Loader from "components/Loader";

const UploadAvatar = ({ onDone }: { onDone?: () => void }) => {
  const { profile, uploadAvatar } = useProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hiddenFileInput = useRef<HTMLInputElement | null>(null);

  const onClick = () => {
    hiddenFileInput.current?.click();
  };

  const _onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      setIsSubmitting(true);
      const photo = event.target?.files?.[0] as File;
      const base64 = await fileToBase64(photo);
      await uploadAvatar(base64);
      event.target.value = "";
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsSubmitting(false);
      onDone && onDone();
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="mr-4">
          <UserAvatar src={profile.avatar} alias={profile.name} />
        </div>
        <Button onClick={onClick} disabled={isSubmitting}>
          {isSubmitting && <Loader className="mr-1" />}
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

export default UploadAvatar;
