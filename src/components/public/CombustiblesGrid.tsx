'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Flame,
  Zap,
  ShieldCheck,
  Leaf,
  CheckCircle2,
  Cpu,
  Award,
} from 'lucide-react'
import type { Combustible } from '@/lib/supabase/types'
import { getCombustibleColor, getCombustibleImage } from '@/lib/utils/public'

/* ═══════════════════════════════════════════════════════════════
   SECTION COMBUSTIBLES — YPF OFFICIAL REPLICATED DESIGN
   ═══════════════════════════════════════════════════════════════ */

interface CombustiblesGridProps {
  combustibles: Combustible[]
}

const DEFAULT_EXTENDED_DESCRIPTIONS: Record<string, { short: string; extended: string; link?: string }> = {
  super: {
    short: 'Nafta formulada especialmente para brindar la máxima respuesta a la exigencia del motor, ayudando a su limpieza y protección.',
    extended:
      'Con 95 octanos RON y más de 84 MON, Nafta Súper ofrece una combustión equilibrada y eficiente para el uso cotidiano. Su formulación incluye agentes de limpieza que contribuyen al cuidado continuo de los inyectores, mientras que su composición sin manganeso y con bajo contenido de azufre la hace totalmente compatible con catalizadores y sistemas de control de emisiones modernos.',
  },
  infinia: {
    short: 'Nafta premium diseñada para lograr el máximo desempeño, un excelente poder de limpieza y la más alta tecnología en protección.',
    extended:
      'El combustible de máxima performance con 98 octanos RON y más de 85 MON. Incorpora la exclusiva Tecnología de Reducción de Fricción (TRF©), nuevos agentes multipropósito de última generación y el nivel de octanaje más alto del mercado. Cuenta con Certificación Internacional TOP TIER™ que garantiza el estándar más exigente de calidad.',
    link: 'https://infinia.com.ar/nafta/',
  },
  'diesel 500': {
    short: 'Combustible dirigido a motorizaciones Diesel que requieran la utilización de un producto con bajo contenido de azufre.',
    extended:
      'Diésel grado 2 con una formulación balanceada que ofrece rendimiento confiable para motores diésel de uso intensivo. Su composición está optimizada para mantener la limpieza del sistema de inyección y asegurar una combustión eficiente, con bajo contenido de azufre que protege las piezas del motor.',
  },
  'infinia diesel': {
    short: 'Combustible grado 3 premium de ultra bajo azufre especialmente diseñado para las motorizaciones diésel más exigentes.',
    extended:
      'Diésel grado 3 de máxima calidad, con número de cetano superior a 55 y la exclusiva tecnología TDM® de triple acción: protección contra el desgaste, limpieza profunda de inyectores y mayor lubricidad. Sus agentes multipropósito garantizan una combustión más completa, mayor autonomía por tanque y menor generación de emisiones, integrado al estándar EURO VI.',
    link: 'https://infinia.com.ar/diesel/',
  },
}

const PILARES_YPF = [
  {
    id: 'potencia',
    icon: Zap,
    title: 'Potencia',
    subtitle: 'Alto rendimiento y respuesta inmediata',
    content:
      'Naftas con elevado índice de octanaje (Súper 95 RON, INFINIA 98 RON) y diésel con alto número de cetano que garantizan una combustión completa. Esto se traduce en una aceleración más ágil, mayor entrega de torque y aprovechamiento óptimo de la potencia de tu motor.',
  },
  {
    id: 'cuidado-motor',
    icon: ShieldCheck,
    title: 'Cuidado del Motor',
    subtitle: 'Limpieza activa y protección anticorrosiva',
    content:
      'Formulaciones avanzadas con agentes multipropósito que limpian inyectores, válvulas y cámaras de combustión desde la primera carga. Crean un escudo protector anticorrosivo que evita la acumulación de depósitos y prolonga la vida útil del motor.',
  },
  {
    id: 'medio-ambiente',
    icon: Leaf,
    title: 'Cuidado del Medio Ambiente',
    subtitle: 'Bajas emisiones y libre de aditivos nocivos',
    content:
      'Combustibles totalmente libres de manganeso y con ultra bajo contenido de azufre, diseñados en conformidad con las normativas ambientales más estrictas. Compatibles con catalizadores y filtros de partículas de última generación.',
  },
  {
    id: 'confiabilidad',
    icon: CheckCircle2,
    title: 'Confiabilidad',
    subtitle: 'Trazabilidad y controles de calidad en cada gota',
    content:
      'Controles continuos de calidad en todo el circuito: desde la salida de refinería, terminales de despacho y 14 laboratorios zonales de verificación hasta la pistola del surtidor en nuestra estación.',
  },
  {
    id: 'tecnologia',
    icon: Cpu,
    title: 'Vanguardia Tecnológica',
    subtitle: 'Innovación argentina de clase mundial',
    content:
      'Refinación realizada en 3 complejos industriales con tecnología de vanguardia, abasteciendo el 58% del mercado de naftas y diésel de la Argentina bajo especificaciones técnicas de estándar internacional.',
  },
]

