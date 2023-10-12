import { applyMixins } from '@libs/shared/utils';
import { BaseSpecHelper } from '@libs/test/helpers';
import { SpecHelper } from '../helpers';

export class SpecHelperFactory {
  public static create<T extends new () => InstanceType<T>>(...helpers: T[] | []) {
    const SpecHelperWithMixins = applyMixins(BaseSpecHelper, [SpecHelper, ...helpers]);
    const specHelper = new SpecHelperWithMixins();
    specHelper.mixins = new Set([SpecHelper, ...helpers]);
    return specHelper;
  }
}
