import { Migration } from '@mikro-orm/migrations';

export class Migration20211005091651 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "posts" add column "text" text not null, add column "point" int not null default 0, add column "user_id" int4 not null;');

    this.addSql('alter table "posts" add constraint "posts_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
  }

}
