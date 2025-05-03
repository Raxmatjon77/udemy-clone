import { Module } from "@nestjs/common";
import { ConstructorController } from "./constructor.controller";
import { ConstructorService } from "./constructor.service";

@Module({
  controllers: [ConstructorController],
  providers: [ConstructorService],
})
export class ConstructorModule {}
