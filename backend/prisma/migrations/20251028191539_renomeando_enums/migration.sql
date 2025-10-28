/*
  Warnings:

  - You are about to drop the column `tipo` on the `lotes` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `registros_sanitarios` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `unidades` table. All the data in the column will be lost.
  - You are about to drop the column `pagamento` on the `vendas` table. All the data in the column will be lost.
  - Added the required column `tipo_lote` to the `lotes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo_registro_sanitario` to the `registros_sanitarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo_unidade` to the `unidades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo_pagamento` to the `vendas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."lotes" DROP COLUMN "tipo",
ADD COLUMN     "tipo_lote" "public"."tipo_lote" NOT NULL;

-- AlterTable
ALTER TABLE "public"."registros_sanitarios" DROP COLUMN "tipo",
ADD COLUMN     "tipo_registro_sanitario" "public"."tipo_registro_sanitario" NOT NULL;

-- AlterTable
ALTER TABLE "public"."unidades" DROP COLUMN "tipo",
ADD COLUMN     "tipo_unidade" "public"."tipo_unidade" NOT NULL;

-- AlterTable
ALTER TABLE "public"."vendas" DROP COLUMN "pagamento",
ADD COLUMN     "tipo_pagamento" "public"."tipo_pagamento" NOT NULL;
