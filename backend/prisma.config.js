// import 'dotenv/config'
// import { defineConfig, env } from 'prisma/config'

// export default defineConfig({
//   schema: 'prisma/schema.prisma',

//   datasource: {
//     url: env('DATABASE_URL'),              // OBRIGATÓRIO
//   },

//   seed: "node prisma/seed.js",
// })
// prisma.config.js


// import 'dotenv/config'
// import { defineConfig, env } from 'prisma/config'

// export default defineConfig({
//   schema: 'prisma/schema.prisma',
//   migrations: {
//     // path: 'prisma/migrations',      // ou outro caminho, se você tiver
//     seed: 'node prisma/seed.js',    // aqui entra o comando de seed
//   },
//   datasource: {
//     url: env('DATABASE_URL'),
//   },
// })

import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',

  env: {
    load: true, // Agora o Prisma carrega o .env antes de tudo
  },

  migrations: {
    seed: 'node prisma/seed.js',
  },

  datasource: {
    db: {
      url: "env:DATABASE_URL",   // 👈 STRING especial, não chama env()
    }
  }
})
