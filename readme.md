Step 1: Initialize project

mkdir real-estate
cd real-estate
npm init -y

Step 2: Install dependencies

npm install express connect-timeout express-rate-limit express-sanitizer helmet swagger-ui-express jsonwebtoken moment winston mysql2 nodemailer multiparty koi html-entities
npm install -D typescript ts-node-dev @types/node @types/express @types/connect-timeout @types/swagger-ui-express @types/jsonwebtoken @types/nodemailer @types/multiparty

Step 3: Create tsconfig.json

npx tsc --init

Update important options:

{
  "compilerOptions": {
    "module": "commonjs",
    "esModuleInterop": true,
    "target": "es2017",
    "moduleResolution": "node",
    "sourceMap": true,
    "outDir": "dist",
    "resolveJsonModule": true,
    "skipLibCheck": true
  },
  "lib": [
    "es2015",
    "ES2022"
  ],
  "include": [
    "src/*",
    "package.json"
  ],
  "exclude": [
    "nswag",
    "dist",
    "node_modules"
  ],
  "typescript.tsserver.experimental.enableProjectDiagnostics": true
}

Step 4: Project structure

node-ts-app/
│── src/
│   └── app.ts
│── dist/
│── package.json
│── tsconfig.json
