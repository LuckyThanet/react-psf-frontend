import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";

import { EventType, PublicClientApplication } from "@azure/msal-browser";
import type { AuthenticationResult, EventMessage } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";

import { msalConfig } from "../config/msalConfig";

function MsalAuthProvider({ children }: { children: ReactNode }) {
  const msalInstance = useMemo(() => new PublicClientApplication(msalConfig), []);

  useEffect(() => {
    let isMounted = true;
    
    (async () => {
      try {
        await msalInstance.initialize();
        const result = await msalInstance.handleRedirectPromise();
        if (!isMounted) return;
        if (result?.account) {
          msalInstance.setActiveAccount(result.account);
        } else if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
          msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
        }
      } catch (err) {
        // keep logging for debugging
        // eslint-disable-next-line no-console
        console.error("MSAL initialize/handleRedirectPromise error", err);
      }
    })();

    const callbackId = msalInstance.addEventCallback((event: EventMessage) => {
      const authenticationResult = event.payload as AuthenticationResult;
      const account = authenticationResult?.account;

      if (event.eventType === EventType.LOGIN_SUCCESS && account) {
        msalInstance.setActiveAccount(account);
      }
    });

    return () => {
      isMounted = false;
      if (callbackId) msalInstance.removeEventCallback(callbackId);
    };
  }, [msalInstance]);

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}

export { MsalAuthProvider };


