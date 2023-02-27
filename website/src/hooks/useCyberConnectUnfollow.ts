import { useCallback, useMemo, useState } from "react";
import useCyberConnect from "./useCyberConnect";

function useUnFollow() {
  const [isLoading, toggleIsLoading] = useState(false);
  const cc = useCyberConnect();

  const unFollow = useCallback(
    async (address: string, handle: string) => {
      if (!cc) {
        return {
          isError: true,
          message: "CC client is not ready.",
        };
      }

      toggleIsLoading(true);

      const error = await cc
        .unfollow(address, handle)
        .catch((error: any) => error)
        .finally(() => toggleIsLoading(false));

      if (!error || error.message === "ALREADY_DONE") {
        return { isSuccess: true };
      } else {
        return {
          isError: true,
          message: "Network busy. Please try again later.",
        };
      }
    },
    [cc]
  );

  return useMemo(
    () => ({
      isLoading,
      unFollow,
    }),
    [isLoading, unFollow]
  );
}

export default useUnFollow;
