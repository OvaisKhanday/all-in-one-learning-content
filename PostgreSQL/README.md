# Learn PostgreSQL

## Introduction

### What is PostgreSQL?

PostgreSQL is an free open-source database system that supports both relational (SQL) and non-relational (JSON) queries.

PostgreSQL is a back-end database for dynamic websites and web applications.

### PostgreSQL History

PostgreSQL was invented at the Berkeley Computer Science Department, University of California.

It started as a project in 1986 with the goal of creating a database system with the minimal features needed to support multiple data types.

In the beginning, PostgreSQL ran on UNIX platforms, but now it can run on various platforms, including Windows and MacOS.

### CREATE TABLE

```sql
CREATE TABLE cars (
  brand VARCHAR(255),
  model VARCHAR(255),
  year INT
);

-- CREATE TABLE (on console)
```

### INSERT INTO

```sql
INSERT INTO cars (brand, model, year)
VALUES
  ('Volvo', 'p1800', 1968),
  ('BMW', 'M1', 1978),
  ('Toyota', 'Celica', 1975);

-- INSERT 0 3
```

### ALTER TABLE

```sql
ALTER TABLE cars
ADD color VARCHAR(255);

-- ALTER TABLE

ALTER TABLE cars
ALTER COLUMN year TYPE VARCHAR(4);

-- ALTER TABLE

ALTER TABLE cars
DROP COLUMN color;

-- ALTER TABLE
```

### UPDATE Statement

```sql
UPDATE cars
SET color = 'white', year = 1970
WHERE brand = 'Toyota';

-- UPDATE 1
```

### DELETE Statement

```sql
DELETE FROM cars
WHERE brand = 'Volvo';
-- DELETE 1

-- DELETE all records
DELETE FROM cars;
-- DELETE 4

TRUNCATE TABLE cars;
-- TRUNCATE TABLE
```

### DROP TABLE

```sql
DROP TABLE cars;

-- DROP TABLE
```

## Operators

### Operators in the WHERE clause

We can operate with different operators in the WHERE clause:

| operator    | description                                                |
| ----------- | ---------------------------------------------------------- |
| =           | Equal to                                                   |
| <           | Less than                                                  |
| >           | Greater than                                               |
| <=          | Less than or equal to                                      |
| >=          | Greater than or equal to                                   |
| <>          | Not equal to                                               |
| !=          | Not equal to                                               |
| LIKE        | Check if a value matches a pattern (case sensitive)        |
| ILIKE       | Check if a value matches a pattern (case insensitive)      |
| AND         | Logical AND                                                |
| OR          | Logical OR                                                 |
| IN          | Check if a value is between a range of values              |
| BETWEEN     | Check if a value is between a range of values              |
| IS NULL     | Check if a value is NULL                                   |
| NOT         | Makes a negative result e.g. NOT LIKE, NOT IN, NOT BETWEEN |
| IS NOT NULL | Check if a value is NOT NULL                               |

### SELECT

```sql
-- SELECT
SELECT customer_name, country FROM customers;

-- DISTINCT
SELECT DISTINCT country FROM customers;

SELECT COUNT(DISTINCT country) FROM customers;

-- WHERE
SELECT * FROM customers
WHERE city = 'London';

-- ORDER BY
SELECT * FROM products
ORDER BY price;
SELECT * FROM products
ORDER BY price DESC;

-- LIMIT and OFFSET
SELECT * FROM customers
LIMIT 20 OFFSET 40;

-- MIN, MAX
SELECT MIN(price)
FROM products;
SELECT MAX(price)
FROM products;
SELECT MIN(price) AS lowest_price
FROM products;

-- COUNT
SELECT COUNT(customer_id)
FROM customers;

-- SUM
SELECT SUM(quantity)
FROM order_details;

-- AVG
SELECT AVG(price)
FROM products;

SELECT AVG(price)::NUMERIC(10,2)
FROM products;

-- LIKE and ILIKE
SELECT * FROM customers
WHERE customer_name LIKE 'A%';

SELECT * FROM customers
WHERE customer_name ILIKE '%A%';

-- IN and NOT IN
SELECT * FROM customers
WHERE country IN ('Germany', 'France', 'UK');

SELECT * FROM customers
WHERE country NOT IN ('Germany', 'France', 'UK');

SELECT * FROM customers
WHERE customer_id IN (SELECT customer_id FROM orders);

-- BETWEEN
SELECT * FROM Products
WHERE Price BETWEEN 10 AND 15;

SELECT * FROM Products
WHERE product_name BETWEEN 'Pavlova' AND 'Tofu';

SELECT * FROM orders
WHERE order_date BETWEEN '2023-04-12' AND '2023-05-05';

-- AS
SELECT customer_id AS id
FROM customers;

-- AS is optional
SELECT customer_id id
FROM customers;

SELECT product_name || unit AS product
FROM products; -- concatenate

SELECT product_name AS "My Great Products"
FROM products; -- using alias with spaces
```

### JOIN

Here are the different types of the Joins in PostgreSQL:

- INNER JOIN: Returns records that have matching values in both tables
- LEFT JOIN: Returns all records from the left table, and the matched records from the right table
- RIGHT JOIN: Returns all records from the right table, and the matched records from the left table
- FULL JOIN: Returns all records when there is a match in either left or right table

