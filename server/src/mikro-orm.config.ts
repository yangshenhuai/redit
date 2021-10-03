import { MikroORM } from "@mikro-orm/core";
import path from "path";

import { __dbhost__, __dbname__, __dbpassword__, __dbport__, __dbuser__, __prod__ } from "./constants";
import { Posts } from "./entities/Posts";
import { User } from "./entities/User";


export default {
    user: __dbuser__,
    password: __dbpassword__,
    dbName : __dbname__,
    host: __dbhost__,
    port: __dbport__,
    type : 'postgresql',
    debug: !__prod__,
    entities: [Posts,User],
    migrations:{
        path: path.join(__dirname,'migration'),
        pattern : /^[\w-]+\d+\.[tj]s$/
    }
} as Parameters<typeof MikroORM.init>[0]