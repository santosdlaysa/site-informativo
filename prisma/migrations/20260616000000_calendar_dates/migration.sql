-- CreateTable
CREATE TABLE "CalendarDate" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "color" TEXT NOT NULL DEFAULT 'purple',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalendarDate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CalendarDate_date_idx" ON "CalendarDate"("date");
