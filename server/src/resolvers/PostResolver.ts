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
import { EntityManager } from "@mikro-orm/postgresql";
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
  textSnippet(@Root() root : Posts) : string {
    return getTextSnippet(root.text,60)
  }

  @Query(() => [Posts])
  async posts(
    @Arg("limit" , () => Int) limit: number,
    @Arg("offset" , () => Int) offset: number,
    @Ctx() { orm }: MyContext
  ): Promise<Posts[]> {
    const realLimit = Math.min(limit, 100); //protect our backend
    const entityManager = orm.em.fork() as EntityManager;

    return await entityManager
      .createQueryBuilder(Posts)
      .select(["*"])
      .leftJoinAndSelect('user','user')
      .limit(realLimit)
      .offset(offset)
      .orderBy({ createAt: "desc" })
      .execute();

  }

  @Query(() => Posts, { nullable: true })
  post(
    @Arg("id", () => Int) id: number,
    @Ctx() { orm }: MyContext
  ): Promise<Posts | null> {
    return orm.em.findOne(Posts, { id });
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
  async deletePost(
    @Arg("id") id: number,
    @Ctx() { orm }: MyContext
  ): Promise<boolean> {
    await orm.em.nativeDelete(Posts, { id });
    return true;
  }
}
