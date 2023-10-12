import { instanceToPlain } from 'class-transformer';
import * as mongoose from 'mongoose';

const labels = {
  docs: 'items',
  limit: false,
  nextPage: false,
  offset: false,
  pagingCounter: false,
  prevPage: false,
  totalDocs: 'totalItems',
};

export function normalizeFilterQuery<M>(filter: object = {}): mongoose.FilterQuery<M> {
  const normalizedFilter = instanceToPlain(filter);
  if ('search' in normalizedFilter) {
    normalizedFilter['$text'] = { $search: normalizedFilter['search'] };
    delete normalizedFilter['search'];
  }
  Object.entries(normalizedFilter).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      normalizedFilter[key] = { $in: value };
    }
  });
  return normalizedFilter;
}

export function normalizePaginateOptions(paginateOptions: mongoose.PaginateOptions): mongoose.PaginateOptions {
  const normalizedPaginateOptions: mongoose.PaginateOptions = paginateOptions;
  normalizedPaginateOptions['customLabels'] = labels;
  return normalizedPaginateOptions;
}