```sql
-- JOIN
SELECT product_id, product_name, category_name
FROM products
INNER JOIN categories ON products.category_id = categories.category_id;

SELECT testproduct_id, product_name, category_name
FROM testproducts
LEFT JOIN categories ON testproducts.category_id = categories.category_id;

SELECT testproduct_id, product_name, category_name
FROM testproducts
RIGHT JOIN categories ON testproducts.category_id = categories.category_id;

SELECT testproduct_id, product_name, category_name
FROM testproducts
FULL JOIN categories ON testproducts.category_id = categories.category_id;

-- CROSS JOIN
SELECT testproduct_id, product_name, category_name
FROM testproducts
CROSS JOIN categories;
```

### UNION

The UNION operator is used to combine the result-set of two or more queries.

The queries in the union must follow these rules:

- They must have the same number of columns
- The columns must have the same data types
- The columns must be in the same order

```sql
SELECT product_id, product_name
FROM products
UNION
SELECT testproduct_id, product_name
FROM testproducts
ORDER BY product_id;

-- UNION ALL
SELECT product_id
FROM products
UNION ALL
SELECT testproduct_id
FROM testproducts
ORDER BY product_id;
```

### GROUP BY

```sql
SELECT COUNT(customer_id), country
FROM customers
GROUP BY country;

SELECT customers.customer_name, COUNT(orders.order_id)
FROM orders
LEFT JOIN customers ON orders.customer_id = customers.customer_id
GROUP BY customer_name;
```

### HAVING

The HAVING clause was added to SQL because the WHERE clause cannot be used with aggregate functions.

Aggregate functions are often used with GROUP BY clauses, and by adding HAVING we can write condition like we do with WHERE clauses.

```sql
SELECT COUNT(customer_id), country
FROM customers
GROUP BY country
HAVING COUNT(customer_id) > 5;

SELECT order_details.order_id, SUM(products.price)
FROM order_details
LEFT JOIN products ON order_details.product_id = products.product_id
GROUP BY order_id
HAVING SUM(products.price) > 400.00;

SELECT customers.customer_name, SUM(products.price)
FROM order_details
LEFT JOIN products ON order_details.product_id = products.product_id
LEFT JOIN orders ON order_details.order_id = orders.order_id
LEFT JOIN customers ON orders.customer_id = customers.customer_id
GROUP BY customer_name
HAVING SUM(products.price) > 1000.00;
```

### EXISTS

The EXISTS operator is used to test for the existence of any record in a sub query.

```sql
SELECT customers.customer_name
FROM customers
WHERE EXISTS (
  SELECT order_id
  FROM orders
  WHERE customer_id = customers.customer_id
);
```

### NOT EXISTS

To check which customers that do not have any orders, we can use the NOT operator together with the EXISTS operator :

```sql
SELECT customers.customer_name
FROM customers
WHERE NOT EXISTS (
  SELECT order_id
  FROM orders
  WHERE customer_id = customers.customer_id
);
```

### ANY

The ANY operator allows you to perform a comparison between a single column value and a range of other values.

The ANY operator:

- returns a Boolean value as a result
- returns TRUE if ANY of the sub query values meet the condition

ANY means that the condition will be true if the operation is true for any of the values in the range.

```sql
SELECT product_name
FROM products
WHERE product_id = ANY (
  SELECT product_id
  FROM order_details
  WHERE quantity > 120
);
```

### ALL

The ALL operator:

- returns a Boolean value as a result
- returns TRUE if ALL of the sub query values meet the condition
- is used with SELECT, WHERE and HAVING statements

ALL means that the condition will be true only if the operation is true for all values in the range.

```sql
SELECT product_name
FROM products
WHERE product_id = ALL (
  SELECT product_id
  FROM order_details
  WHERE quantity > 10
);
```

### CASE

The CASE expression goes through conditions and returns a value when the first condition is met (like an if-then-else statement).

Once a condition is true, it will stop reading and return the result. If no conditions are true, it returns the value in the ELSE clause.

If there is no ELSE part and no conditions are true, it returns NULL.

```sql
SELECT product_name,
CASE
  WHEN price < 10 THEN 'Low price product'
  WHEN price > 50 THEN 'High price product'
ELSE
  'Normal product'
END
FROM products;

-- When a column name is not specified for the "case" field, the parser uses case as the column name.
SELECT product_name,
CASE
  WHEN price < 10 THEN 'Low price product'
  WHEN price > 50 THEN 'High price product'
ELSE
  'Normal product'
END AS "price category"
FROM products;
```

## PostgreSQL Data Types

### Boolean

| True   | False   |
| ------ | ------- |
| true   | false   |
| ‘t’    | ‘f ‘    |
| ‘true’ | ‘false’ |
| ‘y’    | ‘n’     |
| ‘yes’  | ‘no’    |
| ‘1’    | ‘0’     |

```sql
CREATE TABLE stock_availability (
   product_id INT PRIMARY KEY,
   available BOOLEAN NOT NULL
);
```

### CHAR, VARCHAR, TEXT

