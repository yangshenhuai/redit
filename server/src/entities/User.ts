import { Collection, Entity, ManyToMany, OneToMany, PrimaryKey, Property, } from "@mikro-orm/core";

import { ObjectType ,Field , Int} from "type-graphql"
import { Posts } from "./Posts";

@Entity()
@ObjectType() 
export class User {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;
  
  @Field(() => String)
  @Property({type: "date"})
  createAt = new Date();
  
  @Field(() => String)
  @Property({ type: "date" , onUpdate: () => new Date() })
  upateAt = new Date();

  @Field()
  @Property({columnType: "text",unique: true})
  username!: string;

  @Field()
  @Property({columnType: "text",unique: true})
  email!: string;

  @Property({columnType: "text"})
  password!: string;

  @OneToMany(() => Posts, posts => posts.user)
  posts = new Collection<Posts>(this);

  @ManyToMany(() => Posts , post => post.upvoter)
  upvoted = new Collection<Posts>(this)


}
