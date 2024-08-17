import { atom } from "jotai";

import { Profile } from "lib/types";

const initialState: Profile = {
  recordId: "",
  uid: "",
  did: "",
  name: "",
  avatar: "",
};

export const dbProfileAtom = atom<Profile>(initialState);

export const profileAtom = atom(
  (get) => get(dbProfileAtom),
  (get, set, profile: Profile) => {
    set(dbProfileAtom, { ...get(dbProfileAtom), ...profile });
  }
);

export const profileCreatedAtom = atom((get) => {
  const profile = get(profileAtom);
  return !!profile.recordId;
});

export const profileReadyAtom = atom((get) => {
  const profile = get(profileAtom);
  return profile.recordId && profile.avatar ? true : false;
});

export const profileFetchedAtom = atom<boolean>(false);
