drop database if exists employee_db;

create database employee_db;

use employee_db;

create table department (
departmentid int auto_increment not null,
primary key (departmentid),
name varchar(30)
);

create table role (
roleid int auto_increment not null,
primary key (roleid),
title varchar(30),
salary decimal(10, 4),
departmentfk int,
foreign key (departmentfk) references department (departmentid)
);

create table employee (
id int auto_increment not null,
primary key (id),
first_name varchar(30) not null,
last_name varchar(30) not null,
rolefk int,
foreign key (rolefk) references role (roleid)
);