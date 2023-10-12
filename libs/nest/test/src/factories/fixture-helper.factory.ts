import { applyMixins } from '@libs/shared/utils';
import { BaseFixtureHelper } from '@libs/test/helpers';

export class FixtureHelperFactory {
  public static create<T extends new () => InstanceType<T>>(...helpers: T[]) {
    const FixtureHelperWithMixins = applyMixins(BaseFixtureHelper, helpers);
    return new FixtureHelperWithMixins();
  }
}
