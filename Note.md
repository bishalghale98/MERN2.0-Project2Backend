# **TypeScript + Express Quick Setup Notes**

### **1. Initialize Project**

```bash
npm init -y
```

### **2. Install Dependencies**

```bash
npm install express
npm install --save-dev typescript @types/express @types/node nodemon ts-node
```

### **3. Set Up TypeScript**

```bash
npx tsc --init
```

**Update `tsconfig.json`:**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### **4. Folder Structure**

```
📁 project/
├── 📁 src/
│   └── app.ts (main file)
├── 📁 dist/ (auto-generated)
├── package.json
└── tsconfig.json
```

### **5. Add Scripts to `package.json`**

```json
"scripts": {
  "build": "tsc",
  "start": "node dist/app.js",
  "dev": "nodemon src/app.ts"
}
```

### **6. Basic Express App (`src/app.ts`)**

```typescript
import express, { Request, Response } from "express";
const app = express();
const PORT = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello TypeScript!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### **7. Run Commands**

- **Dev Mode (auto-restart):**
  ```bash
  npm run dev
  ```
- **Build & Run Production:**
  ```bash
  npm run build && npm start
  ```

---

### **Sequelize + MySQL Cheat Sheet**

#### **Install**

```bash
npm i sequelize mysql2 @types/sequelize -D
```

#### **Core Concepts**

1. **Setup**

   - `new Sequelize(db, user, pass, {dialect: 'mysql'})`
   - `authenticate()` to test connection

2. **Models**

   - Extend `Model` class
   - Define with `DataTypes`
   - `Model.init()` for config

3. **Sync**
   - `sequelize.sync()` to auto-create tables

#### **Quick Commands**

```bash
npx sequelize-cli init     # Setup migrations
npx sequelize-cli db:migrate  # Run migrations
```

#### **Pro Tip**

Use `-D` for dev dependencies!

🚀 **Done!**
