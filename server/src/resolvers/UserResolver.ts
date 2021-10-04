
import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Resolver, Ctx ,Arg, Field ,Mutation,InputType,ObjectType, Query} from "type-graphql";
import argon2 from "argon2"
import { __cookiename__ } from "../constants";


@InputType()
class UsernamePasswordInput {

    @Field()
    username : string;
    @Field()
    password : string ;
}

@ObjectType()
class FieldError {
    @Field()
    field: string;

    @Field()
    message: string;
}


@ObjectType()
class UserResponse{
    @Field( () => [FieldError] , {nullable : true})
    errors? : FieldError[]
    @Field( () => User , { nullable: true})
    user? : User
}

@Resolver()
export class UserResolver {


    @Query(() => User,{nullable:true})
    me(@Ctx() {orm,req} : MyContext){
        if(!req.session.userId){
            return null
        }
       return orm.em.findOne(User,{id: req.session.userId})
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg("options") options: UsernamePasswordInput ,
        @Ctx() {orm,req} : MyContext
    ) :  Promise<UserResponse> {
        if(options.username.length <=2) {
            return {errors :[
                {
                    field: "username",
                    message: "length must be greater 2 letters"
                }
            ]}
        }

        if(options.password.length <=3) {
            return {errors :[
                {
                    field: "password",
                    message: "length must be greater 3 letters"
                }
            ]}
        }

        const hashedPasswd = await argon2.hash(options.password)
        const user = orm.em.create(User,{username: options.username,password: hashedPasswd})
        try{
            await orm.em.persistAndFlush(user)
        } catch(err) {
            if(err.code == '23505'){ //duplicate user
                return {errors :[
                    {
                        field: "username",
                        message: "already exists"
                    }
                ]}
            }
        }

        req.session.userId = user.id
        
        return {user};
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("options") options: UsernamePasswordInput ,
        @Ctx() {orm , req } : MyContext
    ): Promise<UserResponse> {
        const user = await orm.em.findOne(User,{username: options.username})
        if(!user){
            return {
                errors: [{field: "username" , message: 'the username not exists'}]
            }
        } 
        const valid = await argon2.verify(user.password,options.password)
        if(!valid){
            return {
                errors: [
                    {
                        field: "password",
                        message: "invalid password"
                    }
                ]
            }
 
        }
        req.session.userId = user.id
      
        return {user};
    }

    @Mutation(() => Boolean)
    logout(
        @Ctx() {req,res} : MyContext
    ) {
        res.clearCookie(__cookiename__)
        return new Promise(resolve =>  req.session.destroy(err=>{
            
            if(err){
                console.error("fail to logout",err)
                resolve(false)
                return 
            }

            resolve(true) ;         
            return 
        }))
    }


}