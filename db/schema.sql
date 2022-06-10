-- load command: psql -d db_name -f [filepath]
drop table if exists reviews cascade;
drop table if exists reviews_photos cascade;
drop table if exists characteristics cascade;
drop table if exists characteristic_reviews cascade;

create table reviews (
  id serial not null primary key,
  product_id int not null,
  rating int not null,
  date varchar(13) not null,
  summary varchar(120),
  body varchar(1000),
  recommend boolean not null default false,
  reported boolean not null default false,
  reviewer_name varchar(60),
  reviewer_email varchar(60),
  response varchar(1000),
  helpfulness int not null default 0
);
create table reviews_photos (
  id serial not null primary key,
  review_id int not null references reviews (id),
  url varchar(150)
);
create table characteristics (
  id serial not null primary key,
  product_id int not null,
  name varchar(15) not null
);
create table characteristic_reviews (
  id serial not null primary key,
  characteristic_id int not null references characteristics (id),
  review_id int not null references reviews (id),
  value int not null
);

select now();
copy reviews from '/home/gilcohen67/hackreactor/rfp2204/sdc/reviews-service/db/hardDataStore/reviews.csv' csv header;
copy reviews_photos from '/home/gilcohen67/hackreactor/rfp2204/sdc/reviews-service/db/hardDataStore/reviews_photos.csv' csv header;
copy characteristics from '/home/gilcohen67/hackreactor/rfp2204/sdc/reviews-service/db/hardDataStore/characteristics.csv' csv header;
copy characteristic_reviews from '/home/gilcohen67/hackreactor/rfp2204/sdc/reviews-service/db/hardDataStore/characteristic_reviews.csv' csv header;
select now();
UPDATE reviews SET response = null WHERE response = 'null';
select now();
