#Establecer la imagen base
FROM node:21

#Establecer el directorio de trabajo en el contenedor
WORKDIR /app

#Copiar los archivos del paquete.json y el paquete-lock.json
COPY package*.json ./

#Instalar las dependencias del proyecto
RUN npm install

#Copiar el resto de los archivos del proyecto
COPY . .

#Construir la aplicación para producción
RUN npm run build

#Establecer la imagen base para la etapa de producción
FROM nginx:stable-alpine

#Copiar los archivos de construcción al contenedor de nginx
COPY --from=0 /app/build /usr/share/nginx/html

#Exponer el puerto 80
EXPOSE 3000

#Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]