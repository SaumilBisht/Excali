# DOCKER STEPS
STEP 0: CLONE REPO git clone https://github.com/SaumilBisht/Excali cd Paytm-TurboRepo

STEP 1: CREATE NETWORK -> docker network create quickNetwork

STEP 2: RUN POSTGRES -> docker run -d --name my_postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres

STEP 3: BUILD IMAGES

-> docker build -t excali-fe -f docker/Dockerfile.fe .
-> docker build -t excali-be -f docker/Dockerfile.be .
-> docker build -t excali-ws -f docker/Dockerfile.ws .

STEP 4: RUN EACH CONTAINER

  1. fe:
    - docker run -d \   
      --name fe-qs \
      --network quickNetwork \
      -e DATABASE_URL=postgresql://postgres:postgres@postgres:5432/postgres \
      -p 3000:3000 \
      excali-fe
  
  You also have to migrate the database.
  docker exec -it frontend sh
  cd packages/db
  npx prisma migrate dev --name init
  exit

  2. be:
    - docker run -d --name be-qs --network quickNetwork -e DATABASE_URL=postgresql://postgres:postgres@postgres:5432/postgres -p 3001:3001 excali-be

  3. ws:
    - docker run -d --name ws-qs --network quickNetwork -e DATABASE_URL=postgresql://postgres:postgres@postgres:5432/postgres -p 8080:8080 excali-ws
