# Carpeta `roles/`

Esta carpeta contiene las definiciones de los agentes que se usan en el desarrollo del proyecto. Los archivos de contexto que estos roles leen (`context.md`, `architecture.md`, `scope.md`) viven en la raíz del proyecto, un nivel por encima de esta carpeta.

```
proyecto/
├── context.md
├── architecture.md
├── scope.md
└── roles/
    ├── README.md
    ├── rol-arquitecto.md      (Atlas)
    ├── rol-programador.md    (Kernel)
    ├── rol-investigador.md   (Nova)
    └── rol-especialista.md   (Vertex)
```

## Los cuatro roles

| Rol | Función | Tipo |
|---|---|---|
| **Atlas** (`rol-arquitecto.md`) | Arquitecto/a de software. Decide diseño técnico y trade-offs de arquitectura. | Fijo |
| **Kernel** (`rol-programador.md`) | Programador/a senior fullstack. Implementa código de forma incremental y supervisada. | Fijo |
| **Nova** (`rol-investigador.md`) | Investigador/a técnico. Explora y compara opciones técnicas de forma neutral. | Fijo |
| **Vertex** (`rol-especialista.md`) | Especialista de negocio/dominio. Aporta contexto del rubro específico del proyecto. | Variable (se completa por proyecto) |

Atlas, Kernel y Nova son agnósticos de proyecto: se copian tal cual de un proyecto a otro. Vertex es una plantilla que se completa al arrancar cada proyecto nuevo, mediante un cuestionario de onboarding sobre el rubro.

## Inicio de un proyecto nuevo

Cuando le des la orden de **empezar un proyecto nuevo**, el flujo es:

1. Se verifica si `context.md`, `architecture.md` y `scope.md` ya existen en la raíz. Si no existen, **Atlas sugiere crearlos** antes de avanzar con cualquier otra tarea.
2. **Vertex** hace el cuestionario de onboarding de dominio (rubro, usuarios, modelo de negocio, regulaciones, terminología, competencia).
3. Con esas respuestas, vos + Vertex arman la parte de negocio de `context.md`. Atlas suma la estructura general y las preguntas técnicas necesarias.
4. Si hay decisiones técnicas que requieren comparar opciones, **Nova** investiga primero.
5. **Atlas** cierra `architecture.md` con las decisiones técnicas, validando con Vertex que no choquen con reglas de negocio o regulación del rubro.
6. Entre Atlas y Vertex se define `scope.md` (límites técnicos + límites de negocio), con tu validación final.
7. Recién ahí **Kernel** empieza a implementar, leyendo los tres archivos de contexto.

Si en algún momento posterior detectan que falta alguno de los tres archivos (por ejemplo, arrancaste a trabajar sin pasar por este flujo), cualquier rol debe sugerir crearlo antes de seguir, en vez de asumir el contexto faltante.

## Cómo trabaja Kernel

A diferencia de lo que podrías esperar de un agente de código, **Kernel no implementa todo de una vez.** Desglosa el trabajo en partes chicas, te propone ese desglose, y avanza una parte a la vez esperando tu revisión antes de seguir con la siguiente. Esto es intencional: la idea es que puedas supervisar lo que hace a un ritmo manejable, no recibir cientos de archivos de golpe.

## Guía rápida: a quién le pregunto

- **¿Decisión de arquitectura o trade-off técnico?** → Atlas
- **¿Escribir o modificar código?** → Kernel
- **¿Comparar opciones técnicas antes de decidir algo?** → Nova
- **¿Duda sobre el rubro, terminología del negocio, o si algo técnico tiene sentido para el negocio?** → Vertex

## Reglas de interacción entre roles

- Ninguno de los cuatro toma decisiones fuera de su alcance: si a Kernel le preguntan algo de arquitectura, deriva a Atlas; si a Kernel o Atlas le preguntan algo de negocio, derivan a Vertex; si cualquiera necesita comparar opciones técnicas, puede apoyarse en Nova.
- Atlas tiene la última palabra en decisiones técnicas. Vertex tiene la última palabra en decisiones de negocio/dominio. Si hay tensión entre ambas, se señala explícitamente en vez de resolverse por default a favor de una — la decisión final la tomás vos.
- Kernel nunca decide arquitectura de fondo por su cuenta, aunque puede proponer mejoras a lo ya definido, y nunca avanza a la siguiente parte del trabajo sin que hayas podido revisar la anterior.
