import { createContext, useContext, useState, useEffect } from 'react'
import { cartAPI } from '../api'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const fetchCart = async () => {
    if (!user) { setItems([]); return }
    try {
      const { data } = await cartAPI.get()
      setItems(data)
    } catch { setItems([]) }
  }

  useEffect(() => { fetchCart() }, [user])

  const addToCart = async (product_id, quantity = 1) => {
    const { data } = await cartAPI.add({ product_id, quantity })
    await fetchCart()
    return data
  }

  const updateQuantity = async (id, quantity) => {
    if (quantity <= 0) {
      await cartAPI.remove(id)
    } else {
      await cartAPI.update(id, { quantity })
    }
    await fetchCart()
  }

  const removeItem = async (id) => {
    await cartAPI.remove(id)
    await fetchCart()
  }

  const clearCart = async () => {
    await cartAPI.clear()
    setItems([])
  }

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, loading, addToCart, updateQuantity, removeItem, clearCart, total, itemCount, fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