```sql
CREATE TABLE character_tests (
  id serial PRIMARY KEY,
  x CHAR (1),
  y VARCHAR (10),
  z TEXT
);
```

### NUMERIC

The NUMERIC type can store numbers with a lot of digits. Typically, you use the NUMERIC type for storing numbers that require exactness such as monetary amounts or quantities.

The NUMERIC type can hold a value of up to 131,072 digits before the decimal point 16,383 digits after the decimal point.

If you omit precision and scale, they will default to 131072 and 16383, respectively.

```sql
column_name NUMERIC(precision, scale) -- OR
column_name DECIMAL(p,s) -- OR
column_name DEC(p,s)
```

Special values

Besides the ordinal numeric values, the numeric type has several special values:

- Infinity
- -Infinity
- NaN

```sql
UPDATE products
SET price = 'NaN'
WHERE id = 1;
```

In PostgreSQL, two NaN values are equal. Also, NaN values are greater than regular numbers such as 1, 2, 3. This implementation allows PostgreSQL to sort NUMERIC values and use them in tree-based indexes.

```sql
SELECT * FROM products
ORDER BY price DESC;

-- id  |  name  | price
-- ----+--------+--------
--   1 | Phone  |    NaN
--   2 | Tablet | 500.21
```

### DOUBLE PRECISION

In PostgreSQL, the DOUBLE PRECISION is an inexact, variable-precision numeric type.

Inexact means that PostgreSQL cannot exactly convert some values into an internal format and can only store them as approximations. Consequently, storing and querying a value might show a slight difference.

If your application requires exact storage and calculation, it’s recommended to use the numeric type instead.

A column of DOUBLE PRECISION type can store values that have a range around 1E-307 to 1E+308 with a precision of at least 15 digits.

```sql
CREATE TABLE temperatures (
    id SERIAL PRIMARY KEY,
    location TEXT NOT NULL,
    temperature DOUBLE PRECISION
);

-- DOUBLE PRECISION, FLOAT8, or FLOAT are synonyms.
```

### REAL

The REAL data type allows you to store single-precision floating-point numbers in the database.

A value of the real type takes 4 bytes of storage space. Its valid range is from -3.40282347 × 1E38 to 3.40282347 × 1E38. Typically, you use the REAL data type to store floating-point numbers with relatively large ranges and precision is not critical, or when you are concerned about the storage space.

However, you can use the double precision data type if you need higher precision.

```sql
CREATE TABLE weathers(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    location VARCHAR(255) NOT NULL,
    wind_speed_mps REAL NOT NULL,
    temperature_celsius REAL NOT NULL,
    recorded_at TIMESTAMP NOT NULL
);
```

### INT

| Name     | Storage Size | Min                        | Max                        |
| -------- | ------------ | -------------------------- | -------------------------- |
| SMALLINT | 2 bytes      | -32,768                    | +32,767                    |
| INTEGER  | 4 bytes      | -2,147,483,648             | +2,147,483,647             |
| BIGINT   | 8 bytes      | -9,223,372,036,854,775,808 | +9,223,372,036,854,775,807 |

```sql
CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR (255) NOT NULL,
    pages SMALLINT NOT NULL CHECK (pages > 0)
);

CREATE TABLE cities (
    city_id serial PRIMARY KEY,
    city_name VARCHAR (255) NOT NULL,
    population INT NOT NULL CHECK (population >= 0)
);
```

Using BIGINT type is not only consuming a lot of storage but also decreasing the performance of the database, therefore, you should have a good reason to use it.

### SERIAL

In PostgreSQL, a sequence is a special kind of database object that generates a sequence of integers. A sequence is often used as the primary key column in a table.

```sql
CREATE TABLE table_name(
    id SERIAL
);
-- is equivalent to the following statements:

CREATE SEQUENCE table_name_id_seq;
CREATE TABLE table_name (
    id integer NOT NULL DEFAULT nextval('table_name_id_seq')
);
ALTER SEQUENCE table_name_id_seq
OWNED BY table_name.id;
```

| Name        | Storage Size | Range                          |
| ----------- | ------------ | ------------------------------ |
| SMALLSERIAL | 2 bytes      | 1 to 32,767                    |
| SERIAL      | 4 bytes      | 1 to 2,147,483,647             |
| BIGSERIAL   | 8 bytes      | 1 to 9,223,372,036,854,775,807 |

```sql
CREATE TABLE fruits(
   id SERIAL PRIMARY KEY,
   name VARCHAR NOT NULL
);

INSERT INTO fruits(name)
VALUES('Orange');

INSERT INTO fruits(id,name)
VALUES(DEFAULT,'Apple');

-- get the sequence name
pg_get_serial_sequence('table_name','column_name')

-- recent value generated
SELECT currval(pg_get_serial_sequence('fruits', 'id'));

-- retrieving the generated value on insertion
INSERT INTO fruits(name)
VALUES('Banana')
RETURNING id;

-- adding serial to existing table
ALTER TABLE baskets
ADD COLUMN id SERIAL PRIMARY KEY;

-- command to get description of a table
\d table_name
```

### DATE

PostgreSQL offers the DATE data type that allows you to store date data.

