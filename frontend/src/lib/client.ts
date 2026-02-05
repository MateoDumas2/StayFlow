import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const getClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:4011/graphql",
      fetchOptions: { cache: "no-store" },
    }),
    cache: new InMemoryCache(),
  });
};
