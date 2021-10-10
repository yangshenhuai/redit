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
import { Context, gql } from "urql";




export const createUrqlClient = (ssrExchange: any , ctx) => ({
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
          deletePost: (_result, args, cache, info) => {
            cache.invalidate({__typename:'Posts' , id: args.id})
          },
          upvote: (_result, args, cache, info) => {

            const data = cache.readFragment(
              gql`
                fragment _ on Posts {
                  id
                  point
                }
              `,
              { id: args.postId } 
            );
   
            if(data){
              const newPoint = data.point as number + 1
              cache.writeFragment(
                gql`
                  fragment __ on Posts {
                    id
                    point
                    voteStatus  
                  }
                `,
                { id: args.postId, point: newPoint , voteStatus : "1" }
              );
            }
          },

          createPost: (_result, args, cache, info) => {
            cache.invalidate("Query","posts",{limit:10,offset:0})
          },
          logout: (_result, args, cache, info) => {
            updateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => ({ me: null })
            );
            cache.invalidate("Query","posts",{limit:10,offset:0});
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
            cache.invalidate("Query","posts",{limit:10,offset:0});
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
    headers: {
      cookie: ctx && ctx.req ? ctx.req.headers.cookie : document.cookie,
    }
  } as const,

});

