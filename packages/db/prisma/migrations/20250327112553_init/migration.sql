-- CreateTable
CREATE TABLE "NewUser" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "photo" TEXT,

    CONSTRAINT "NewUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewRoom" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adminId" TEXT NOT NULL,

    CONSTRAINT "NewRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewChat" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "roomId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "NewChat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewUser_email_key" ON "NewUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "NewRoom_slug_key" ON "NewRoom"("slug");

-- AddForeignKey
ALTER TABLE "NewRoom" ADD CONSTRAINT "NewRoom_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "NewUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewChat" ADD CONSTRAINT "NewChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "NewUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewChat" ADD CONSTRAINT "NewChat_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "NewRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