// Smooth performance-optimized animation presets
const FADE_UP_VARIANT = {
  hidden: { opacity: 0, y: 35 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: custom,
      ease: 'easeOut' as const,
    },
  }),
}

export function CombustiblesGrid({ combustibles }: CombustiblesGridProps) {
  // Filter out GNC if present
  const activeCombustibles = combustibles.filter(
    (c) => c.disponible && !c.nombre.toLowerCase().includes('gnc')
  )

  const [activePilar, setActivePilar] = useState<string | null>('potencia')

  return (
    <section
      id="combustibles"
      style={{
        background: 'linear-gradient(to bottom, #06080F 0%, #080C17 50%, #06080F 100%)',
        fontFamily: 'var(--font-din-medium), sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="py-16 md:py-28 text-white"
    >
      {/* Background Subtle Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          top: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90vw',
          height: '50vh',
          background: 'radial-gradient(ellipse at center, rgba(0, 112, 192, 0.05) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-28 md:space-y-40">
        
        {/* ═══════════════════════════════════════════════════════════════
           1. HERO SECTION — EXACT MATCH TO OFFICIAL YPF SCREENSHOT 1
           ═══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Block */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={FADE_UP_VARIANT}
            className="lg:col-span-5 space-y-4"
          >
            <span className="text-[11px] font-bold tracking-[0.25em] text-slate-400 uppercase block">
              ESTACIONES DE SERVICIO
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none">
              Combustibles
            </h1>
            <div className="w-16 h-1 bg-[#0080FF] rounded-full my-4" />
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed pt-2 max-w-lg">
              Encontrá la mejor calidad en combustibles y servicios en nuestras estaciones. Innovación y eficiencia para el mejor rendimiento de tu vehículo.
            </p>
          </motion.div>

          {/* Right Hero Image (Fuel nozzle high tech photo) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            custom={0.15}
            variants={FADE_UP_VARIANT}
            className="lg:col-span-7"
          >
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl group border border-white/10">
              <Image
                src="/assets/ypf imagenes/combustibles/infinia-turboclean-limpieza_mobile.webp"
                alt="YPF Infinia TurboClean"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
                unoptimized
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 rounded-3xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none rounded-3xl" />
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
           2. PRODUCT CARDS GRID — MATCHING SCREENSHOT 2 (BORDERLESS, BIG IMGS, PERFECT ALIGNMENT)
           ═══════════════════════════════════════════════════════════════ */}
        <div className="space-y-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={FADE_UP_VARIANT}
            className="flex items-center justify-between border-b border-white/10 pb-4"
          >
            <div>
              <span className="text-xs font-bold text-[#0080FF] uppercase tracking-wider block">Línea Oficial</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Nuestros Combustibles</h2>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 items-stretch">
            {activeCombustibles.length > 0 ? (
              activeCombustibles.map((c, index) => {
                const color = getCombustibleColor(c.nombre, c.color_hex)
                const imageSrc = getCombustibleImage(c.nombre)
                return (
                  <FuelCard
                    key={c.id}
                    combustible={c}
                    color={color}
                    imageSrc={imageSrc}
                    index={index}
                  />
                )
              })
            ) : (
              <div className="col-span-full py-12 text-center text-slate-500 italic">
                Precios no disponibles temporalmente.
              </div>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
           3. CERTIFICACIÓN TOP TIER™ BANNER
           ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={FADE_UP_VARIANT}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#091124] via-[#0F1C3F] to-[#091124] p-8 sm:p-10 shadow-2xl backdrop-blur-md"
        >
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left">
              <div className="relative shrink-0">
                <Image
                  src="/assets/ypf imagenes/combustibles/logo-top-tier.webp"
                  alt="Certificación TOP TIER"
                  width={200}
                  height={80}
                  unoptimized
                  className="h-20 sm:h-24 w-auto object-contain drop-shadow-2xl"
                />
              </div>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FFD100] uppercase tracking-wider">
                  <Award className="w-4 h-4" /> Certificación Internacional
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-snug">
                  Nuestros combustibles premium cuentan con Certificación TOP TIER™
                </h3>
                <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
                  Un programa promovido por las diez automotrices más importantes del mercado norteamericano que marcan el estándar más alto de calidad para los combustibles a nivel mundial.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════
           4. 5 PILARES YPF (WIDE ACCORDION / TABS)
           ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={FADE_UP_VARIANT}
          className="space-y-8"
        >
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#0080FF] uppercase tracking-wider block mb-1">
              Compromiso de Calidad
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Los 5 Pilares de Combustibles YPF
            </h3>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Tecnología e innovación aplicada para potenciar, cuidar y proteger cada viaje.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left selector buttons */}
            <div className="lg:col-span-5 space-y-3">
              {PILARES_YPF.map((pilar) => {
                const Icon = pilar.icon
                const isActive = activePilar === pilar.id
                return (
                  <button
                    key={pilar.id}
                    onClick={() => setActivePilar(pilar.id)}
                    className={`w-full flex items-center justify-between p-4 sm:p-5 rounded-2xl text-left transition-all duration-300 border ${
                      isActive
                        ? 'bg-gradient-to-r from-[#005A9C]/30 to-[#0070C0]/15 border-[#0080FF]/50 text-white shadow-xl'
                        : 'bg-white/[0.02] border-white/5 text-slate-400 hover:bg-white/[0.05] hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-xl border transition-colors ${
                          isActive
                            ? 'bg-[#0070C0]/30 border-[#0080FF]/50 text-[#FFD100]'
                            : 'bg-white/5 border-white/10 text-slate-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-base text-white">{pilar.title}</div>
                        <div className="text-xs text-slate-400 line-clamp-1">{pilar.subtitle}</div>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isActive ? 'rotate-180 text-[#0080FF]' : 'text-slate-500'
                      }`}
                    />
                  </button>
                )
              })}
            </div>

            {/* Right details box */}
            <div className="lg:col-span-7">
              <div className="h-full min-h-[300px] p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0E1626] to-[#0A0F1D] border border-white/10 flex flex-col justify-center relative overflow-hidden shadow-2xl">
                <div className="absolute right-0 top-0 w-64 h-64 bg-[#0070C0]/10 rounded-full blur-3xl pointer-events-none" />
                <AnimatePresence mode="wait">
                  {PILARES_YPF.filter((p) => p.id === activePilar).map((pilar) => {
                    const Icon = pilar.icon
                    return (
                      <motion.div
                        key={pilar.id}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-5 relative z-10"
                      >
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#0070C0]/20 border border-[#0080FF]/30 text-[#0080FF] text-xs font-bold">
                          <Icon className="w-4 h-4 text-[#FFD100]" />
                          {pilar.title}
                        </div>
                        <h4 className="text-2xl sm:text-3xl font-black text-white">
                          {pilar.subtitle}
                        </h4>
                        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                          {pilar.content}
                        </p>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════
           5. PRODUCTOS ESPECIALES & SITIOS OFICIALES — PROPORTIONAL & CRISP LOGO WEBP IMAGES WITH SMOOTH ENTRANCE ANIMATIONS
           ═══════════════════════════════════════════════════════════════ */}
        <div className="space-y-16 pt-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={FADE_UP_VARIANT}
            className="border-b border-white/10 pb-4"
          >
            <span className="text-xs font-bold text-[#0080FF] uppercase tracking-wider block">Sitios Oficiales YPF</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Líneas Especializadas y Productos Premium</h2>
          </motion.div>

          <div className="space-y-24 md:space-y-32">
            
            {/* ── ROW 1: ELAION AURO (Image Left, Info Right) ── */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={FADE_UP_VARIANT}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              {/* Image Left: logo-elaion-auro.webp at natural crisp dimensions with rounded corners */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[440px] aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl group border border-white/10">
                  <Image
                    src="/assets/ypf imagenes/combustibles/logo-elaion-auro.webp"
                    alt="Logo ELAION AURO"
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 440px"
                    className="object-cover object-center rounded-3xl group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
              {/* Info Right */}
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0070C0]/15 border border-[#0080FF]/30 text-[#0080FF] text-xs font-bold">
                  Lubricación Premium
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-white">Línea ELAION AURO</h3>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
                  Desarrollada con Anti-Stress Technology®, ELAION AURO es la línea de lubricantes de mayor tecnología del mercado, asegurando máxima protección y rendimiento del motor frente a las exigencias más extremas.
                </p>
                <div className="pt-2">
                  <a
                    href="https://elaion.com.ar/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#0080FF] hover:bg-[#0066CC] text-white font-bold text-sm transition-all shadow-lg hover:shadow-blue-500/25"
                  >
                    <span>Conocé ELAION en el sitio oficial</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* ── ROW 2: LÍNEA RÖD (Info Left, Image Right) ── */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={FADE_UP_VARIANT}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              {/* Info Left */}
              <div className="lg:col-span-7 space-y-4 order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0070C0]/15 border border-[#0080FF]/30 text-[#0080FF] text-xs font-bold">
                  Motos & Cuatris
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-white">Línea Especializada RÖD</h3>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
                  Línea de lubricantes diseñada para motocicletas y cuatriciclos con motores de 2 y 4 tiempos. Grados de viscosidad adaptados para la intensa conducción urbana, los largos viajes en ruta o la competición.
                </p>
                <div className="pt-2">
                  <a
                    href="https://lubricantes.ypf.com/rod.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#0080FF] hover:bg-[#0066CC] text-white font-bold text-sm transition-all shadow-lg hover:shadow-blue-500/25"
                  >
                    <span>Ver catálogo oficial RÖD</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
              {/* Image Right: logo-rod.webp at natural crisp dimensions with rounded corners */}
              <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
                <div className="relative w-full max-w-[440px] aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl group border border-white/10">
                  <Image
                    src="/assets/ypf imagenes/combustibles/logo-rod.webp"
                    alt="Logo RÖD"
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 440px"
                    className="object-cover object-center rounded-3xl group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </motion.div>

            {/* ── ROW 3: INFINIA NAFTA (Image Left, Info Right) ── */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={FADE_UP_VARIANT}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              {/* Image Left: logo-infinia-nafta-turboclean.webp at natural crisp dimensions with rounded corners */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[440px] aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl group border border-white/10">
                  <Image
                    src="/assets/ypf imagenes/combustibles/logo-infinia-nafta-turboclean.webp"
                    alt="Logo INFINIA Nafta TurboClean"
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 440px"
                    className="object-cover object-center rounded-3xl group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
              {/* Info Right */}
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0070C0]/15 border border-[#0080FF]/30 text-[#0080FF] text-xs font-bold">
                  Máxima Performance
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-white">INFINIA Nafta</h3>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
                  El combustible inteligente de YPF que combina una innovadora tecnología de reducción de fricción (TRF©), nuevos agentes multipropósito y el máximo nivel de octanos (98 RON) con certificación internacional TOP TIER™.
                </p>
                <div className="pt-2">
                  <a
                    href="https://infinia.com.ar/nafta/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#0080FF] hover:bg-[#0066CC] text-white font-bold text-sm transition-all shadow-lg hover:shadow-blue-500/25"
                  >
                    <span>Sitio Oficial INFINIA Nafta</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* ── ROW 4: INFINIA DIESEL (Info Left, Image Right) ── */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={FADE_UP_VARIANT}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              {/* Info Left */}
              <div className="lg:col-span-7 space-y-4 order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0070C0]/15 border border-[#0080FF]/30 text-[#0080FF] text-xs font-bold">
                  Ultra Bajo Azufre
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-white">INFINIA Diesel</h3>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
                  Asegura máxima limpieza, eficiencia, potencia y rendimiento. Formulación de alta calidad internacional integrada al estándar EURO VI con tecnología TDM® de triple acción y cetano 55+.
                </p>
                <div className="pt-2">
                  <a
                    href="https://infinia.com.ar/diesel/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#0080FF] hover:bg-[#0066CC] text-white font-bold text-sm transition-all shadow-lg hover:shadow-blue-500/25"
                  >
                    <span>Sitio Oficial INFINIA Diesel</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
              {/* Image Right: logo-infinia-diesel-turboclean.webp at natural crisp dimensions with rounded corners */}
              <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
                <div className="relative w-full max-w-[440px] aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl group border border-white/10">
                  <Image
                    src="/assets/ypf imagenes/combustibles/logo-infinia-diesel-turboclean.webp"
                    alt="Logo INFINIA Diesel TurboClean"
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 440px"
                    className="object-cover object-center rounded-3xl group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   BORDERLESS PRODUCT CARD (EXACT MATCH TO YPF OFFICIAL SCREENSHOT 2)
   ═══════════════════════════════════════════════════════════════ */

function FuelCard({
  combustible,
  color,
  imageSrc,
  index,
}: {
  combustible: Combustible
  color: string
  imageSrc: string
  index: number
}) {
  const [expanded, setExpanded] = useState(false)

  // Find matching default text key
  const lowerName = combustible.nombre.toLowerCase()
  let defaultData = DEFAULT_EXTENDED_DESCRIPTIONS.super
  if (lowerName.includes('infinia') && lowerName.includes('diesel')) {
    defaultData = DEFAULT_EXTENDED_DESCRIPTIONS['infinia diesel']
  } else if (lowerName.includes('infinia')) {
    defaultData = DEFAULT_EXTENDED_DESCRIPTIONS.infinia
  } else if (lowerName.includes('500') || lowerName.includes('diesel')) {
    defaultData = DEFAULT_EXTENDED_DESCRIPTIONS['diesel 500']
  }

  const shortDesc = combustible.descripcion || defaultData.short
  const extendedDesc = combustible.descripcion_extendida || defaultData.extended
  const externalLink = defaultData.link

  const cleanNombre = combustible.nombre.replace(/Nafta\s+/gi, '')

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-30px' }}
      custom={index * 0.1}
      variants={FADE_UP_VARIANT}
      className="flex flex-col justify-between h-full group cursor-default"
    >
      <div className="flex flex-col flex-1">
        {/* Top Product Image Container with rounded corners (No Card Frame!) */}
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#0D1424] border border-white/10 group-hover:border-white/20 transition-all shadow-xl shrink-0">
          <Image
            src={imageSrc}
            alt={combustible.nombre}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-2xl"
          />

          {/* Top Left Badge chip matching YPF "Retail" badge */}
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 text-slate-950 text-[11px] font-extrabold tracking-wide shadow-md backdrop-blur-md">
            Retail
          </div>

          {/* Octanaje badge if present */}
          {combustible.octanaje && (
            <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-md bg-black/60 text-white border border-white/20 text-[10px] font-black tracking-wider backdrop-blur-md">
              {combustible.octanaje}
            </div>
          )}
        </div>

        {/* Product Info below image */}
        <div className="mt-4 flex flex-col flex-1 justify-between">
          <div className="space-y-2">
            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {combustible.nombre.toLowerCase().includes('infinia') ? combustible.nombre : `Nafta ${cleanNombre}`}
            </h3>

            {/* Price Tag */}
            <div className="flex items-baseline gap-1 text-[#FFD100]">
              {typeof combustible.precio === 'number' && combustible.precio > 0 ? (
                <>
                  <span className="text-sm font-bold">$</span>
                  <span className="text-2xl font-black tracking-tight leading-none">
                    {combustible.precio.toLocaleString('es-AR', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-xs font-bold opacity-80">/L</span>
                </>
              ) : (
                <span className="text-2xl font-black tracking-tight leading-none">
                  Consultar
                </span>
              )}
            </div>

            {/* Fixed Min-Height Description area so Leer más is horizontally aligned */}
            <div className="min-h-[52px]">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                {shortDesc}
              </p>
            </div>

            {/* Extended Description Expandable */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 pt-3 border-t border-white/10 text-xs text-slate-300 leading-relaxed bg-white/[0.03] p-3 rounded-xl border border-white/5">
                    {extendedDesc}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Fixed Baseline Action links (Leer más & Sitio Oficial aligned horizontally across all cards) */}
      <div className="mt-4 pt-2 border-t border-white/5 space-y-1.5 shrink-0">
        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0080FF] hover:text-blue-400 transition-colors py-1"
        >
          <span>{expanded ? 'Leer menos' : 'Leer más'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <div className="h-5 flex items-center">
          {externalLink ? (
            <a
              href={externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-[#0080FF] transition-colors"
            >
              <span>Sitio Oficial</span>
              <ExternalLink className="w-3 h-3 text-[#0080FF]" />
            </a>
          ) : (
            <div className="h-4" />
          )}
        </div>
      </div>
    </motion.div>
  )
}
