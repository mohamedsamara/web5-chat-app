import { useAtom } from "jotai";
import { v4 as uuidv4 } from "uuid";

import { useWeb5 } from "lib/contexts";
import { ProtocolDefinition } from "lib/protocols";
import { ProfilePayload } from "lib/types";

import {
  profileAtom,
  profileCreatedAtom,
  profileFetchedAtom,
} from "lib/stores";
import { updateRecord } from "lib/utils";

export const useProfile = () => {
  const { web5, did } = useWeb5();
  const [profile, setProfile] = useAtom(profileAtom);
  const [profileFetched, setProfileFetched] = useAtom(profileFetchedAtom);
  const [profileCreated] = useAtom(profileCreatedAtom);

  const fetchProfile = async () => {
    try {
      if (!web5 || !did) return;

      const response = await web5.dwn.records.read({
        message: {
          filter: {
            protocol: ProtocolDefinition.protocol,
            protocolPath: "profile",
            schema: ProtocolDefinition.types.profile.schema,
            author: did,
          },
        },
      });

      if (!response.record) return;

      const data = await response.record.data.json();
      setProfile({ ...profile, ...data, recordId: response.record.id });
    } catch (error) {
      console.log("error", error);
    } finally {
      setProfileFetched(true);
    }
  };

  const updateProfile = async (payload: ProfilePayload) => {
    try {
      if (!web5) return;

      await updateRecord(web5, profile.recordId, payload, true);

      await fetchProfile();
    } catch (error) {
      console.log("error", error);
    }
  };

  const createProfile = async (payload: ProfilePayload) => {
    try {
      if (!web5 || !did) return;
      const response = await web5.dwn.records.create({
        data: {
          uid: uuidv4(),
          did,
          ...payload,
        },
        message: {
          protocol: ProtocolDefinition.protocol,
          protocolPath: "profile",
          schema: ProtocolDefinition.types.profile.schema,
          dataFormat: ProtocolDefinition.types.profile.dataFormats[0],
          published: true,
        },
      });

      if (!response.record) return;

      const data = await response.record.data.json();
      setProfile({ ...profile, ...data, recordId: response.record.id });
    } catch (error) {
      console.log("error", error);
    }
  };

  const uploadAvatar = async (base64: string) => {
    try {
      if (!web5) return;
      await updateRecord(
        web5,
        profile.recordId,
        {
          avatar: base64,
        },
        true
      );

      await fetchProfile();
    } catch (error) {
      console.log("error", error);
    }
  };

  return {
    profile,
    profileCreated,
    profileFetched,
    fetchProfile,
    createProfile,
    updateProfile,
    uploadAvatar,
  };
};
