import { type ConditionalPickDeep, type PartialDeep, type Primitive } from 'type-fest';

export type PartialDeepPropertiesOnly<T> = PartialDeep<ConditionalPickDeep<T, Primitive | object>>;
