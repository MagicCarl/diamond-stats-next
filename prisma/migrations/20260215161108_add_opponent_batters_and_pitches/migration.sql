-- AlterTable
ALTER TABLE "at_bats" ADD COLUMN     "opponent_batter_id" TEXT,
ALTER COLUMN "player_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "subscriptions" ALTER COLUMN "plan" SET DEFAULT 'annual';

-- CreateTable
CREATE TABLE "opponent_batters" (
    "id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "jersey_number" INTEGER,
    "bats" TEXT NOT NULL DEFAULT 'right',
    "order_in_game" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "opponent_batters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pitches" (
    "id" TEXT NOT NULL,
    "at_bat_id" TEXT NOT NULL,
    "pitch_number" INTEGER NOT NULL,
    "result" TEXT NOT NULL,
    "location_x" DOUBLE PRECISION,
    "location_y" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pitches_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "opponent_batters" ADD CONSTRAINT "opponent_batters_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "at_bats" ADD CONSTRAINT "at_bats_opponent_batter_id_fkey" FOREIGN KEY ("opponent_batter_id") REFERENCES "opponent_batters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pitches" ADD CONSTRAINT "pitches_at_bat_id_fkey" FOREIGN KEY ("at_bat_id") REFERENCES "at_bats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
