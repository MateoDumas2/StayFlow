"use client";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import React, { useMemo } from "react";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:4011/graphql",
  fetchOptions: { cache: "no-store" },
});

const authLink = new ApolloLink((operation, forward) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
    }));
  }

  return forward(operation);
});

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  const client = useMemo(
    () =>
      new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
      }),
    [],
  );

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
