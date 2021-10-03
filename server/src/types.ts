import { Connection, IDatabaseDriver, MikroORM } from "@mikro-orm/core";
import { Request,Response } from "express";

export type MyContext = {
    orm: MikroORM<IDatabaseDriver<Connection>> ,
    req: Request,
    res: Response
}