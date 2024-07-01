import { useAtom } from "jotai";
import { v4 as uuidv4 } from "uuid";

import { useWeb5 } from "lib/contexts";
import { ProtocolDefinition } from "lib/protocols";
import { ProfilePayload } from "lib/types";

import { profileAtom } from "lib/stores";
import { fetchAvatar, updateRecord } from "lib/utils";

export const useProfile = () => {
  const { web5, did } = useWeb5();
  const [profile, setProfile] = useAtom(profileAtom);

  // const fetchAvatar = async () => {
  //   try {
  //     if (!web5 || !did) return;
  //     const avatar = await fetchUserAvatar(web5, did);

  //     setProfile({ ...profile, avatar });

  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // };

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

      let profileFetched = null;
      if (response.record) {
        const data = await response.record.data.json();
        profileFetched = {
          ...data,
          recordId: response.record.id,
        };
      }

      const avatar = await fetchAvatar(web5, did);

      setProfile({ ...profile, ...profileFetched, avatar });
    } catch (error) {
      console.log("error", error);
    }
  };

  const updateProfile = async (payload: ProfilePayload) => {
    try {
      if (!web5) return;

      await updateRecord(
        web5,
        profile.recordId,
        {
          ...profile,
          ...payload,
        },
        true
      );

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
          photo: null,
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
      const data = await response.record?.data.json();
      setProfile({ ...profile, ...data });
    } catch (error) {
      console.log("error", error);
    }
  };

  const createAvatar = async (blob: Blob) => {
    try {
      if (!web5) return;

      const { record } = await web5.dwn.records.create({
        data: blob,
        message: {
          protocol: ProtocolDefinition.protocol,
          protocolPath: "avatar",
          schema: ProtocolDefinition.types.avatar.schema,
          dataFormat: ProtocolDefinition.types.avatar.dataFormats[1],
          published: true,
        },
      });

      if (!record) return;

      const photo = await record?.data.blob();
      const avatar = { photo, recordId: record.id };

      setProfile({ ...profile, avatar });
    } catch (error) {
      console.log("Error", error);
    }
  };

  const uploadAvatar = async (blob: Blob) => {
    try {
      if (!web5) return;
      if (profile.avatar?.recordId) {
        await web5.dwn.records.delete({
          message: {
            recordId: profile.avatar.recordId,
          },
        });
      }
      await createAvatar(blob);
    } catch (error) {
      console.log("error", error);
    }
  };

  return {
    profile,
    fetchProfile,
    createProfile,
    updateProfile,
    uploadAvatar,
  };
};
