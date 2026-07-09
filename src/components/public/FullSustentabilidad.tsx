'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Leaf, RotateCcw, Recycle, MapPin, Navigation } from 'lucide-react'

export function FullSustentabilidad() {
  return (
    <>
      {/* ══════════════════════════════════════════════
          SECCIÓN SUSTENTABILIDAD
      ══════════════════════════════════════════════ */}
      <section
        id="sustentabilidad"
        style={{
          position: 'relative',
          minHeight: '100vh',
          backgroundColor: '#3b6c4c',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: 'clamp(80px, 10vw, 120px) 0',
        }}
      >
        {/* IMAGEN LATERAL (MANOS) */}
        <div 
          style={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            width: '54%', 
            maxWidth: '600px',
            height: '80%', 
            zIndex: 0,
            opacity: 1,
          }}
        >
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image
              src="/assets/ypf imagenes/sustentabilidad.webp"
              alt="Sustentabilidad YPF Full"
              fill
              sizes="(max-width: 768px) 100vw, 54vw"
              style={{ objectFit: 'contain', objectPosition: 'right top' }}
              quality={90}
            />
          </div>
        </div>

        {/* MANDALA DECORATIVA INFERIOR IZQUIERDA */}
        <img
          src="/assets/ypf imagenes/back-3.webp"
          alt=""
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 'clamp(250px, 35vw, 450px)',
            height: 'auto',
            objectFit: 'contain',
            objectPosition: 'bottom left',
            opacity: 0.35,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* ── CONTENIDO ── */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 'var(--page-max, 1280px)',
            width: '100%',
            margin: '0 auto',
            padding: '0 var(--page-pad-x, 24px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
          }}
        >
          {/* Text content */}
          <div style={{ maxWidth: 780 }}>
            {/* TAG */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              style={{
                fontFamily: 'var(--font-caveat)',
                fontSize: 'clamp(28px, 3.5vw, 40px)',
                fontWeight: 600,
                color: '#ffffff',
                marginBottom: -10, // Acerca el tag al título
                letterSpacing: '0.02em',
                lineHeight: 1,
              }}
            >
              Sustentabilidad
            </motion.p>

            {/* TÍTULO */}
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                fontFamily: 'var(--font-din-medium)',
                fontSize: 'clamp(36px, 6vw, 68px)',
                fontWeight: 900,
                color: 'white',
                lineHeight: 1.0,
                letterSpacing: '-0.02em',
                marginBottom: 20,
                textTransform: 'uppercase',
              }}
            >
              Un compromiso<br />
              con el planeta
            </motion.h2>

            {/* PÁRRAFO INTRO */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: 'clamp(15px, 1.4vw, 17px)',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.9)',
                lineHeight: 1.6,
                marginBottom: 60,
              }}
            >
              En todas las Full, promovemos lo sustentable para reducir el
              impacto ambiental mediante acciones del día a día que generan
              un gran cambio.
            </motion.p>
          </div>

          {/* TRES PILARES - CARDS HORIZONTALES */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 24,
              width: '100%',
              marginTop: 20,
            }}
          >
            {[
              {
                titulo: 'Reducimos',
                texto: 'Mediante la utilización de bolsas ecológicas 100% reciclables, manteles sustentables fabricados con caña de azúcar sin blanqueado.',
                delay: 0.3,
              },
              {
                titulo: 'Reutilizamos',
                texto: 'Alentando la utilización de vasos térmicos de plástico o acero inoxidable y bolsas reutilizables de friselina resistentes y biodegradables.',
                delay: 0.4,
              },
              {
                titulo: 'Reciclamos',
                texto: 'Todas nuestras tiendas Full cuentan con cestos diferenciados en el salón, para gestión de materiales reciclables y desechos.',
                delay: 0.5,
              },
            ].map((pilar) => (
              <motion.div
                key={pilar.titulo}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: pilar.delay }}
                style={{
                  background: 'rgba(42, 82, 54, 0.95)', // Verde más oscuro para las cards
                  borderRadius: 16,
                  padding: '32px 24px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '18px',
                    fontWeight: 800,
                    color: 'white',
                    marginBottom: 12,
                  }}
                >
                  {pilar.titulo}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.85)',
                    lineHeight: 1.6,
                  }}
                >
                  {pilar.texto}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          MAP SECTION — YPF El Puente, Río Colorado
      ══════════════════════════════════════════════ */}
      <section
        id="mapa"
        style={{
          backgroundColor: '#000000',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          overflow: 'hidden',
        }}
      >
        {/* Top content */}
        <div
          style={{
            padding: 'clamp(60px, 8vw, 100px) clamp(24px, 5vw, 80px) 0',
            textAlign: 'center',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
              maxWidth: 700,
              margin: '0 auto',
            }}
          >
            {/* Location icon */}
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: 'rgba(0,90,156,0.15)',
                border: '1px solid rgba(0,90,156,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MapPin size={24} color="#0070C0" />
            </div>

            {/* Title */}
            <h2
              style={{
                fontFamily: 'var(--font-din-medium)',
                fontSize: 'clamp(28px, 5vw, 52px)',
                fontWeight: 900,
                color: 'white',
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                textAlign: 'center',
              }}
            >
              Encontranos en<br />
              Río Colorado
            </h2>

            {/* Subtitle */}
            <p
              style={{
                fontSize: 'clamp(15px, 1.8vw, 18px)',
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.6,
                textAlign: 'center',
                maxWidth: 500,
              }}
            >
              Ruta Nacional 22 Km 857 Y Acceso, R8138 Río Colorado, Río Negro, Patagonia Argentina.
            </p>

            {/* CTA Button — Google Maps directions */}
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=YPF+El+Puente,+Ruta+Nacional+22+Km+857,+Rio+Colorado"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                height: 56,
                padding: '0 36px',
                borderRadius: 9999,
                background: '#005A9C',
                color: 'white',
                fontSize: 16,
                fontWeight: 700,
                fontFamily: 'var(--font-montserrat)',
                textDecoration: 'none',
                transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 0 0 rgba(0,112,192,0)',
                marginBottom: 8,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.background = '#0070C0'
                el.style.transform = 'scale(1.03)'
                el.style.boxShadow = '0 8px 32px rgba(0,112,192,0.35)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.background = '#005A9C'
                el.style.transform = 'scale(1)'
                el.style.boxShadow = '0 0 0 rgba(0,112,192,0)'
              }}
            >
              <Navigation size={18} />
              Cómo llegar
            </a>

            <p
              style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.2)',
                textAlign: 'center',
                marginBottom: 32,
              }}
            >
              Se abre Google Maps en una nueva pestaña
            </p>
          </motion.div>
        </div>

        {/* Embedded Google Maps — YPF El Puente, Río Colorado */}
        <div
          style={{
            width: '100%',
            height: 'clamp(300px, 40vw, 500px)',
            position: 'relative',
            marginTop: 16,
          }}
        >
          {/* Dark overlay on the map edges */}
          <div
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: 60,
              background: 'linear-gradient(to bottom, #000000, transparent)',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />
          <iframe
            src="https://maps.google.com/maps?q=YPF+Ruta+Nacional+22+Km+857,+Rio+Colorado&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{
              border: 0,
              filter: 'invert(0.9) hue-rotate(180deg) brightness(0.7) contrast(1.1)',
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="YPF El Puente — Río Colorado, Río Negro"
          />
        </div>
      </section>
    </>
  )
}
