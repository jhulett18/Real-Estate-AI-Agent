# 1️⃣ Use an official Node.js image as a base
FROM node:18-alpine AS builder

# 2️⃣ Set the working directory
WORKDIR /app

# 3️⃣ Copy package.json and package-lock.json first (for caching dependencies)
COPY package*.json ./

# 4️⃣ Install dependencies
RUN npm install

# 5️⃣ Copy the rest of the application files
COPY . .

# 6️⃣ Build the Next.js application
RUN npm run build

# 7️⃣ Start a new, clean image
FROM node:18-alpine AS runner

# 8️⃣ Set the working directory again
WORKDIR /app

# 9️⃣ Copy only the necessary built files from the builder stage
COPY --from=builder /app ./

# 1️⃣0️⃣ Expose the default Next.js port
EXPOSE 3000

# 1️⃣1️⃣ Start the Next.js app in production mode
CMD ["npm", "start"]
