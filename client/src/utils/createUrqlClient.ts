import { dedupExchange, fetchExchange } from "@urql/core";
import { cacheExchange } from "@urql/exchange-graphcache";
import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  LoginMutation,
  RegisterMutation,
} from "../generated/graphql";
import updateQuery from "./updateQuery";
import { simplePagination } from '@urql/exchange-graphcache/extras';




export const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:8000/graphql",
  exchanges: [
    dedupExchange,
    cacheExchange({
      resolvers: {
         Query: {
           posts: simplePagination({limitArgument:'limit',offsetArgument:'offset'}),
         }
      },

      updates: {
        Mutation: {
          logout: (_result, args, cache, info) => {
            updateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => ({ me: null })
            );
          },
          login: (_result, args, cache, info) => {
            updateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              }
            );
          },
          register: (_result, args, cache, info) => {
            updateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    me: result.register.user,
                  };
                }
              }
            );
          },
        },

      },
      keys: {
        ValidateResponse: ()=> null,
        FieldError: () => null,
      }
    }),
    ssrExchange,
    fetchExchange,
  ],
  fetchOptions: {
    credentials: "include",
  } as const,
});

