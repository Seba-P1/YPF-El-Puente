'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ChevronLeft, ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore } from '@/stores/cart'
import { formatearPrecioARS } from '@/lib/excel/parser'
import { generateWhatsAppURL, openWhatsApp } from '@/lib/whatsapp/formatter'
import { getWhatsAppConfig } from '@/lib/supabase/actions'

export function CartSidebar() {
  const [vista, setVista] = useState<'cart' | 'checkout'>('cart')
  const [nombre, setNombre] = useState('')
  const [mostrarError, setMostrarError] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const inputNombreRef = useRef<HTMLInputElement>(null)

  const { items, total, totalItems, isOpen, closeCart, removeItem, updateQuantity, clearCart } = useCartStore()

  useEffect(() => {
    if (vista === 'checkout') {
      const timer = setTimeout(() => {
        inputNombreRef.current?.focus()
      }, 280)
      return () => clearTimeout(timer)
    }
  }, [vista])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const nombreEsValido = (n: string): boolean => {
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{2,}$/.test(n.trim())
  }

  const handleEnviarPedido = async () => {
    if (!nombreEsValido(nombre)) {
      setMostrarError(true)
      inputNombreRef.current?.focus()
      return
    }

    setEnviando(true)

    try {
      const config = await getWhatsAppConfig()
      const url = generateWhatsAppURL(items, config, nombre.trim())
      openWhatsApp(url)

      clearCart()
      setNombre('')
      setMostrarError(false)
      setVista('cart')
      closeCart()
    } catch (error) {
      console.error('Error al generar el pedido:', error)
    } finally {
      setEnviando(false)
    }
  }

  const handleVolverAlCarrito = () => {
    setVista('cart')
    setMostrarError(false)
  }

  const handleCerrar = () => {
    closeCart()
    setTimeout(() => {
      setVista('cart')
      setMostrarError(false)
    }, 300)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleCerrar}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          />

          <motion.div
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 w-full md:w-[420px] z-50 flex flex-col"
            style={{
              background: '#0A0A0F',
              borderLeft: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <AnimatePresence mode="wait">

              {vista === 'cart' ? (
                <motion.div
                  key="vista-cart"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="flex flex-col h-full"
                >
                  <div
                    className="flex items-center justify-between flex-shrink-0"
                    style={{
                      padding: '20px 20px 16px',
                      borderBottom: '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingCart size={20} color="white" />
                      <span style={{ fontSize: 17, fontWeight: 700, color: 'white' }}>
                        Tu Pedido
                      </span>
                      {totalItems > 0 && (
                        <span
                          style={{
                            background: '#005A9C',
                            color: 'white',
                            fontSize: 11,
                            fontWeight: 700,
                            borderRadius: 9999,
                            padding: '2px 8px',
                          }}
                        >
                          {totalItems}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handleCerrar}
                      style={{
                        background: 'rgba(255,255,255,0.07)',
                        border: 'none',
                        borderRadius: 8,
                        padding: 6,
                        cursor: 'pointer',
                        display: 'flex',
                        color: 'rgba(255,255,255,0.6)',
                      }}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto" style={{ padding: '12px 20px' }}>
                    {items.length === 0 ? (
                      <div
                        className="flex flex-col items-center justify-center h-full"
                        style={{ gap: 12, paddingBottom: 60 }}
                      >
                        <ShoppingCart size={40} color="rgba(255,255,255,0.15)" />
                        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                          Tu carrito está vacío
                        </p>
                        <button
                          onClick={handleCerrar}
                          style={{
                            fontSize: 13,
                            color: '#0070C0',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          }}
                        >
                          Ver el menú
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {items.map((item) => (
                          <div
                            key={item.producto.id}
                            className="flex items-center gap-3"
                            style={{
                              padding: '12px 0',
                              borderBottom: '1px solid rgba(255,255,255,0.06)',
                            }}
                          >
                            <div
                              style={{
                                width: 44,
                                height: 44,
                                borderRadius: 8,
                                background: 'rgba(255,255,255,0.05)',
                                flexShrink: 0,
                                overflow: 'hidden',
                                position: 'relative',
                              }}
                            >
                              {item.producto.imagen_url && (
                                <Image
                                  src={item.producto.imagen_url}
                                  alt={item.producto.nombre}
                                  fill
                                  sizes="44px"
                                  className="object-contain"
                                />
                              )}
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p
                                style={{
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color: 'white',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {item.producto.nombre}
                              </p>
                              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
                                {formatearPrecioARS(item.producto.precio)} c/u
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5" style={{ flexShrink: 0 }}>
                              <button
                                onClick={() => updateQuantity(item.producto.id, item.cantidad - 1)}
                                style={{
                                  width: 26,
                                  height: 26,
                                  borderRadius: 6,
                                  background: 'rgba(255,255,255,0.08)',
                                  border: '1px solid rgba(255,255,255,0.1)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  color: 'white',
                                }}
                              >
                                <Minus size={12} />
                              </button>
                              <span
                                style={{
                                  fontSize: 14,
                                  fontWeight: 700,
                                  color: 'white',
                                  minWidth: 20,
                                  textAlign: 'center',
                                }}
                              >
                                {item.cantidad}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.producto.id, item.cantidad + 1)}
                                style={{
                                  width: 26,
                                  height: 26,
                                  borderRadius: 6,
                                  background: 'rgba(255,255,255,0.08)',
                                  border: '1px solid rgba(255,255,255,0.1)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  color: 'white',
                                }}
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            <div style={{ flexShrink: 0, textAlign: 'right', minWidth: 70 }}>
                              <p style={{ fontSize: 13, fontWeight: 700, color: '#FFD100' }}>
                                {formatearPrecioARS(item.subtotal)}
                              </p>
                              <button
                                onClick={() => removeItem(item.producto.id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  color: 'rgba(255,255,255,0.25)',
                                  marginTop: 2,
                                  display: 'flex',
                                  alignItems: 'center',
                                  marginLeft: 'auto',
                                }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {items.length > 0 && (
                    <div
                      className="flex-shrink-0"
                      style={{
                        padding: '16px 20px 24px',
                        borderTop: '1px solid rgba(255,255,255,0.07)',
                      }}
                    >
                      <div
                        className="flex justify-between items-center"
                        style={{ marginBottom: 14 }}
                      >
                        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
                          Total estimado
                        </span>
                        <span style={{ fontSize: 22, fontWeight: 800, color: 'white' }}>
                          {formatearPrecioARS(total)}
                        </span>
                      </div>

                      <button
                        onClick={() => setVista('checkout')}
                        className="w-full flex items-center justify-center gap-2"
                        style={{
                          height: 52,
                          background: '#25D366',
                          border: 'none',
                          borderRadius: 12,
                          fontSize: 15,
                          fontWeight: 700,
                          color: 'white',
                          cursor: 'pointer',
                          transition: 'opacity 0.2s',
                        }}
                      >
                        Continuar →
                      </button>

                      <p
                        style={{
                          fontSize: 11,
                          color: 'rgba(255,255,255,0.3)',
                          textAlign: 'center',
                          marginTop: 8,
                        }}
                      >
                        El pedido se confirma por WhatsApp
                      </p>
                    </div>
                  )}
                </motion.div>

              ) : (
                <motion.div
                  key="vista-checkout"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="flex flex-col h-full"
                >
                  <div
                    className="flex items-center gap-3 flex-shrink-0"
                    style={{
                      padding: '20px 20px 16px',
                      borderBottom: '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    <button
                      onClick={handleVolverAlCarrito}
                      className="flex items-center gap-1.5"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'rgba(255,255,255,0.55)',
                        fontSize: 13,
                        fontWeight: 500,
                        padding: 0,
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'white')}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.55)')}
                    >
                      <ChevronLeft size={14} />
                      Volver
                    </button>
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: 'white',
                        marginLeft: 4,
                      }}
                    >
                      Confirmar pedido
                    </span>
                  </div>

                  <div
                    className="flex-1 overflow-y-auto"
                    style={{ padding: '20px 20px 0' }}
                  >
                    <div
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        borderRadius: 12,
                        padding: '14px 16px',
                        marginBottom: 24,
                        border: '1px solid rgba(255,255,255,0.07)',
                      }}
                    >
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: 'rgba(255,255,255,0.35)',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          marginBottom: 10,
                        }}
                      >
                        Resumen
                      </p>
                      {items.map((item) => (
                        <div
                          key={item.producto.id}
                          className="flex justify-between items-start"
                          style={{ marginBottom: 6 }}
                        >
                          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', flex: 1, paddingRight: 8 }}>
                            {item.cantidad}× {item.producto.nombre}
                          </span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', flexShrink: 0 }}>
                            {formatearPrecioARS(item.subtotal)}
                          </span>
                        </div>
                      ))}
                      <div
                        style={{
                          borderTop: '1px solid rgba(255,255,255,0.08)',
                          marginTop: 10,
                          paddingTop: 10,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>Total</span>
                        <span style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>
                          {formatearPrecioARS(total)}
                        </span>
                      </div>
                    </div>

                    <div style={{ marginBottom: 8 }}>
                      <label
                        style={{
                          display: 'block',
                          fontSize: 11,
                          fontWeight: 700,
                          color: 'rgba(255,255,255,0.55)',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          marginBottom: 8,
                        }}
                      >
                        Tu nombre completo *
                      </label>
                      <input
                        ref={inputNombreRef}
                        type="text"
                        value={nombre}
                        onChange={(e) => {
                          setNombre(e.target.value)
                          if (mostrarError) setMostrarError(false)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !enviando) {
                            handleEnviarPedido()
                          }
                        }}
                        placeholder="Ej: Juan García"
                        style={{
                          width: '100%',
                          height: 48,
                          background: 'rgba(255,255,255,0.07)',
                          border: `1px solid ${mostrarError && !nombreEsValido(nombre) ? '#EF4444' : 'rgba(255,255,255,0.15)'}`,
                          borderRadius: 10,
                          padding: '0 16px',
                          fontSize: 15,
                          color: 'white',
                          outline: 'none',
                          boxSizing: 'border-box',
                          transition: 'border-color 0.2s, background 0.2s',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#0070C0'
                          e.target.style.background = 'rgba(255,255,255,0.10)'
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor =
                            mostrarError && !nombreEsValido(nombre)
                              ? '#EF4444'
                              : 'rgba(255,255,255,0.15)'
                          e.target.style.background = 'rgba(255,255,255,0.07)'
                        }}
                      />

                      {mostrarError && !nombreEsValido(nombre) && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{
                            fontSize: 12,
                            color: '#EF4444',
                            marginTop: 6,
                          }}
                        >
                          Por favor ingresá tu nombre completo
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <div
                    className="flex-shrink-0"
                    style={{
                      padding: '16px 20px 28px',
                      borderTop: '1px solid rgba(255,255,255,0.07)',
                      marginTop: 16,
                    }}
                  >
                    <button
                      onClick={handleEnviarPedido}
                      disabled={enviando || nombre.trim().length < 2}
                      className="w-full flex items-center justify-center gap-2"
                      style={{
                        height: 52,
                        background: '#25D366',
                        border: 'none',
                        borderRadius: 12,
                        fontSize: 15,
                        fontWeight: 700,
                        color: 'white',
                        cursor: enviando || nombre.trim().length < 2 ? 'not-allowed' : 'pointer',
                        opacity: enviando || nombre.trim().length < 2 ? 0.4 : 1,
                        transition: 'opacity 0.2s',
                      }}
                    >
                      📲 Enviar por WhatsApp
                    </button>

                    <p
                      style={{
                        fontSize: 11,
                        color: 'rgba(255,255,255,0.3)',
                        textAlign: 'center',
                        marginTop: 8,
                      }}
                    >
                      Se abrirá WhatsApp con tu pedido listo para enviar
                    </p>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