PostgreSQL uses 4 bytes to store a date value. The lowest and highest values of the DATE data type are 4713 BC and 5874897 AD, respectively.

When storing a date value, PostgreSQL uses the yyyy-mm-dd format such as 2000-12-31. It also uses the same format for inserting data into a DATE column.

```sql
CREATE TABLE documents (
  document_id SERIAL PRIMARY KEY,
  header_text VARCHAR (255) NOT NULL,
  posting_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- returns the inserted record
INSERT INTO documents (header_text)
VALUES ('Billing to customer XYZ')
RETURNING *;

-- get current date
SELECT NOW();

-- now
-- -------------------------------
--  2024-02-01 08:48:09.599933+07

-- date only
SELECT NOW()::date;
-- 2024-02-01

SELECT CURRENT_DATE;
-- 2024-02-01

-- Output a PostgreSQL date value in a specific format
SELECT TO_CHAR(CURRENT_DATE, 'dd/mm/yyyy');
-- 01/02/2024

SELECT TO_CHAR(CURRENT_DATE, 'Mon dd, yyyy');
-- Feb 01, 2024

-- Get the interval between two dates
SELECT
  first_name,
  last_name,
  now() - hire_date as diff
FROM
  employees;

-- first_name | last_name |           diff
-- ------------+-----------+---------------------------
--  Shannon    | Freeman   | 6970 days 08:51:20.824847
--  Sheila     | Wells     | 7701 days 08:51:20.824847
--  Ethel      | Webb      | 8431 days 08:51:20.824847

-- Calculate ages in years, months, and days


SELECT
    employee_id,
    first_name,
    last_name,
    AGE(birth_date)
FROM
    employees;

-- employee_id | first_name | last_name |           age
-- -------------+------------+-----------+--------------------------
--            1 | Shannon    | Freeman   | 44 years 1 mon
--            2 | Sheila     | Wells     | 45 years 11 mons 24 days
--            3 | Ethel      | Webb      | 49 years 1 mon

-- Extract year, quarter, month, week, and day from a date value
SELECT
    employee_id,
    first_name,
    last_name,
    EXTRACT (YEAR FROM birth_date) AS YEAR,
    EXTRACT (MONTH FROM birth_date) AS MONTH,
    EXTRACT (DAY FROM birth_date) AS DAY
FROM
    employees;

-- employee_id | first_name | last_name | year | month | day
-- -------------+------------+-----------+------+-------+-----
--            1 | Shannon    | Freeman   | 1980 |     1 |   1
--            2 | Sheila     | Wells     | 1978 |     2 |   5
--            3 | Ethel      | Webb      | 1975 |     1 |   1
```

### TIMESTAMP

PostgreSQL provides you with two temporal data types for handling timestamps:

- `timestamp`: a timestamp without a timezone one.
- `timestamptz`: timestamp with a timezone.

The `timestamp` datatype allows you to store both date and time. However, it does not have any time zone data. It means that when you change the timezone of your database server, the `timestamp` value stored in the database will not change automatically.

The `timestamptz` datatype is the `timestamp` with a timezone. The `timestamptz` data type is a time zone-aware date and time data type.

Internally, PostgreSQL stores the `timestamptz` in UTC value.

When you insert a value into a `timestamptz` column, PostgreSQL converts the `timestamptz` value into a UTC value and stores the UTC value in the table.
When you retrieve data from a `timestamptz` column, PostgreSQL converts the UTC value back to the time value of the timezone set by the database server, the user, or the current database connection.
Notice that both `timestamp` and `timestamptz` uses 8 bytes for storing the timestamp values as shown in the following query:

```sql
CREATE TABLE timestamp_demo (
    ts TIMESTAMP,
    tstz TIMESTAMPTZ
);

SET timezone = 'America/Los_Angeles';

SHOW TIMEZONE;
--  America/Los_Angeles

INSERT INTO timestamp_demo (ts, tstz)
VALUES('2016-06-22 19:10:25-07','2016-06-22 19:10:25-07');

SELECT
   ts, tstz
FROM
   timestamp_demo;

--    ts                 |          tstz
-- ---------------------+------------------------
--  2016-06-22 19:10:25 | 2016-06-22 19:10:25-07

SET timezone = 'America/New_York';

SELECT
  ts,
  tstz
FROM
  timestamp_demo;

-- ts                    |          tstz
-- ---------------------+------------------------
--  2016-06-22 19:10:25 | 2016-06-22 22:10:25-04

-- get current timestamp
SELECT NOW();
SELECT CURRENT_TIMESTAMP;
--  2024-01-31 21:02:04.715486-05

SELECT CURRENT_TIME;
--  21:02:13.648512-05

SELECT TIMEOFDAY();
--  Wed Jan 31 21:02:20.840159 2024 EST

-- convert from CURRENT TIMEZONE to another timezone
SELECT timezone('America/Los_Angeles','2016-06-01 00:00');
-- 2016-05-31 21:00:00

-- better approach
SELECT timezone('America/Los_Angeles','2016-06-01 00:00'::timestamptz);
--  2016-05-31 21:00:00

-- default values
CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

### INTERNAL

The interval data type allows you to store and manipulate a period in years, months, days, hours, minutes, and seconds.

```sql
@ interval [ fields ] [ (p) ]
```

An interval value requires 16 bytes of storage that can store a period with the allowed range from -178,000,000 years to 178,000,000 years.

Additionally, an interval value can have an optional precision value p with the permitted range from 0 to 6. The precision p is the number of fraction digits retained in the second field.

The at sign ( @) is optional so you can omit it.

The following examples show some interval values:

```sql
interval '2 months ago';
interval '3 hours 20 minutes';
```

```sql
SELECT
    now(),
    now() - INTERVAL '1 year 3 hours 20 minutes'
             AS "3 hours 20 minutes ago of last year";

