import { atom } from "jotai";

import { Profile } from "lib/types";

const initialState: Profile = {
  recordId: "",
  uid: "",
  did: "",
  name: "",
  photo: "",
};

export const dbProfileAtom = atom<Profile>(initialState);

export const profileAtom = atom(
  (get) => get(dbProfileAtom),
  (get, set, profile: Profile) => {
    set(dbProfileAtom, { ...get(dbProfileAtom), ...profile });
  }
);
