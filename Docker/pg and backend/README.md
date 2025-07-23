# Volumes and Networks

## Without ENV

The main file in here is `index.js`

```javascript
// index.js
const sql = postgres({
  host: "pg5",
  port: "5432",
  username: "postgres",
  database: "postgres",
  password: "root",
});
```

```json
// package.json
// ...
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
// ...
```

```sh
# create a volume
docker volume create postgres_volume

docker network create pg_backend_network

docker images
# REPOSITORY   TAG              IMAGE ID       CREATED        SIZE
# test-app     latest           c1f7b463949e   15 hours ago   245MB
# postgres     14.18-bullseye   230c8fb46b44   6 weeks ago    588MB

docker run -p 5555:5432 -v postgres_volume:/var/lib/postgresql/data --name pg5 --network pg_backend_network 230c8fb46b44

# all-in-one-learning-content/Docker/pg and docker
docker build -t backend_with_pg .
docker run -p 3000:3000 --network pg_backend_network backend_with_pg
```

## With ENV

```javascript
// index_with_env.js
const sql = postgres({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  username: process.env.PG_USERNAME,
  database: process.env.PG_DB_NAME,
  password: process.env.PG_PASSWORD,
});
```

```json
// package.json
// ...
  "main": "index_with_env.js",
  "scripts": {
    "start": "node index_with_env.js"
  },
// ...
```

```sh
# ENV can be passed on command line as well, while running locally
PG_HOST=localhost PG_PORT=5555 PG_USERNAME=postgres PG_DB_NAME=postgres PG_PASSWORD=root npm run start
```

using docker

```sh
docker build -t backend_with_pg .

docker run -p 3000:3000 -e PG_HOST=pg5 -e PG_PORT=5432 -e PG_USERNAME=postgres -e PG_DB_NAME=postgres -e PG_PASSWORD=root  --network pg_backend_
network backend_with_pg
```

## Aggregate everything in a compose file

```yaml
services:
  pg5:
    image: postgres:14.18-bullseye
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_volume:/var/lib/postgresql/data
    ports:
      - "5555:5432" # Simply so I can use pgAdmin on my local machine to get access to the database

  app:
    build:
      context: .
      dockerfile: Dockerfile

    env_file:
      - "$PWD/.env"

    ports:
      - "3000:3000"

    depends_on:
      - pg5

volumes:
  postgres_volume:
```

```sh
docker-compose up # is all what you need
```