-- now              | 3 hours 20 minutes ago of last year
-- -------------------------------+-------------------------------------
--  2024-01-31 21:34:52.242914-05 | 2023-01-31 18:14:52.242914-05
```

#### PostgreSQL interval input format

PostgreSQL provides you with the following verbose syntax to write the interval values:

```sql
quantity unit [quantity unit...] [direction]
```

quantity is a number, sign + or - is also accepted

unit can be any of millennium, century, decade, year, month, week, day, hour, minute, second, millisecond, microsecond, or abbreviation (y, m, d, etc.,) or plural forms (months, days, etc.).

direction can be ago or empty string ''

This format is called `postgres_verbose` which is also used for the interval output format. The following examples illustrate some interval values that use the verbose syntax:

```sql
INTERVAL '1 year 2 months 3 days';
INTERVAL '2 weeks ago';
```

#### Using INTERVAL in Tables

```sql
CREATE TABLE event (
    id SERIAL PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    duration INTERVAL NOT NULL
);
-- id | event_name | duration
-- ----+------------+----------
--   1 | pgConf     | PT1H30M
--   2 | pgDAY      | P2DT5H

SELECT
    event_name,
    duration,
    EXTRACT(DAY FROM duration) AS days,
    EXTRACT(HOUR FROM duration) AS hours,
    EXTRACT(MINUTE FROM duration) AS minutes
FROM event;
-- event_name | duration | days | hours | minutes
-- ------------+----------+------+-------+---------
--  pgConf     | PT1H30M  |    0 |     1 |      30
--  pgDAY      | P2DT5H   |    2 |     5 |       0
```

Interval is discussed in [details here](https://neon.com/postgresql/postgresql-tutorial/postgresql-interval)

### TIME

```sql
-- syntax
column_name TIME(precision);

-- In this syntax, the precision specifies the fractional seconds precision for the time value, which ranges from 1 to 6.
```

The TIME data type requires 8 bytes and its allowed range is from 00:00:00 to 24:00:00.

The following illustrates the common formats of the TIME values:

```sql
HH:MI
HH:MI:SS
HHMISS
```

```sql
CREATE TABLE shifts (
    id serial PRIMARY KEY,
    shift_name VARCHAR NOT NULL,
    start_at TIME NOT NULL,
    end_at TIME NOT NULL
);

INSERT INTO shifts(shift_name, start_at, end_at)
VALUES('Morning', '08:00:00', '12:00:00'),
      ('Afternoon', '13:00:00', '17:00:00'),
      ('Night', '18:00:00', '22:00:00');

SELECT * FROM shifts;
-- id | shift_name | start_at |  end_at
-- ----+------------+----------+----------
--   1 | Morning    | 08:00:00 | 12:00:00
--   2 | Afternoon  | 13:00:00 | 17:00:00
--   3 | Night      | 18:00:00 | 22:00:00
```

#### Time with Time Zone

```sql
-- Time with time zone
column TIME WITH TIME ZONE
```

When dealing with timezone, it is recommended to use TIMESTAMP instead of the TIME WITH TIME ZONE type. This is because the time zone has very little meaning unless it is associated with both date and time.

```sql
SELECT CURRENT_TIME; -- time with zone (full precision)
-- timetz
-- --------------
--  00:51:02.746572-08

SELECT CURRENT_TIME(5); -- time with precision
-- 00:52:12.19515-08

SELECT LOCALTIME;
-- 00:52:40.227186
SELECT LOCALTIME(0); -- with precision
-- 00:56:08

-- converting of zones
SELECT LOCALTIME AT TIME ZONE 'UTC-7';
-- 16:02:38.902271+07

-- Extracting hours, minutes, and seconds from a time value

-- syntax
EXTRACT(field FROM time_value);

SELECT
    LOCALTIME,
    EXTRACT (HOUR FROM LOCALTIME) as hour,
    EXTRACT (MINUTE FROM LOCALTIME) as minute,
    EXTRACT (SECOND FROM LOCALTIME) as second,
    EXTRACT (milliseconds FROM LOCALTIME) as milliseconds;


-- Arithmetic operations on time values
SELECT time '10:00' - time '02:00' AS result;
-- 08:00:00

SELECT LOCALTIME + interval '2 hours' AS result;
-- 03:16:18.020418
```

### UUID

A UUID is a sequence of 32 digits of hexadecimal digits represented in groups separated by hyphens.

Because of its uniqueness feature, you often find UUID in distributed systems because it guarantees a better uniqueness than the SERIAL data type which generates unique values within a single database.

To store UUID values in the PostgreSQL database, you use the UUID data type.

```sql
-- generate uuid
SELECT gen_random_uuid();
-- d6eb621f-6dd0-4cdc-93f5-07f51b249b51

