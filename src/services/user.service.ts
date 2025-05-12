import { headers } from "next/headers";
import { auth } from "~/lib/auth";

export const user = {
  getUser: async () => {
    return auth.api.getSession({ headers: await headers() });
  },
};
