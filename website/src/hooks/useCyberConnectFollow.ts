import { useCallback, useMemo, useState } from "react";
import useCyberConnect from "./useCyberConnect";

function useFollow() {
  const [isLoading, toggleIsLoading] = useState(false);
  const cc = useCyberConnect();

  const follow = useCallback(
    async (handle: string) => {
      if (!cc)
        return {
          isError: true,
          message: "CC client is not ready.",
        };

      toggleIsLoading(true);
      const error = await cc
        .follow(handle)
        .catch((e: any) => e)
        .finally(() => toggleIsLoading(false));

      if (!error || error.message === "ALREADY_DONE") {
        return { isSuccess: true };
      }
        return {
          isError: true,
          message: "Network busy. Please try again later.",
        };

    },
    [cc],
  );

  return useMemo(
    () => ({
      isLoading,
      follow,
    }),
    [isLoading, follow],
  );
}

export default useFollow;
