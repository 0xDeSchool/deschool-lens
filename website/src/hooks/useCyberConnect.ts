import CyberConnect, { Env } from "@cyberlab/cyberconnect-v2";
import { useEffect, useMemo, useState } from "react";

let cyberConnectInstance: CyberConnect;

const getCCInstance = (provider: any) => {
  if (!!cyberConnectInstance) return cyberConnectInstance;

  if (!provider) return null;

  const instance = new CyberConnect({
    namespace: "Booth",
    env: Env.STAGING,
    // env: import.meta.env.MODE === 'production' ? Env.PRODUCTION : Env.STAGING,
    provider,
    signingMessageEntity: "Booth",
  });

  cyberConnectInstance = instance;

  return instance;
};

function useCyberConnect() {
  const [cc, setCyberConnect] = useState<any>(null);

  useEffect(() => {
    // force client render
    setCyberConnect(getCCInstance(window.ethereum));
  }, []);

  return useMemo(() => cc, [cc]);
}

export default useCyberConnect;
