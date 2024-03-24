create table prod.users
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
    created_at    date,
    updated_at    date
);

alter table prod.users
    owner to postgres;

create table prod.tables
(
    id         varchar not null
        constraint id
            primary key,
    user_id    varchar
        constraint tables_users_id_fk
            references prod.users,
    name       varchar,
    type       varchar,
    rows       integer,
    columns    integer,
    created_at date
);

alter table prod.tables
    owner to postgres;

create table prod.table_contents
(
    id       varchar not null
        constraint table_contents_pk
            primary key,
    table_id varchar
        constraint table_contents_tables_id_fk
            references prod.tables,
    location varchar,
    content  varchar
);

alter table prod.table_contents
    owner to postgres;

create table staging.users
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
    created_at    date,
    updated_at    date
);

alter table staging.users
    owner to postgres;

create table staging.tables
(
    id         varchar not null
        constraint id
            primary key,
    user_id    varchar
        constraint tables_users_id_fk
            references staging.users,
    name       varchar,
    type       varchar,
    rows       integer,
    columns    integer,
    created_at date
);

alter table staging.tables
    owner to postgres;

create table staging.table_contents
(
    id       varchar not null
        constraint table_contents_pk
            primary key,
    table_id varchar
        constraint table_contents_tables_id_fk
            references staging.tables,
    location varchar,
    content  varchar
);

alter table staging.table_contents
    owner to postgres;

create table dev.users
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
    created_at    bigint,
    updated_at    bigint
);

alter table dev.users
    owner to postgres;

create table dev.tables
(
    id         varchar not null
        constraint id
            primary key,
    user_id    varchar
        constraint tables_users_id_fk
            references dev.users,
    name       varchar,
    type       varchar,
    rows       integer,
    columns    integer,
    created_at date
);

alter table dev.tables
    owner to postgres;

create table dev.table_contents
(
    id       varchar not null
        constraint table_contents_pk
            primary key,
    table_id varchar
        constraint table_contents_tables_id_fk
            references dev.tables,
    location varchar,
    content  varchar
);

alter table dev.table_contents
    owner to postgres;