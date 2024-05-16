import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./utils/index.css";
import { Provider } from "react-redux";
import store, { persistor } from "./store/Store.ts";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Flowbite } from "flowbite-react";
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 60 * 1000,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <PersistGate persistor={persistor}>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Flowbite>
          <App />
        </Flowbite>
      </Provider>
    </QueryClientProvider>
  </PersistGate>,
);
