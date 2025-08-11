# Build Stage
FROM node:18-alpine AS build
ARG VITE_GOOGLE_ID
ARG VITE_HUGGINGFACE_ID
ARG VITE_API_URL
ENV VITE_GOOGLE_ID=$VITE_GOOGLE_ID
ENV VITE_HUGGINGFACE_ID=$VITE_HUGGINGFACE_ID
ENV VITE_API_URL=$VITE_API_URL
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production Stage
FROM nginx:stable-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf 
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]