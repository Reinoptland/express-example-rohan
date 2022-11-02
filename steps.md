# Steps

1. [x] Create a database in the cloud (render.com)
2. [x] Install prisma: `npm install prisma`, `npx prisma init`
3. [x] Add .env to gitignore
4. [x] Define the Schema
5. Run migrations (create the tables) `npx prisma migrate dev`
6. Inspect the tables (using prisma studio -> GUI) `npx prisma studio`
7. [x] Insert some data (seeding)
8. Rewrite our express endpoints
