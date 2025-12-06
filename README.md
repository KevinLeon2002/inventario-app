# INVENTARIO-APP

Sistema Integral de Gestión Comercial para **TecnoRepuestos S.A.**

---

## Descripción

Sistema de gestión de inventario, compras, ventas y reportes con autenticación **JWT** y sistema de **roles de usuario**.

---

## Características

* **RF-1:** Registrar Producto
* **RF-2:** Actualizar Producto
* **RF-3:** Registrar Compra a Proveedor
* **RF-4:** Registrar Venta y Validar Stock
* **RF-6:** Consultar Inventario y Generar Reportes
* **RF-7:** Alertas por Stock Bajo
* **RF-8:** Portal Cliente para Pedidos
* **RF-9:** Gestión de Usuarios y Roles
* **RF-10:** Exportación de Reportes (CSV)

---

## Tecnologías

* Node.js / Express.js
* JWT para autenticación
* Base de datos en memoria
* Jest para testing

---

## Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/tu-usuario/inventario-app.git

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 4. Iniciar servidor
npm run dev
```

---

## Comandos

```bash
npm run dev      # Modo desarrollo
npm start        # Producción
npm test         # Ejecutar tests
```

---

## API Endpoints

### Autenticación

* **POST /api/auth/login** – Autenticación mediante JWT

### Productos

* **GET /api/productos** – Listar productos

### Ventas

* **POST /api/ventas** – Registrar venta

### Reportes

* **GET /api/reportes/inventario** – Generar reporte de inventario

---

## Pruebas

```bash
npm test
npm run test:unit
npm run test:integration
```

