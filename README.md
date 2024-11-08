# Secutech

## Prerequisites

- Docker
- Yarn

## Getting Started

1. **Clone the Repository:**

   Clone the repository to your local machine.

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies:**

   Install the project dependencies using Yarn.

   ```bash
   yarn
   ```

3. **Set Up Environment Variables:**

   Rename the `.env.example` file to `.env` and edit it to add your credentials:

   ```

    NEXTAUTH_URL=https://localhost:3000/api/auth/
    NEXT_PUBLIC_API_URL=https://localhost:3000/api
    NEXT_PUBLIC_NEXT_URL=https://localhost:3000/crm

    DATABASE_URL=mysql://root:root@localhost:3306/secu-tech

    EMAIL_SERVER_USER=<your smtp user>
    EMAIL_SERVER_PASSWORD=<your smtp password>
    EMAIL_SERVER_HOST=<your smtp host>
    EMAIL_SERVER_PORT=<your smtp port>
    EMAIL_FROM=<your email send>

    NEXTAUTH_SECRET=<your secret>

    ENCRYPTION_KEY=<your encryption key>
   ```

    add file `.env.local` :
    ```
    AUTH_SECRET="< auth secrect key >" # Added by `npx auth`. Read more: https://cli.authjs.dev
    ```

4. **Database Setup:**

   Set up a MySQL database using Docker.

   ```bash
   docker run --name secu-tech -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=secu-tech -p 3306:3306 -d mysql:latest
   ```

   Migrate and generate the database using Prisma.

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Generate SSL Certificates for HTTPS:**

   To run your Next.js application over HTTPS locally, generate self-signed SSL certificates using OpenSSL.

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

6. **Run the Project:**

   Start the project on the server.

   ```bash
   yarn run secutech
   ```

   Open [https://localhost:3000](https://localhost:3000) with your browser to view the website.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.