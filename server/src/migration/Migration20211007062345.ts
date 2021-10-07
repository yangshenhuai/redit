import { Migration } from '@mikro-orm/migrations';

export class Migration20211007062345 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "posts_upvoter" ("posts_id" int4 not null, "user_id" int4 not null);');
    this.addSql('alter table "posts_upvoter" add constraint "posts_upvoter_pkey" primary key ("posts_id", "user_id");');

    this.addSql('alter table "posts_upvoter" add constraint "posts_upvoter_posts_id_foreign" foreign key ("posts_id") references "posts" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "posts_upvoter" add constraint "posts_upvoter_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
  }

}
