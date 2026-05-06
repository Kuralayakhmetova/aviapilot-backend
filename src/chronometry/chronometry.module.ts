import { Module } from "@nestjs/common";
import { ChronometryController } from "./chronometry.controller";
import { ChronometryService } from "./chronometry.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [ChronometryController],
  providers: [ChronometryService],
})
export class ChronometryModule {}