import { ConditionalPickDeep, Primitive } from 'type-fest';

export type DeepPropertiesOnly<T> = ConditionalPickDeep<T, Primitive | object>;