-- CREATE TABLE
CREATE TABLE contacts (
    contact_id uuid DEFAULT gen_random_uuid(),
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    phone VARCHAR,
    PRIMARY KEY (contact_id)
);
```

### JSON

```sql
CREATE TABLE products(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    properties JSONB
);

INSERT INTO products(name, properties)
VALUES('Ink Fusion T-Shirt','{"color": "white", "size": ["S","M","L","XL"]}')
RETURNING *;

-- id |        name        |                    properties
-- ----+--------------------+---------------------------------------------------
--   1 | Ink Fusion T-Shirt | {"size": ["S", "M", "L", "XL"], "color": "white"}

SELECT
  id,
  name,
  properties -> 'color' color
FROM
  products;

--   id |         name          |  color
-- ----+-----------------------+---------
--   1 | Ink Fusion T-Shirt    | "white"
--   2 | ThreadVerse T-Shirt   | "black"
--   3 | Design Dynamo T-Shirt | "blue"

-- To extract a JSON object field by a key as text, you can use the ->> operator. For example:

SELECT
  id,
  name,
  properties ->> 'color' color
FROM
  products;

--   id |         name          | color
-- ----+-----------------------+-------
--   1 | Ink Fusion T-Shirt    | white
--   2 | ThreadVerse T-Shirt   | black
--   3 | Design Dynamo T-Shirt | blue

SELECT
  id,
  name,
  properties ->> 'color' color
FROM
  products
WHERE
  properties ->> 'color' IN ('black', 'white');

--   id |        name         | color
-- ----+---------------------+-------
--   1 | Ink Fusion T-Shirt  | white
--   2 | ThreadVerse T-Shirt | black
```

### ARRAY

```sql
-- syntax
column_name datatype []     -- 1D
column_name data_type [][]  -- 2D

CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR (100),
  phones TEXT []
);

INSERT INTO contacts (name, phones)
VALUES('John Doe',ARRAY [ '(408)-589-5846','(408)-589-5555' ]);
--          OR
INSERT INTO contacts (name, phones)
VALUES('Lily Bush','{"(408)-589-5841"}'),
      ('William Gate','{"(408)-589-5842","(408)-589-58423"}');
-- Notice that when using curly braces, you use single quotes ' to wrap the array and double-quotes " to wrap text array items.

SELECT
  name,
  phones
FROM
  contacts;

-- name     |              phones
-- --------------+----------------------------------
--  John Doe     | {(408)-589-5846,(408)-589-5555}
--  Lily Bush    | {(408)-589-5841}
--  William Gate | {(408)-589-5842,(408)-589-58423}

-- INDEXING (1 based indexing)
SELECT
  name,
  phones [ 1 ]
FROM
  contacts;

-- name     |     phones
-- --------------+----------------
--  John Doe     | (408)-589-5846
--  Lily Bush    | (408)-589-5841
--  William Gate | (408)-589-5842

UPDATE contacts
SET phones [2] = '(408)-589-5843'
WHERE ID = 3
RETURNING *;

-- update whole array
UPDATE
  contacts
SET
  phones = '{"(408)-589-5843"}'
WHERE
  id = 3
RETURNING *;

-- searching
SELECT
  name,
  phones
FROM
  contacts
WHERE
  '(408)-589-5555' = ANY (phones);

-- name   |             phones
-- ----------+---------------------------------
--  John Doe | {(408)-589-5846,(408)-589-5555}

-- Expanding Arrays
-- PostgreSQL provides the unnest() function to expand an array to a list of rows. For example, the following query expands all phone numbers of the phones array.

SELECT
  name,
  unnest(phones)
FROM
  contacts;

-- name     |     unnest
-- --------------+----------------
--  John Doe     | (408)-589-5846
--  John Doe     | (408)-589-5555
--  Lily Bush    | (408)-589-5841
--  William Gate | (408)-589-5843
```

### HSTORE

The hstore module implements the hstore data type for storing key-value pairs in a single value. The keys and values are text strings only.

In practice, you can find the hstore data type useful in some cases, such as semi-structured data or rows with many attributes that are rarely queried.

```sql
-- HSTORE EXTENSION needs to be enabled first
CREATE EXTENSION hstore;

CREATE TABLE books (
    id serial primary key,
    title VARCHAR (255),
    attr hstore
);

INSERT INTO books (title, attr)
VALUES
  (
    'PostgreSQL Tutorial', '"paperback" => "243",
    "publisher" => "postgresqltutorial.com",
    "language"  => "English",
    "ISBN-13"   => "978-1449370000",
    "weight"    => "11.2 ounces"'
  ),
  (
    'PostgreSQL Cheat Sheet', '
    "paperback" => "5",
    "publisher" => "postgresqltutorial.com",
    "language"  => "English",
    "ISBN-13"   => "978-1449370001",
    "weight"    => "1 ounces"'
  );

