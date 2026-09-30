FROM node:22-alpine

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ARG BACKEND_API_URL=http://localhost:4000
ARG NEXT_PUBLIC_AUTH_UI_URL=http://localhost:3002
ARG NEXT_PUBLIC_COMMON_UI_URL=http://localhost:3000
ARG NEXT_PUBLIC_ADMIN_UI_URL=http://localhost:3001
ARG NEXT_PUBLIC_WALL_UI_URL=http://localhost:3003
ARG NEXT_PUBLIC_BOOKING_UI_URL=http://localhost:3004
ARG NEXT_PUBLIC_GATE_UI_URL=http://localhost:3005
ARG NEXT_PUBLIC_BILLING_UI_URL=http://localhost:3007
ENV BACKEND_API_URL=$BACKEND_API_URL
ENV NEXT_PUBLIC_AUTH_UI_URL=$NEXT_PUBLIC_AUTH_UI_URL
ENV NEXT_PUBLIC_COMMON_UI_URL=$NEXT_PUBLIC_COMMON_UI_URL
ENV NEXT_PUBLIC_ADMIN_UI_URL=$NEXT_PUBLIC_ADMIN_UI_URL
ENV NEXT_PUBLIC_WALL_UI_URL=$NEXT_PUBLIC_WALL_UI_URL
ENV NEXT_PUBLIC_BOOKING_UI_URL=$NEXT_PUBLIC_BOOKING_UI_URL
ENV NEXT_PUBLIC_GATE_UI_URL=$NEXT_PUBLIC_GATE_UI_URL
ENV NEXT_PUBLIC_BILLING_UI_URL=$NEXT_PUBLIC_BILLING_UI_URL

COPY package.json ./
RUN node -e "const fs=require('fs'); const p=JSON.parse(fs.readFileSync('package.json')); p.dependencies['@gestionresidencial/auth-client']='0.4.1'; p.dependencies['@gestionresidencial/shared-ui']='0.3.1'; p.scripts.build='next build'; fs.writeFileSync('package.json', JSON.stringify(p));"
RUN npm install --no-audit --no-fund

COPY . .
RUN node -e "const fs=require('fs'); const p=JSON.parse(fs.readFileSync('package.json')); p.scripts.build='next build'; fs.writeFileSync('package.json', JSON.stringify(p));"
RUN rm -rf packages
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
