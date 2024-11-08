## Prerequisites

- Docker
- Yarn
  
## Getting Started

First, install the project depedencies:

```bash
yarn
```

Then, build the project:

```bash
yarn run build
```

Finally, run the project from the build:

```bash
yarn run start
```

Open [https://localhost:3000](https://localhost:3000) with your browser and you will see the website.

To make the project work, you need to have a MySQL database and renaming the `.env.example` file to `.env` and edit it to add your credentials:

```
NEXTAUTH_URL=https://localhost:3000/api/auth/

DATABASE_URL=mysql://root:root@localhost:3306/secu-tech

EMAIL_SERVER_USER=<your smtp user>
EMAIL_SERVER_PASSWORD=<your smtp password>
EMAIL_SERVER_HOST=<your smtp host>
EMAIL_SERVER_PORT=<your smtp port>
EMAIL_FROM=<your email send>

NEXTAUTH_SECRET=<your secret>

ENCRYPTION_KEY=<your encryption key>
```

## Database Setup

To set up a MySQL database using Docker, run the following command:

```bash
docker run --name secu-tech -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=secu-tech -p 3306:3306 -d mysql:latest
```

Then, if your database is working, you'll have to migrate and generate it using Prisma.
On a Terminal, run:

```bash
npx prisma migrate dev
npx prisma generate
```

## Generating SSL Certificates for HTTPS

To run your Next.js application over HTTPS locally, you need to generate self-signed SSL certificates. You can do this using OpenSSL with the following commands:

```bash
openssl genrsa -out key.pem 2048
```

```bash
openssl req -new -key key.pem -out csr.pem
```

```bash
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem
```

These commands will generate `key.pem` and `cert.pem` files in your current directory. Use these files to configure your server for HTTPS.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
