import type { AppProps } from "next/app";

import { Suspense, useEffect } from "react";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import store from "../store";
import PageLoader from "@/components/Loader";

import "react-multi-carousel/lib/styles.css";
import "react-loading-skeleton/dist/skeleton.css";

import "@/styles/globals.css";
import "@/styles/styles.css";
import "@/styles/custom-datepicker.css";
import "@/styles/conference.css";
import "@/styles/authlayout.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const route = useRouter();
  let persistor = persistStore(store);

  const queryClient = new QueryClient();

  return (
    <SessionProvider session={session} refetchInterval={0}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Toaster position="top-right" containerClassName="toaster" />
          <PersistGate
            persistor={persistor}
            loading={
              <div className="w-full h-screen flex justify-center items-center">
                <PageLoader />
              </div>
            }
          >
            <Suspense
              fallback={
                <div className="w-full h-screen flex justify-center items-center">
                  <PageLoader />
                </div>
              }
            >
              <Component key={route.asPath} {...pageProps} />
            </Suspense>
          </PersistGate>
        </Provider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
}
