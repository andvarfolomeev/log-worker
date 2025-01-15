drop table if exists log;
create table if not exists log (id integer primary key, userUUID text, createdAt timestamp default current_timestamp, content text);
