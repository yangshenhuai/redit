import { Collection, Entity, ManyToMany, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";

import { ObjectType, Field, Int } from "type-graphql";
import { User } from "./User";

@Entity()
@ObjectType()
export class Posts {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field()
  @Property({ columnType: "text" })
  title!: string;

  @Field()
  @Property({ columnType: "text" })
  text: string;

  @Field()
  @Property({ columnType: "int" , default : 0 })
  point: number;

  @Field()
  @ManyToOne(() => User)
  user!: User;

  @Field()
  voteStatus?: string  //whether it's voted by current user.


  @ManyToMany(() => User)
  upvoter = new Collection<User>(this)


  @Field(() => String)
  @Property({ type: "date" })
  createAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  upateAt = new Date();
}
