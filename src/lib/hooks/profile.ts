import { ChangeEvent, useCallback, useState } from "react";
import { useAtom } from "jotai";
import { v4 as uuidv4 } from "uuid";

import { useWeb5 } from "lib/contexts";
import { ProtocolDefinition } from "lib/protocols";
import { ChatMember, Profile, ProfilePayload } from "lib/types";

import {
  profileAtom,
  profileCreatedAtom,
  profileFetchedAtom,
} from "lib/stores";
import { fetchProfile, updateRecord } from "lib/utils";
import { useDebounce } from "./ui";

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
      if (!web5 || !did) return;

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

export const useProfilesSearch = (existingContacts: ChatMember[]) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { web5, did } = useWeb5();

  const searchProfiles = async (search: string) => {
    try {
      if (!search) {
        setProfile(null);
        return;
      }

      if (isContactPresent(search)) return;

      if (!web5 || !did) return;

      const isDid = search.startsWith("did:");
      if (!isDid) return;

      const member = await fetchProfile(web5, search);

      if (!member) return;
      setProfile(member);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSearch = (search: string) => searchProfiles(search);

  const debouncedOnChange = useCallback(useDebounce(handleSearch, 500), []);
  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    debouncedOnChange(e.target.value);
  };

  const isContactPresent = (did: string) =>
    !!existingContacts.find((c) => c.did === did);

  return { profile, onSearchChange };
};
