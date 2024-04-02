create table if not exists prod.users
(
    id            varchar not null
        constraint users_pk
            primary key,
    username      varchar,
    name          varchar,
    email         varchar,
    password_hash varchar,
    salt          varchar,
    perm_flag     integer,
    created_at    varchar,
    updated_at    varchar
);

alter table prod.users
    owner to postgres;

create table if not exists prod.tables
(
    id         varchar not null
        constraint id
            primary key,
    user_id    varchar
        constraint tables_users_username_fk
            references prod.users
            on update cascade on delete cascade,
    name       varchar,
    type       varchar,
    rows       integer,
    columns    integer,
    created_at date
);

alter table prod.tables
    owner to postgres;

create table if not exists prod.table_contents
(
    id       varchar not null
        constraint table_contents_pk
            primary key,
    table_id varchar
        constraint table_contents_tables_columns_fk
            references prod.tables
            on update cascade on delete cascade,
    location varchar,
    content  varchar
);

alter table prod.table_contents
    owner to postgres;

create table if not exists staging.users
(
    id            varchar not null
        constraint users_pk
            primary key,
    username      varchar,
    name          varchar,
    email         varchar,
    password_hash varchar,
    salt          varchar,
    perm_flag     integer,
    created_at    varchar,
    updated_at    varchar
);

alter table staging.users
    owner to postgres;

create table if not exists staging.tables
(
    id         varchar not null
        constraint id
            primary key,
    user_id    varchar
        constraint tables_users_username_fk
            references staging.users
            on update cascade on delete cascade,
    name       varchar,
    type       varchar,
    rows       integer,
    columns    integer,
    created_at date
);

alter table staging.tables
    owner to postgres;

create table if not exists staging.table_contents
(
    id       varchar not null
        constraint table_contents_pk
            primary key,
    table_id varchar
        constraint table_contents_tables_columns_fk
            references staging.tables
            on update cascade on delete cascade,
    location varchar,
    content  varchar
);

alter table staging.table_contents
    owner to postgres;

create table if not exists dev.users
(
    id            varchar not null
        constraint users_pk
            primary key,
    username      varchar,
    name          varchar,
    email         varchar,
    password_hash varchar,
    perm_flag     integer,
    created_at    varchar,
    updated_at    varchar
);

alter table dev.users
    owner to postgres;

create table if not exists dev.tables
(
    id         varchar not null
        constraint id
            primary key,
    user_id    varchar
        constraint tables_users_username_fk
            references dev.users
            on update cascade on delete cascade,
    name       varchar,
    type       varchar,
    rows       integer,
    columns    integer,
    created_at bigint
);

alter table dev.tables
    owner to postgres;

create table if not exists dev.table_contents
(
    id       varchar not null
        constraint table_contents_pk
            primary key,
    table_id varchar
        constraint table_contents_tables_columns_fk
            references dev.tables
            on update cascade on delete cascade,
    location varchar,
    content  varchar
);

alter table dev.table_contents
    owner to postgres;

create table if not exists dev.blacklisted_tokens
(
    token            varchar not null
        constraint blacklisted_tokens_pk
            primary key,
    logout_timestamp bigint
);

alter table dev.blacklisted_tokens
    owner to postgres;

create table if not exists staging.blacklisted_tokens
(
    token            varchar not null
        constraint blacklisted_tokens_pk
            primary key,
    logout_timestamp bigint
);

alter table staging.blacklisted_tokens
    owner to postgres;

create table if not exists prod.blacklisted_tokens
(
    token            varchar not null
        constraint blacklisted_tokens_pk
            primary key,
    logout_timestamp bigint
);

alter table prod.blacklisted_tokens
    owner to postgres;

