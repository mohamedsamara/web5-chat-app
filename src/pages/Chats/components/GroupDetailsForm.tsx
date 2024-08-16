import { ChangeEvent } from "react";

import { GroupDetailsFormValues } from "lib/hooks";
import { Input } from "components/ui/input";
import GroupPhotoUploader from "./GroupPhotoUploader";

type Props = {
  groupDetails: GroupDetailsFormValues;
  onNameChange: (value: string) => void;
  onPhotoChange: (file: File) => void;
};

const GroupDetailsForm = ({
  groupDetails,
  onNameChange,
  onPhotoChange,
}: Props) => {
  return (
    <div className="flex-1 flex flex-col gap-10">
      <div className="flex justify-center">
        <GroupPhotoUploader onChange={onPhotoChange} />
      </div>
      <Input
        className="w-full py-4 rounded-xl"
        placeholder="Group Name"
        value={groupDetails.name}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onNameChange(e.target.value)
        }
      />
    </div>
  );
};

export default GroupDetailsForm;
