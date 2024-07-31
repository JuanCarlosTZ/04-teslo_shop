<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar Proyecto en Desarrollo
1. Clonar el proyecto
2. Intalar las dependencias
```
yarn install
```
3. Copiar el archivo ```.env.tamplate``` y nombrar como ```.env```
4. Configurar las variables de entorno
5. Levantar la base de datos
```
docker-compose up -d
```
6. Ejecutar el proyecto en modo desarrollo
```
yarn start:dev
```

7. Levantar datos de desarrollo, ejecutar SEED
```
get(): http://localhost:3000/api/seed
```

# Test
## Documentacion de la api
```
http://localhost:3000/api
```