FROM node:20-alpine

WORKDIR /app

# Install dependencies (including devDeps for tsx seed script)
COPY package*.json ./
RUN npm install

# Copy source and prisma
COPY . .

# Generate Prisma client for Alpine (linux-musl)
RUN npx prisma generate

# Compile TypeScript
RUN npm run build

# Make entrypoint executable
RUN chmod +x entrypoint.sh

EXPOSE 3001

CMD ["./entrypoint.sh"]
