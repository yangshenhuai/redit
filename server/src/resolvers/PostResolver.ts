import { Posts } from "../entities/Posts";
import { MyContext } from "src/types";
import {
  Resolver,
  Query,
  Ctx,
  Arg,
  Int,
  Mutation,
  InputType,
  Field,
  UseMiddleware,
  FieldResolver,
  Root,
} from "type-graphql";

import { User } from "../entities/User";
import { isAuth } from "../middleware/isAuth";

import { getTextSnippet } from "../util/snippet";

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@Resolver(Posts)
export class PostResolver {
  @FieldResolver()
  textSnippet(@Root() root: Posts): string {
    return getTextSnippet(root.text, 60);
  }

  @Query(() => [Posts])
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("offset", () => Int) offset: number,
    @Ctx() { orm, req }: MyContext
  ): Promise<Posts[]> {
    const realLimit = Math.min(limit, 100); //protect our backend
    // const entityManager = orm.em.fork() as EntityManager;

    // const qb =  entityManager
    //   .createQueryBuilder(Posts)
    // .select(["*"])
    // .leftJoinAndSelect('user','user')
    // .select()
    // .limit(realLimit)
    // .offset(offset)
    // .orderBy({ createAt: "desc" })
    // .execute() ;
    // qb.exe(qb.raw(""))
    // qb.select(["*"]).

    const connection = orm.em.getConnection();

    let sql =
      'select "p"."id" ,"p"."title" ,"p"."text" ,"p"."point" ,"p"."create_at" as "createAt" ,"p"."upate_at" as "upateAt" , json_build_object(\'id\',"u"."id" , \'username\', "u"."username",\'email\',"u"."email") "user"  ';

    if (req.session.userId) {
      sql =
        sql +
        ' , (select count(1) from "posts_upvoter" as "pu" where "pu"."posts_id"= "p"."id" and "pu"."user_id"= ' +
        req.session.userId +
        " ) as \"voteStatus\" ";
    } else {
      sql =
        sql + ' , \'0\' as \"voteStatus\" '
    }

    sql =
      sql +
      ' from "posts" as "p" left join "user" as "u" on "p"."user_id" = "u"."id" order by "p"."create_at" desc  offset ' +
      offset +
      " limit " +
      realLimit;

    return await connection.execute(sql);

  }

  @Query(() => Posts, { nullable: true })
  post(
    @Arg("id", () => Int) id: number,
    @Ctx() { orm }: MyContext
  ): Promise<Posts | null> {
    return orm.em.findOne(Posts, { id }, ['user'] );
  }

  @Mutation(() => Posts)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req, orm }: MyContext
  ): Promise<Posts> {
    const user = orm.em.getReference<User>(User, req.session.userId as number);
    const post = orm.em.create(Posts, {
      title: input.title,
      text: input.text,
      user: user,
    });
    await orm.em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Posts)
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", { nullable: true }) title: string,
    @Ctx() { orm }: MyContext
  ): Promise<Posts | null> {
    const post = await orm.em.findOne(Posts, { id });
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      post.title = title;
      await orm.em.persistAndFlush(post);
    }
    return post;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg("id" ,() => Int) id: number,
    @Ctx() { orm ,req }: MyContext
  ): Promise<boolean> {
    const post = await orm.em.findOne(Posts, { id });
    if (!post){
      return false;
    }
    if(post.user.id != req.session.userId){
      throw new Error("not authorized!");
    }

    await orm.em.nativeDelete(Posts, { id  });
    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async upvote(
    @Arg("postId", () => Int!) id: number,
    @Ctx() { req, orm }: MyContext
  ) {
    const em = orm.em.fork();
    let userId = req.session.userId;

    const post = await em.findOne(Posts, { id });
    if (!post) {
      return false;
    }
    await post.upvoter.init();
    if (post.upvoter.getIdentifiers().includes(userId as number)) {
      return false;
    }

    post.upvoter.add(em.getReference<User>(User, userId as number));
    post.point = post.point + 1;
    await em.persistAndFlush(post);
    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async downvote(
    @Arg("postId", () => Int!) id: number,
    @Ctx() { orm }: MyContext
  ) {
    //not use this currently
    const em = orm.em.fork();
    const post = await em.findOne(Posts, { id });
    if (!post) {
      return false;
    }
    post.point = post.point - 1;
    em.flush();
    return true;
  }
}
