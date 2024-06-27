import { useAtom } from "jotai";
import { v4 as uuidv4 } from "uuid";

import { useWeb5 } from "lib/contexts";
import { ProtocolDefinition } from "lib/protocols";
import { CreateProfilePayload, UpdateProfilePayload } from "lib/types";

import { profileAtom } from "lib/stores";

export const useProfile = () => {
  const { web5, did } = useWeb5();
  const [profile, setProfile] = useAtom(profileAtom);

  const updateProfile = async (payload: UpdateProfilePayload) => {
    if (!web5) return;
    const { record } = await web5.dwn.records.read({
      message: {
        filter: {
          recordId: profile?.recordId,
        },
      },
    });

    await record.update({
      data: {
        name: payload.name,
      },
    });
  };

  const fetchProfile = async () => {
    try {
      if (!web5 || !did) return;

      const response = await web5.dwn.records.query({
        message: {
          filter: {
            protocol: ProtocolDefinition.protocol,
            protocolPath: "profile",
            schema: ProtocolDefinition.types.profile.schema,
            author: did,
          },
        },
      });

      if (!response.records || response.records.length === 0) return;

      const profileRecord = response.records[0];
      const profile = await profileRecord.data.json();

      setProfile({ ...profile, recordId: profileRecord.id });
    } catch (error) {
      console.log("error", error);
    }
  };

  const createProfile = async (payload: CreateProfilePayload) => {
    try {
      if (!web5) return;
      const response = await web5.dwn.records.create({
        data: {
          uid: uuidv4(),
          did,
          name: payload.name,
          photo: "",
        },
        message: {
          protocol: ProtocolDefinition.protocol,
          protocolPath: "profile",
          schema: ProtocolDefinition.types.profile.schema,
          dataFormat: ProtocolDefinition.types.profile.dataFormats[0],
          published: true,
        },
      });
      const profile = await response.record?.data.json();
      setProfile(profile);
    } catch (error) {
      console.log("error", error);
    }
  };

  return {
    profile,
    fetchProfile,
    createProfile,
    updateProfile,
  };
};
