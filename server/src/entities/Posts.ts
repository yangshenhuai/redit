import { Entity, PrimaryKey, Property, } from "@mikro-orm/core";

import { ObjectType ,Field , Int} from "type-graphql"

@Entity()
@ObjectType() 
export class Posts {
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
  @Property({columnType: "text"})
  title!: string;
}
