import { useRef, ChangeEvent, useState } from "react";
import { Camera } from "lucide-react";

import { Button } from "components/ui/button";

const GroupPhotoUploader = ({
  onChange,
}: {
  onChange: (photo: File) => void;
}) => {
  const hiddenPhotoInput = useRef<HTMLInputElement | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);

  const onPhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const photo = event.target?.files?.[0] as File;
    onChange(photo);
    setPhoto(photo);
    event.target.value = "";
  };

  const onPhotoClick = () => {
    hiddenPhotoInput.current?.click();
  };

  return (
    <div>
      <Button
        size="icon"
        variant="ghost"
        className="relative rounded-full object-cover overflow-hidden w-16 h-16"
        onClick={onPhotoClick}
      >
        {photo ? (
          <img src={URL.createObjectURL(photo)} />
        ) : (
          <Camera className="text-6xl" />
        )}
      </Button>
      <input
        type="file"
        accept="image/*"
        ref={hiddenPhotoInput}
        onChange={onPhotoChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default GroupPhotoUploader;
