/*
  Warnings:

  - You are about to drop the column `tipo_lote` on the `lotes` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_registro_sanitario` on the `registros_sanitarios` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_unidade` on the `unidades` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_pagamento` on the `vendas` table. All the data in the column will be lost.
  - Added the required column `tipo` to the `lotes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `registros_sanitarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `unidades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pagamento` to the `vendas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."lotes" DROP COLUMN "tipo_lote",
ADD COLUMN     "tipo" "public"."tipo_lote" NOT NULL;

-- AlterTable
ALTER TABLE "public"."registros_sanitarios" DROP COLUMN "tipo_registro_sanitario",
ADD COLUMN     "tipo" "public"."tipo_registro_sanitario" NOT NULL;

-- AlterTable
ALTER TABLE "public"."unidades" DROP COLUMN "tipo_unidade",
ADD COLUMN     "tipo" "public"."tipo_unidade" NOT NULL;

-- AlterTable
ALTER TABLE "public"."vendas" DROP COLUMN "tipo_pagamento",
ADD COLUMN     "pagamento" "public"."tipo_pagamento" NOT NULL;
