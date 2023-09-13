import type { AppProps } from "next/app";

import { Suspense } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import store from "../store";
import PageLoader from "@/components/Loader";

import { theme } from "../styles/baseTheme";

import "react-multi-carousel/lib/styles.css";
import "react-loading-skeleton/dist/skeleton.css";

import "react-toastify/dist/ReactToastify.css";

import "@/styles/globals.css";
import "@/styles/styles.css";
import "@/styles/authlayout.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const route = useRouter();
  let persistor = persistStore(store);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
      },
    },
  });

  return (
    <SessionProvider session={session} refetchInterval={0}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <ToastContainer />

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
              <ChakraProvider theme={theme}>
                <Component key={route.asPath} {...pageProps} />
              </ChakraProvider>
            </Suspense>
          </PersistGate>
        </Provider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
}
