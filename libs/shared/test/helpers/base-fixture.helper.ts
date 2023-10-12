import * as Chance from 'chance';

export class BaseFixtureHelper {
  protected randomizer: Chance.Chance;

  private readonly seed?: string;

  constructor(options: { seed?: string } = {}) {
    this.seed = options.seed ?? process.env['TEST_SEED'];
    if (this.seed) {
      this.randomizer = new Chance(this.seed);
    } else {
      this.randomizer = new Chance();
    }
  }

  public randomNumber({ min = 100_000, max = 999_999 } = {}): number {
    return this.randomizer.integer({ min, max });
  }

  public randomString(length = 16): string {
    return this.randomizer.string({ length });
  }

  public randomStringNumber(): string {
    return this.randomNumber().toString();
  }

  public randomUuid(): string {
    // guid is compatible with uuid
    return this.randomizer.guid({ version: 4 });
  }

  public randomHash(length = 40) {
    return this.randomizer.hash({ length });
  }

  public randomMongoId(): string {
    return this.randomizer.hash({ length: 24 });
  }

  public randomUrl(...params: Parameters<typeof this.randomizer.url>): string {
    return this.randomizer.url(...params);
  }

  public randomFullName() {
    return this.randomizer.name({ full: true });
  }

  public randomEmail() {
    return this.randomizer.email();
  }

  public randomFirstName() {
    return this.randomizer.first();
  }

  public randomLastName() {
    return this.randomizer.last();
  }
}
