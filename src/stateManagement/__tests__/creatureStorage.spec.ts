import { Vector } from '../../geometry/vector';
import { CreatureStorage } from '../creatureStorage';

describe('CreatureStorage', () => {
  it('can getAllCreatures', () => {
    const storage = new CreatureStorage();
    const creature1 = storage.addBoid();
    const creature2 = storage.addHunter();
    const creature3 = storage.addBoid();
    const creature4 = storage.addHunter();
    const creature5 = storage.addBoid();

    const actual = storage.getAllCreatures();

    expect(actual).toEqual([
      creature1,
      creature2,
      creature3,
      creature4,
      creature5,
    ]);
  });

  it('can getAllHunters', () => {
    const storage = new CreatureStorage();
    storage.addBoid();
    const hunter1 = storage.addHunter();
    storage.addBoid();
    const hunter2 = storage.addHunter();
    storage.addBoid();

    const actual = storage.getAllHunters();

    expect(actual).toHaveLength(2);
    expect(actual).toContain(hunter1);
    expect(actual).toContain(hunter2);
  });

  it('can getHunterCount', () => {
    const storage = new CreatureStorage();
    storage.addBoid();
    storage.addHunter();
    storage.addBoid();
    storage.addHunter();
    storage.addBoid();

    expect(storage.getHunterCount()).toBe(2);
  });

  it('can getHuntersInArea', () => {
    const storage = new CreatureStorage();
    storage.addBoid();
    const hunterNear1 = storage.addHunter(new Vector(1, 2));
    storage.addBoid();
    const hunterNear2 = storage.addHunter(new Vector(2, 1));
    storage.addBoid();
    storage.addHunter(new Vector(500, 500));
    storage.update();

    const actual = storage.getHuntersInArea(new Vector(1, 1), 2);

    expect(actual).toEqual([
      hunterNear1,
      hunterNear2,
    ]);
  });
});
