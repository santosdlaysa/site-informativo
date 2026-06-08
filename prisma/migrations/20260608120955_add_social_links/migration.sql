-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "socialFacebook" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "socialInstagram" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "socialLinkedin" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "socialTwitter" TEXT NOT NULL DEFAULT '';
