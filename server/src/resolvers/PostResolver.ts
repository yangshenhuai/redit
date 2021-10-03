
import { Posts } from "../entities/Posts";
import { MyContext } from "src/types";
import { Resolver, Query ,Ctx ,Arg, Int ,Mutation} from "type-graphql";

@Resolver()
export class PostResolver {

    @Query(() => [Posts])
    posts(
        @Ctx() {orm} : MyContext
    ): Promise<Posts[]> {
        return orm.em.find(Posts,{})
    }


    @Query(() => Posts , { nullable : true })
    post(
        @Arg("id",() => Int) id: number ,
        @Ctx() {orm} : MyContext
    ) : Promise<Posts | null >  {
        return orm.em.findOne(Posts, { id })
    }



    @Mutation(() => Posts)
    async createPost(
        @Arg("title") title: string ,
        @Ctx() {orm} : MyContext
    ) : Promise<Posts>  {
        const post = orm.em.create(Posts,{title: title})
        await orm.em.persistAndFlush(post)
        return post;
    }


    @Mutation(() => Posts)
    async updatePost(
        @Arg("id") id: number ,
        @Arg("title", {nullable:true}) title: string ,
        @Ctx() {orm} : MyContext
    ) : Promise<Posts | null>  {
        const post = await orm.em.findOne(Posts, { id })
        if(!post) {
            return null;
        }
        if(typeof title !== 'undefined') {
            post.title = title
            await orm.em.persistAndFlush(post)
        }
        return post;
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg("id") id: number ,
        @Ctx() {orm} : MyContext
    ) : Promise<boolean>  {
        await orm.em.nativeDelete(Posts,{id})
        return true;
    }

}