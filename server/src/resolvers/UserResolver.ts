import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
  Resolver,
  Ctx,
  Arg,
  Field,
  Mutation,
  ObjectType,
  Query,
} from "type-graphql";
import argon2 from "argon2";
import { __cookiename__, __uiurl__ } from "../constants";
import  UsernamePasswordInput  from "../util/UsernamePasswordInput";
import { validateRegister } from "../util/validator";
// import { sendEmail } from "src/util/sendMail";

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  me(@Ctx() { orm, req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }
    return orm.em.findOne(User, { id: req.session.userId });
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { orm, req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options)
    if(errors){
        return {errors}
    }
    const hashedPasswd = await argon2.hash(options.password);
    const user = orm.em.create(User, {
      username: options.username,
      password: hashedPasswd,
      email : options.email
    });
    try {
      await orm.em.persistAndFlush(user);
    } catch (err) {
      if (err.code == "23505") {
        //duplicate user
        let errorField;
        if( err.message.includes('user_email_unique')){
            errorField = "email"
        } else {
            errorField = "username"
        }

        return {
          errors: [
            {
              field: errorField,
              message: "already exists",
            },
          ],
        };
      }
    }
    
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { orm, req }: MyContext
  ): Promise<UserResponse> {
    const user = await orm.em.findOne(
      User,
      usernameOrEmail.includes("@")
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail }
    );
    if (!user) {
      return {
        errors: [{ field: "usernameOrEmail", message: "the account not exists" }],
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "invalid password",
          },
        ],
      };
    }
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    res.clearCookie(__cookiename__);
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        if (err) {
          console.error("fail to logout", err);
          resolve(false);
          return;
        }

        resolve(true);
        return;
      })
    );
  }

  // @Mutation(() => Boolean)
  // async forgotPassword( @Arg("email") email:string , @Ctx() { orm }: MyContext) {
  //     const user = await orm.em.findOne(User,{ email })
  //     if(!user){
  //         return true ;
  //     }
  //     const subject = "Reset password"
  //     const token = ""
      

  //     await sendEmail(email,subject, `<a href="${__uiurl__}/change-password/${token}">`)
  // }

}
