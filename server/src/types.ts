import { Connection, IDatabaseDriver, MikroORM } from "@mikro-orm/core";
import { Request,Response } from "express";
import { Redis } from "ioredis";


export type MyContext = {
    orm: MikroORM<IDatabaseDriver<Connection>> ,
    req: Request,
    res: Response,
    redis : Redis,
}