const client = 'pg';
const connectionString = 'postgres://foyvmuee:xt6BO6gX_zB7wCqANcxVKCRSejLFUCju@lallah.db.elephantsql.com:5432/foyvmuee';

const db = require('knex')({
    client: client,
    connection: connectionString
})

db.raw(`
    drop table if exists users cascade;
    drop table if exists groups cascade;
    drop table if exists user_group;
    drop table if exists permissions cascade;
    drop table if exists group_permissions;

    create table users(
        id serial PRIMARY KEY not null,
        login varchar(50) not null,
        password varchar(50) not null,
        age int not null,
        is_deleted boolean default false
     );

    create index ix_login_deleted
    on users (login, is_deleted);

    create table groups(
        group_id serial PRIMARY KEY not null,
        group_name varchar(50) UNIQUE not null  
    );

    create table user_group(
        user_id int REFERENCES users (id) ON DELETE CASCADE,
        group_id int REFERENCES groups (group_id) ON DELETE CASCADE,
        CONSTRAINT user_group_pk PRIMARY KEY (user_id, group_id)
    );

    create table permissions(
        permission_id serial PRIMARY KEY,
        permission_name varchar(50) UNIQUE       
    );

    create table group_permissions(
        group_id int REFERENCES groups (group_id) ON DELETE CASCADE,
        permission_id int REFERENCES permissions (permission_id) ON DELETE CASCADE,
        CONSTRAINT group_permissions_pk PRIMARY KEY (group_id, permission_id)
    );

    insert into users (login, password, age, is_deleted)
    values 
        ('user1', 'user1pw', 24, false),
        ('user2', 'user2pw', 25, false),
        ('user3', 'user3pw', 30, true),
        ('user4', 'user4pw', 80, false),
        ('user5', 'user5pw', 42, false);


    insert into groups (group_name)
    values 
        ('group1');

    insert into user_group (user_id, group_id)
    values
        (2, 1);

    insert into permissions (permission_name)
    values
        ('READ'),
        ('WRITE'),
        ('DELETE'),
        ('SHARE'),
        ('UPLOAD_FILES');

    insert into group_permissions (group_id, permission_id)
    values
        (1, 1),
        (1, 3),
        (1, 5);
`)
    .then(() => process.exit(0));

