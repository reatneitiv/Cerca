import { Money } from '@/src/domain/value-objects/money.value-object';

export interface Listing {
  readonly id: string;
  readonly title: string;
  readonly price: Money;
  readonly distance: string;
  readonly imageUrl: string;
}

