import { Controller } from "@nestjs/common";
import { SectionService } from "./section.service";

@Controller("sections")
export class SectionController {
  readonly #service: SectionService;
  constructor(service: SectionService) {
    this.#service = service;
  }
}
