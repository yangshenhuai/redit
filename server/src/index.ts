import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import config from "./mikro-orm.config";
import {
  __dbname__,
  __prod__,
  __redishost__,
  __redispassword__,
  __redisport__,
  __redisttl__,
  __sessionsecret__,
  __uiurl__,
  __whitelisturl__,
} from "./constants";
import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/HelloResolver";
import { PostResolver } from "./resolvers/PostResolver";
import { UserResolver } from "./resolvers/UserResolver";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";

const main = async () => {
  const orm = await MikroORM.init(config);
  //await orm.getMigrator().up().catch( e  => console.warn('migration up failed')); //in case we run the up with the mikro orm cli
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient({
    port: __redisport__,
    host: __redishost__,
    password: __redispassword__,
  });
  const app = express();

  const corsOptions: cors.CorsOptions = {
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "X-Access-Token",
    ],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    // origin: __uiurl__,
    origin: (origin ,callback) => {
      
      if(__whitelisturl__.indexOf(origin as string) !== -1 || !origin) {
        callback(null,true)
      } else {
        callback(new Error('this url is not allowed by CORS'))
      }
    },
    preflightContinue: false,
  };

  app.use(cors(corsOptions));

  app.use(
    session({
      name: "sid",
      store: new RedisStore({ client: redisClient, ttl: __redisttl__ }),
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: __prod__,
        sameSite: "lax",
      },
      saveUninitialized: false,
      secret: __sessionsecret__,
      resave: false,
    })
  );

  //   app.use(function(_,res){
  //     res.setHeader('Access-Control-Allow-Origin','https://studio.apollographql.com')
  //     res.setHeader('Access-Control-Allow-Credentials','true')
  // })

  const gsqlserver = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ orm: orm, req, res }),
  });
  await gsqlserver.start();
  gsqlserver.applyMiddleware({ app, cors: false });

  app.listen(8000, () => {
    console.log("the server start up and listening on port 8000");
  });
};

main().catch((ex) => {
  console.log(ex);
});
