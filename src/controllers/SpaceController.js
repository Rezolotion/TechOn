import { SpaceRepository } from '../repositories/SpaceRepository.js';

export class SpaceController {
  constructor(spaceRepo = new SpaceRepository()) {
    this.spaceRepo = spaceRepo;
  }

  getAllSpaces(req, res) {
    const spaces = this.spaceRepo.findAll();
    return { success: true, spaces };
  }
}
