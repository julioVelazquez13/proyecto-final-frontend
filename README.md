# Biblioteca Virtual - Proyecto Final Front-End

Aplicación web CRUD hecha con Vue 3, Vite y json-server para gestionar una biblioteca virtual.

## Entidades

- Libros
- Autores
- Categorías

## Requisitos

- Node.js
- npm

## Instalación

```bash
npm install
```

## Ejecutar API

```bash
npm run api
```

La API se ejecuta en:

```text
http://localhost:3000
```

Endpoints principales:

```text
http://localhost:3000/libros
http://localhost:3000/autores
http://localhost:3000/categorias
```

## Ejecutar frontend

En otra terminal:

```bash
npm run dev
```

La aplicación se abre en:

```text
http://localhost:5173
```

## Funcionalidades

- Listar, crear, editar y eliminar libros.
- Listar, crear, editar y eliminar autores.
- Listar, crear, editar y eliminar categorías.
- Búsqueda y filtros.
- Navegación con Vue Router.
- Consumo de API con Axios.
- Componentes reutilizables.
- Comunicación mediante props y emits.
- Uso de Composition API, computed, watch y hooks.
