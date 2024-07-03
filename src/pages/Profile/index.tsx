import { useState } from "react";

import { ProfileForm, UploadAvatar } from "./components";
import StepCard from "components/StepCard";

const Profile = () => {
  const [step, setStep] = useState(0);

  return (
    <main className="flex flex-col justify-center mx-auto max-w-lg min-w-md w-full h-full px-10">
      <div className="space-y-10">
        {step === 0 ? (
          <StepCard title="Create profile" subtitle="Add your name.">
            <ProfileForm
              onDone={() => {
                setStep(step + 1);
              }}
            />
          </StepCard>
        ) : (
          <StepCard
            title="Create profile"
            subtitle="Start by uploading your avatar."
          >
            <UploadAvatar />
          </StepCard>
        )}
      </div>
    </main>
  );
};

export default Profile;
