-----------------
-- DB creation --
-----------------
-- clear tables
drop table if exists reviews cascade;
drop table if exists reviews_photos cascade;
drop table if exists characteristics cascade;
drop table if exists characteristic_reviews cascade;

-- create tables
create table reviews (
  id serial primary key,
  product_id int not null,
  rating int not null,
  date BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
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
  id serial primary key,
  review_id int not null references reviews (id),
  url varchar(150)
);
create table characteristics (
  id serial primary key,
  product_id int not null,
  name varchar(15) not null
);
create table characteristic_reviews (
  id serial primary key,
  characteristic_id int not null references characteristics (id),
  review_id int not null references reviews (id),
  value int not null
);

-- import csv files
select now();
copy reviews from '/home/gilcohen67/hackreactor/rfp2204/sdc/reviews-service/db/hardDataStore/reviews.csv' csv header;
copy reviews_photos from '/home/gilcohen67/hackreactor/rfp2204/sdc/reviews-service/db/hardDataStore/reviews_photos.csv' csv header;
copy characteristics from '/home/gilcohen67/hackreactor/rfp2204/sdc/reviews-service/db/hardDataStore/characteristics.csv' csv header;
copy characteristic_reviews from '/home/gilcohen67/hackreactor/rfp2204/sdc/reviews-service/db/hardDataStore/characteristic_reviews.csv' csv header;
select now();

---------
-- ETL --
---------
-- fix "null" responses
UPDATE reviews SET response = null WHERE response = 'null';

-- create index for faster read times
create index idx_reviews_product_id on reviews(product_id);
create index idx_characteristic_characteristic_id on characteristic_reviews(characteristic_id);
create index idx_characteristic_reviews_review_id on characteristic_reviews(review_id);
create index idx_characteristics_product_id on characteristics(product_id);
create index idx_photos_review_id on reviews_photos(review_id);
select now();

-- update all primary keys because copy made them out of sync
SELECT setval(pg_get_serial_sequence('reviews', 'id'), max(id)) FROM reviews;
SELECT setval(pg_get_serial_sequence('reviews_photos', 'id'), max(id)) FROM reviews_photos;
SELECT setval(pg_get_serial_sequence('characteristics', 'id'), max(id)) FROM characteristics;
SELECT setval(pg_get_serial_sequence('characteristic_reviews', 'id'), max(id)) FROM characteristic_reviews;
select now();
