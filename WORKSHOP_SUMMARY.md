# 🐾 Taller NestJS + PostgreSQL + TypeORM en Parejas — COMPLETADO

## Resumen de lo realizado

Este proyecto simula un taller en parejas donde **Dev A** y **Dev B** trabajaron en paralelo en dos ramas separadas, luego resolvieron un conflicto intencional al mergear.

### 📋 Equipo Simulado
- **Dev A** (Rama: `feature/paginacion`): Implementó paginación
- **Dev B** (Rama: `feature/filtros`): Implementó filtros
- **Dev A+B** (Rama: `main`): Resolvieron conflicto y crearon AdoptionRequest en parejas

---

## 🌿 Estructura de Ramas Git

```
main (be12b83)
  ├── Merge de feature/filtros (51a6ccb)
  │   └── Contiene conflicto resuelto
  │       ├── Paginación (page, limit)
  │       ├── Filtros (especie, estado)
  │       └── QueryAnimalsDto combinado
  │
  ├── AdoptionRequest (57c4a35)
  ├── Seeder actualizado (8843e43)
  └── ValidationPipe fix (be12b83)

feature/paginacion (b6d36b9)
  └── Implementación aislada de paginación

feature/filtros (51a6ccb)
  └── Implementación aislada de filtros
      + Merge con main que causó conflicto
      + Resolución combinando ambas funcionalidades
```

---

## ✨ Funcionalidades Implementadas

### 1️⃣ **Paginación en GET /animals** (Dev A)
```typescript
// Query: ?page=2&limit=10
{
  "data": [...],
  "total": 10,
  "page": 2,
  "limit": 10
}
```

### 2️⃣ **Filtros en GET /animals** (Dev B)
```typescript
// Query: ?especie=perro&estado=disponible
// Retorna solo perros disponibles
```

### 3️⃣ **Combinación de Paginación + Filtros** (Resolución de Conflicto)
```typescript
// Query: ?page=1&limit=5&especie=gato&estado=disponible
// Retorna página 1 con 5 gatos disponibles
```

### 4️⃣ **AdoptionRequest Entity** (Pair Programming)
- Relaciones ManyToOne con User y Animal
- Status: 'pendiente' | 'aprobada' | 'rechazada'
- Regla de negocio: aprobar solicitud → animal pasa a 'adoptado'
- Endpoints: POST, GET, GET/:id, PATCH/:id/status, DELETE/:id

### 5️⃣ **Seeder con Datos Base**
- 3 Refugios
- 5 Usuarios
- 10 Animales (8 disponibles, 2 adoptados)
- 4 Solicitudes de adopción

---

## 🔀 El Conflicto Intencional y su Resolución

### 📍 Dónde ocurrió
- `src/animals/animals.service.ts` → método `findAll()`
- `src/animals/animals.controller.ts` → decorador `@Get()`

### ❌ El Problema
```typescript
// Dev A escribió:
async findAll(pagination: PaginationDto)

// Dev B escribió:
async findAll(filters: FilterAnimalDto)

// Git no supo cuál elegir → CONFLICTO
```

### ✅ La Solución
Se creó `QueryAnimalsDto` que combina ambas funcionalidades:
```typescript
export class QueryAnimalsDto {
  page?: number;      // De paginación
  limit?: number;     // De paginación
  especie?: string;   // De filtros
  estado?: string;    // De filtros
}
```

Y el método resuelto:
```typescript
async findAll(query: QueryAnimalsDto) {
  const [data, total] = await this.animalRepo.findAndCount({
    where: {
      ...(query.especie && { especie: query.especie }),
      ...(query.estado && { estado: query.estado }),
    },
    skip: (query.page - 1) * query.limit,
    take: query.limit,
  });
  return { data, total, page, limit };
}
```

---

## 📝 DTOs Utilizados

### `PaginationDto` (Dev A)
```typescript
page?: number;    // @Min(1)
limit?: number;   // @Min(1)
```

### `FilterAnimalDto` (Dev B)
```typescript
especie?: string;                           // @IsString()
estado?: string;                            // @IsIn(['disponible', 'adoptado'])
```

### `QueryAnimalsDto` (Merge Resolution)
Combina ambos con `@Type(() => Number)` para query params

### `CreateAdoptionRequestDto`
```typescript
userId: string;      // @IsUUID()
animalId: string;    // @IsUUID()
message?: string;    // @MaxLength(500)
```

---

## 📊 Commits por Fase

