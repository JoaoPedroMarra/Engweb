export type OrderItem = {
  productId: number
  quantity: number
  unitPrice: number
}

export type Order = {
  id: number
  customerId: number
  items: OrderItem[]
  total: number
  deliveryAddress: string
  createdAt: Date
}
