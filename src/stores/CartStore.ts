import { makeAutoObservable } from "mobx";
import type { Product } from "../data/catalog";

export interface CartItem {
  product: Product;
  qty: number;
}

export class CartStore {
  items: CartItem[] = [];
  isOpen = false;
  lastOrderTotal: number | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  add(product: Product): void {
    if (product.soldOut) return;
    this.lastOrderTotal = null;
    const existing = this.items.find((i) => i.product.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      this.items.push({ product, qty: 1 });
    }
    this.isOpen = true;
  }

  remove(productId: string): void {
    this.items = this.items.filter((i) => i.product.id !== productId);
  }

  dec(productId: string): void {
    const item = this.items.find((i) => i.product.id === productId);
    if (!item) return;
    if (item.qty <= 1) {
      this.remove(productId);
    } else {
      item.qty -= 1;
    }
  }

  get count(): number {
    return this.items.reduce((sum, i) => sum + i.qty, 0);
  }

  lineTotal(product: Product, qty: number): number {
    const discount = product.bulkDiscount;
    const rate = discount && qty >= discount.minQuantity ? 1 - discount.percent / 100 : 1;
    return product.price * qty * rate;
  }

  get total(): number {
    return this.items.reduce((sum, i) => sum + this.lineTotal(i.product, i.qty), 0);
  }

  open(): void {
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
  }

  checkout(): void {
    if (this.items.length === 0) return;
    this.lastOrderTotal = this.total;
    this.items = [];
  }

  dismissOrder(): void {
    this.lastOrderTotal = null;
    this.isOpen = false;
  }
}