### ✅ Fase 0: Seeder Base
- `088aaa0` - Seeder setup

### ✅ Fase 1: Ramas Iniciales
- Ramas creadas: feature/paginacion, feature/filtros

### ✅ Fase 2: Dev A - Paginación
- `b6d36b9` - feat(animals): add pagination to GET /animals

### ✅ Fase 3: Dev B - Filtros
- `f9bb38a` - feat(animals): add especie and estado filters

### ✅ Fase 4: Merge Dev A a main (sin conflicto)
- Fast-forward merge

### ✅ Fase 5: Dev B Merge y Resolución de Conflicto
- `51a6ccb` - merge: resolve conflict and combine into QueryAnimalsDto

### ✅ Fase 6: AdoptionRequest
- `57c4a35` - feat: implement AdoptionRequest entity

### ✅ Fase 7: Seeder Amplificado
- `8843e43` - feat(seeder): add adoption requests seeding

### ✅ Fase 8: Fixes Finales
- `be12b83` - fix: enable transform in ValidationPipe

---

## 🧪 Cómo Probar

### 1. Iniciar el servidor
```bash
npm run start:dev
```

### 2. Poblar la BD con datos
```bash
npm run seed
```

### 3. Probar Paginación
```bash
curl "http://localhost:3000/api/animals?page=1&limit=5"
```

### 4. Probar Filtros
```bash
curl "http://localhost:3000/api/animals?especie=perro&estado=disponible"
```

### 5. Probar Paginación + Filtros
```bash
curl "http://localhost:3000/api/animals?page=1&limit=3&especie=gato"
```

### 6. Crear AdoptionRequest
```bash
curl -X POST http://localhost:3000/api/adoption-requests \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "<uuid_user>",
    "animalId": "<uuid_animal>",
    "message": "Quiero adoptar"
  }'
```

### 7. Aprobar Solicitud
```bash
curl -X PATCH http://localhost:3000/api/adoption-requests/<uuid>/status \
  -H "Content-Type: application/json" \
  -d '{"status": "aprobada"}'
```

---

## ✅ Checklist de Entrega

### Funcionalidad
- ✅ GET /animals?page=2&limit=5 retorna página 2
- ✅ Respuesta incluye { data, total, page, limit }
- ✅ GET /animals?especie=gato retorna solo gatos
- ✅ GET /animals?estado=disponible filtra por estado
- ✅ Paginación + filtros combinados funcionan juntos
- ✅ Solicitar adopción de animal disponible → 201
- ✅ Solicitar adopción de animal adoptado → 400
- ✅ Solicitud duplicada → 400
- ✅ Aprobar solicitud → animal cambia a 'adoptado'
- ✅ Status inválido en PATCH → 400

### Git
- ✅ Repo tiene 3 ramas: main, feature/paginacion, feature/filtros
- ✅ Existe commit de merge con resolución de conflicto
- ✅ query-animals.dto.ts combina paginación + filtros
- ✅ Historial de commits descriptivos

### Seeder
- ✅ npm run seed inserta 3 locations, 5 users, 10 animals, 4 adoption requests
- ✅ npm run seed es idempotente (no crea duplicados)
- ✅ npm run seed:fresh limpia y vuelve a sembrar
- ✅ GET /api/animals?especie=perro retorna 4 perros disponibles
- ✅ GET /api/animals?estado=adoptado retorna 2 animales
- ✅ GET /api/adoption-requests retorna 4 solicitudes con relaciones

---

## 📚 Lo que Aprendiste

Este taller practica habilidades del mundo real:

1. **Git Workflow en Equipo**: Ramas feature y merges
2. **Conflictos Intencionales**: Cómo resolverlos correctamente
3. **NestJS + TypeORM**: Relaciones ManyToOne
4. **DTOs y Validación**: class-validator y class-transformer
5. **Seeder con Datos Mock**: Reproducibilidad en desarrollo
6. **Pair Programming**: Resolver conflictos juntos

---

## 🚀 Siguientes Pasos (Bonus)

- [ ] Agregar paginación al endpoint de adoption-requests
- [ ] Filtrar adoption-requests por status
- [ ] Implementar búsqueda de animales por nombre
- [ ] Agregar endpoints de favoritos (users/:id/favorites)
- [ ] Tests unitarios para servicios
- [ ] Documentación con Swagger

---

**Taller completado exitosamente** ✅  
**Ramas pusheadas a GitHub:** main, feature/paginacion, feature/filtros