SELECT * FROM books;
```

| id  | title                  | attr                                                                                                                                                     |
| --- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | PostgreSQL Tutorial    | "weight"=>"11.2 ounces", "ISBN-13"=>"978-1449370000", "language"=>"English", "paperback"= "243", "publisher"=>"postgresqltutorial.com"                   |
| 2   | PostgreSQL Cheat Sheat | "genre"=>"Technology", "weight"=>"1 ounces", "ISBN-13"=>"978-1449370001", "language"=>"English", "paperback"=>"5", "publisher"=>"postgresqltutorial.com" |

```sql
SELECT
    title, attr -> 'weight' AS weight
FROM
    books
WHERE
    attr -> 'ISBN-13' = '978-1449370000';

-- add another pair
UPDATE books
SET attr = attr || '"freeshipping"=>"yes"' :: hstore;

-- update existing pair
UPDATE books
SET attr = attr || '"freeshipping"=>"no"' :: hstore;

-- remove existing pair
UPDATE books
SET attr = delete(attr, 'freeshipping');

-- check if specific key is present
SELECT
  title,
  attr->'publisher' as publisher,
  attr
FROM
    books
WHERE
    attr ? 'publisher';

-- check if a key-value pair is present
SELECT
    title
FROM
    books
WHERE
    attr @> '"weight"=>"11.2 ounces"' :: hstore;

-- check the presence of multiple keys
SELECT
    title
FROM
    books
WHERE
    attr ?& ARRAY [ 'language', 'weight' ];

-- get all the keys of an hstore
SELECT akeys (attr) FROM books; -- array
SELECT skeys (attr) FROM books; -- set

-- get all the values of an hstore
SELECT avals (attr) FROM books;
SELECT svals (attr) FROM books;

-- hstore to JSON
SELECT
  title,
  hstore_to_json (attr) json
FROM
  books;
--          title          |                                     json
-- ------------------------+-----------------------------------------------------------------------
--  PostgreSQL Tutorial    | {"weight": "11.2 ounces", "ISBN-13": "978-1449370000", "language": "English", "paperback": "243", "publisher": "postgresqltutorial.com"}
--  PostgreSQL Cheat Sheat | {"genre": "Technology", "weight": "1 ounces", "ISBN-13": "978-1449370001", "language": "English", "paperback": "5", "publisher": "postgresqltutorial.com"}


-- hstore to sets
SELECT
    title,
    (EACH(attr) ).*
FROM
    books;

--          title          |    key    |         value
-- ------------------------+-----------+------------------------
--  PostgreSQL Tutorial    | weight    | 11.2 ounces
--  PostgreSQL Tutorial    | ISBN-13   | 978-1449370000
--  PostgreSQL Tutorial    | language  | English
--  PostgreSQL Tutorial    | paperback | 243
--  PostgreSQL Tutorial    | publisher | postgresqltutorial.com
--  PostgreSQL Cheat Sheat | genre     | Technology
--  PostgreSQL Cheat Sheat | weight    | 1 ounces
--  PostgreSQL Cheat Sheat | ISBN-13   | 978-1449370001
--  PostgreSQL Cheat Sheat | language  | English
--  PostgreSQL Cheat Sheat | paperback | 5
--  PostgreSQL Cheat Sheat | publisher | postgresqltutorial.com
```

### ENUM

```sql
-- syntax
CREATE TYPE enum_name
AS
ENUM('value1', 'value2', 'value3', ...);

CREATE TYPE priority AS ENUM('low','medium','high');
CREATE TABLE requests(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    priority PRIORITY NOT NULL,
    request_date DATE NOT NULL
);

INSERT INTO requests(title, priority, request_date)
VALUES
   ('Create an enum tutorial in PostgreSQL', 'high', '2019-01-01'),
   ('Review the enum tutorial', 'medium', '2019-01-01'),
   ('Publish the PostgreSQL enum tutorial', 'low', '2019-01-01')
RETURNING *;
-- id |                 title                 | priority | request_date
-- ----+---------------------------------------+----------+--------------
--   1 | Create an enum tutorial in PostgreSQL | high     | 2019-01-01
--   2 | Review the enum tutorial              | medium   | 2019-01-01
--   3 | Publish the PostgreSQL enum tutorial  | low      | 2019-01-01


-- The ordering of values in an enum is the order in which you list them when you define the enum.
SELECT *
FROM requests
ORDER BY priority;
-- id |                 title                 | priority | request_date
-- ----+---------------------------------------+----------+--------------
--   3 | Publish the PostgreSQL enum tutorial  | low      | 2019-01-01
--   2 | Review the enum tutorial              | medium   | 2019-01-01
--   1 | Create an enum tutorial in PostgreSQL | high     | 2019-01-01


-- add new value into an existing ENUM
-- syntax
ALTER TYPE enum_name
ADD VALUE [IF NOT EXISTS] 'new_value'
[{BEFORE | AFTER }] 'existing_enum_value';

ALTER TYPE priority
ADD VALUE 'urgent';


-- retrieve enum values
SELECT enum_range(null::priority);
-- {low,medium,high,urgent}


-- renaming enum values
-- syntax
ALTER TYPE enum_name
RENAME VALUE existing_enum_value TO new_enum_value;

ALTER TYPE priority
RENAME VALUE 'urgent' TO 'very high';
```

### User Defined Data Types

Besides built-in data types, PostgreSQL allows you to create user-defined data types through the following statements:

- `CREATE DOMAIN` creates a user-defined data type with constraints such as NOT NULL, CHECK, etc.

- `CREATE TYPE` creates a composite type used in stored procedures as the data types of returned values.

```sql
CREATE DOMAIN age AS
   INT NOT NULL CHECK (value >= 18);

CREATE TYPE film_summary AS (
    film_id INT,
    title VARCHAR,
    release_year SMALLINT
);
```

### XML

```sql
CREATE TABLE person(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    info XML
);

INSERT INTO person (info)
VALUES (
    XMLPARSE(DOCUMENT '<?xml version="1.0" encoding="UTF-8"?>
    <person>
        <name>John Doe</name>
        <age>35</age>
        <city>San Francisco</city>
    </person>')
);
-- XMLPARSE function converts the string into an XML document.
-- DOCUMENT indicates that the input string is a complete XML document starting with the XML declaration <?xml version="1.0" encoding="UTF-8"?> and having the root element <person>

SELECT xpath('/person/name/text()', info) AS name
FROM person;
--  {"John Doe"}
-- Each row in the result set is an array of XML values representing person names. Since each person has one name, the result array has only one element.

SELECT (xpath('/person/name/text()', info))[1]::text AS name
FROM person;
-- John Doe

SELECT (xpath('/person/age/text()', info))[1]::text::integer AS age
FROM person;
-- 35

SELECT
    (xpath('/person/name/text()', info))[1]::text AS name,
    (xpath('/person/age/text()', info))[1]::text::integer AS age,
    (xpath('/person/city/text()', info))[1]::text AS city
FROM
    person;
-- name      | age |     city
-- ---------------+-----+---------------
--  John Doe      |  35 | San Francisco

SELECT *
FROM person
WHERE (xpath('/person/name/text()', info))[1]::text = 'Jane Doe';
-- id |                info
-- ----+------------------------------------
--   2 |     <person>                      +
--     |         <name>Jane Doe</name>     +
--     |         <age>30</age>             +
--     |         <city>San Francisco</city>+
--     |     </person>


-- adding index on person/name for fast searching
CREATE INDEX person_name
ON person USING BTREE
    (cast(xpath('/person/name', info) as text[])) ;
```

### BYTEA - Byte Array

In PostgreSQL, BYTEA is a binary data type that you can use to store binary strings or byte sequences. BYTEA stands for the binary array.

The maximum size of a BYTEA column is 1GB. It means you can only store binary data up to 1GB in a single BYTEA column. However, storing a large amount of binary data in a BYTEA column is not efficient

```sql
CREATE TABLE binary_data(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    data BYTEA
);

INSERT INTO binary_data(data)
VALUES ('\x012345');

SELECT * FROM binary_data;

-- id |   data
-- ----+----------
--   1 | \x012345
```

## Composite type

In PostgreSQL, composite types allow you to define custom data types with multiple fields. These fields can be any built-in or user-defined types, including other composite types.

```sql
CREATE TYPE address_type AS(
   street text,
   city text,
   state text,
   zip_code integer,
   country text
);

CREATE TABLE contacts(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address address_type
);

INSERT INTO contacts (name, address)
VALUES (
    'John Smith',
    ROW('123 St', 'Houston', 'TX', 77001, 'USA')
);
-- ROW keyword is optional

INSERT INTO contacts (
    name,
    address.street,
    address.city,
    address.state,
    address.zip_code
  )
VALUES
  ('Jane Doe', '4000 N. 1st Street', 'San Jose', 'CA', 95134);

SELECT * FROM contacts;

-- id |    name    |                   address
-- ----+------------+---------------------------------------------
--   1 | John Smith | ("123 St",Houston,TX,77001,USA)
--   2 | Jane Doe   | ("4000 N. 1st Street","San Jose",CA,95134,)


SELECT
  id,
  name,
  (address).city,
  (address).state,
  (address).zip_code
FROM
  contacts;

-- id |    name    |   city   | state | zip_code
-- ----+------------+----------+-------+----------
--   1 | John Smith | Houston  | TX    |    77001
--   2 | Jane Doe   | San Jose | CA    |    95134

SELECT
  id,
  name,
  (address).*
FROM
  contacts;
-- id |    name    |       street       |   city   | state | zip_code | country
-- ----+------------+--------------------+----------+-------+----------+---------
--   1 | John Smith | 123 St             | Houston  | TX    |    77001 | USA
--   2 | Jane Doe   | 4000 N. 1st Street | San Jose | CA    |    95134 | null

-- updating composite type
UPDATE contacts
SET
  address.country= 'USA'
WHERE
  id = 2
RETURNING *;
-- id |   name   |                    address
-- ----+----------+------------------------------------------------
--   2 | Jane Doe | ("4000 N. 1st Street","San Jose",CA,95134,USA)
```

## More resources

- <https://neon.com/postgresql/tutorial>
- <https://neon.com/postgresql/postgresql-getting-started>
