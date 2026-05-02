import LandingScripts from '@/components/LandingScripts'

export const metadata = {
  title: 'FlavorSync — El Gemelo Digital de la Alta Cocina',
  description:
    'FlavorSync — Gemelos digitales fotorrealistas para restaurantes premium. WebAR sin apps. Mostrá el plato exacto antes de pedirlo.',
}

export default function LandingPage() {
  return (
    <>
      {/* ============ Aurora background ============ */}
      <div className="aurora" aria-hidden="true">
        <div className="aurora__layer aurora__layer--1"></div>
        <div className="aurora__layer aurora__layer--2"></div>
        <div className="aurora__layer aurora__layer--3"></div>
        <div className="grid-overlay"></div>
        <div className="noise"></div>
      </div>

      {/* ============ NAV ============ */}
      <header className="nav" id="nav">
        <a className="nav__brand" href="#top" aria-label="FlavorSync inicio">
          <span className="nav__logo">
            <img src="/assets/flavorsync-logo.jpeg" alt="FlavorSync" />
          </span>
          <span className="nav__name">FlavorSync</span>
        </a>

        <nav className="nav__links" aria-label="Navegación principal">
          <a href="#proceso">Proceso</a>
          <a href="#ventajas">Ventajas</a>
          <a href="#showcase">Showcase</a>
          <a href="#impacto">Impacto</a>
        </nav>

        <a className="nav__cta" href="#contacto">
          <span>Solicitar demo</span>
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </header>

      <main id="top">
        {/* ============ HERO ============ */}
        <section className="hero">
          <div className="hero__inner">
            <div className="hero__pill" data-reveal>
              <span className="dot"></span>
              <span>WebAR · Sin apps · Fotorrealismo verificado</span>
            </div>

            <h1 className="hero__title" data-reveal>
              El <em>gemelo digital</em>
              <br />
              de la <span className="grad">alta cocina</span>.
            </h1>

            <p className="hero__sub" data-reveal>
              Tus comensales ven el plato exacto, en tamaño real, sobre su mesa — antes de
              pedirlo. Cero fricción, cero apps, máxima precisión.
            </p>

            <div className="hero__ctas" data-reveal>
              <a className="btn btn--primary" href="#contacto">
                <span>Solicitá una demostración de escaneo</span>
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a className="btn btn--ghost" href="#proceso">
                Ver el proceso
              </a>
            </div>

            <div className="hero__meta" data-reveal>
              <div>
                <strong>+38%</strong>
                <span>tasa de selección de platos destacados</span>
              </div>
              <div>
                <strong>0 apps</strong>
                <span>se abre con la cámara del celular</span>
              </div>
              <div>
                <strong>PBR</strong>
                <span>texturas fotorrealistas por plato</span>
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="hero__stage" aria-hidden="true">
            <div className="stage-glow"></div>
            <div className="orbit orbit--1"></div>
            <div className="orbit orbit--2"></div>
            <div className="orbit orbit--3"></div>
            <div className="hero__logo">
              <img src="/assets/flavorsync-logo.jpeg" alt="FlavorSync" />
            </div>
            <div className="dish-shadow"></div>
          </div>

          <a className="hero__scroll" href="#proceso" aria-label="Bajar al proceso">
            <span></span>
          </a>
        </section>

        {/* ============ TRUST BAR ============ */}
        <section className="trust">
          <div className="trust__label">Confianza para marcas que no se conforman con menos</div>
          <div className="trust__row" aria-hidden="true">
            <div className="trust__track">
              <span>Restaurantes 5★</span>
              <span>·</span>
              <span>Hoteles Boutique</span>
              <span>·</span>
              <span>Cadenas Gourmet</span>
              <span>·</span>
              <span>Wine Bars</span>
              <span>·</span>
              <span>Steakhouses</span>
              <span>·</span>
              <span>Omakase</span>
              <span>·</span>
              <span>Restaurantes 5★</span>
              <span>·</span>
              <span>Hoteles Boutique</span>
              <span>·</span>
              <span>Cadenas Gourmet</span>
              <span>·</span>
              <span>Wine Bars</span>
              <span>·</span>
              <span>Steakhouses</span>
              <span>·</span>
              <span>Omakase</span>
              <span>·</span>
            </div>
          </div>
        </section>

        {/* ============ SCROLL SEQUENCE ============ */}
        <section className="sequence" id="proceso">
          <div className="section-head" data-reveal>
            <div className="eyebrow">
              <span className="eyebrow__line"></span>El proceso
              <span className="eyebrow__line"></span>
            </div>
            <h2>Cuatro pasos. Cero fricción.</h2>
            <p>
              De explorar el menú a ver el plato en tamaño real sobre la mesa — sin descargar
              nada, directo desde el navegador.
            </p>
          </div>

          <div className="sequence__sticky">
            <div className="sequence__stage">
              {/* Restaurant table backdrop */}
              <div className="table-bg" aria-hidden="true">
                <div className="table-bg__cloth"></div>
                <div className="table-bg__cutlery cutlery--left"></div>
                <div className="table-bg__cutlery cutlery--right"></div>
              </div>

              {/* Dotted guide rail */}
              <svg
                className="rail"
                viewBox="0 0 1200 700"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M120 350 C 350 200, 600 500, 1080 350"
                  stroke="#2c84ff"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="2 10"
                  strokeLinecap="round"
                />
              </svg>

              {/* Panel 1: Browse the menu */}
              <div className="panel panel--1" data-panel="1">
                <div className="phone">
                  <div className="phone__notch"></div>
                  <div className="phone__screen phone__screen--app">
                    <div className="bph-header">
                      <span className="bph-brand">MENÚ</span>
                      <div className="bph-cats">
                        <span className="bph-cat bph-cat--on">PRINCIPALES</span>
                        <span className="bph-cat">ENTRADAS</span>
                        <span className="bph-cat">POSTRES</span>
                      </div>
                    </div>
                    <div className="bph-list">
                      <div className="bph-item">
                        <div className="bph-thumb bph-thumb--1"></div>
                        <div className="bph-text">
                          <b>Risotto de Hongos</b>
                          <small>Carnaroli, trufa, manteca</small>
                          <span>$22.000</span>
                        </div>
                        <div className="bph-ar-icon">
                          <svg viewBox="0 0 24 24" width="10" height="10">
                            <path
                              d="M2 8V4h4M18 4h4v4M4 18v4H2M22 18v4h-4"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="bph-item">
                        <div className="bph-thumb bph-thumb--2"></div>
                        <div className="bph-text">
                          <b>Bife de Chorizo</b>
                          <small>300g, guarnición estación</small>
                          <span>$34.000</span>
                        </div>
                        <div className="bph-ar-icon">
                          <svg viewBox="0 0 24 24" width="10" height="10">
                            <path
                              d="M2 8V4h4M18 4h4v4M4 18v4H2M22 18v4h-4"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="bph-item">
                        <div className="bph-thumb bph-thumb--3"></div>
                        <div className="bph-text">
                          <b>Vieiras a la Trufa</b>
                          <small>Vieiras, salsa trufada</small>
                          <span>$38.000</span>
                        </div>
                        <div className="bph-ar-icon">
                          <svg viewBox="0 0 24 24" width="10" height="10">
                            <path
                              d="M2 8V4h4M18 4h4v4M4 18v4H2M22 18v4h-4"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="bph-item">
                        <div className="bph-thumb bph-thumb--4"></div>
                        <div className="bph-text">
                          <b>Langostinos al Ajillo</b>
                          <small>Aceite de oliva y ajo</small>
                          <span>$29.000</span>
                        </div>
                        <div className="bph-ar-icon">
                          <svg viewBox="0 0 24 24" width="10" height="10">
                            <path
                              d="M2 8V4h4M18 4h4v4M4 18v4H2M22 18v4h-4"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="panel__caption">
                  <span className="step">01</span>
                  <h3>Recorre el menú</h3>
                  <p>
                    El comensal escanea el QR y navega el menú digital desde su celular. Fotos
                    reales, descripciones y precios — siempre actualizados al instante.
                  </p>
                </div>
              </div>

              {/* Panel 2: Select a dish */}
              <div className="panel panel--2" data-panel="2">
                <div className="phone">
                  <div className="phone__notch"></div>
                  <div className="phone__screen phone__screen--app">
                    <div className="bph-header">
                      <span className="bph-brand">MENÚ</span>
                      <div className="bph-cats">
                        <span className="bph-cat bph-cat--on">PRINCIPALES</span>
                      </div>
                    </div>
                    <div className="bph-list bph-list--static">
                      <div className="bph-item">
                        <div className="bph-thumb bph-thumb--1"></div>
                        <div className="bph-text">
                          <b>Risotto de Hongos</b>
                          <span>$22.000</span>
                        </div>
                      </div>
                      <div className="bph-item bph-item--selected">
                        <div className="bph-thumb bph-thumb--3"></div>
                        <div className="bph-text">
                          <b>Vieiras a la Trufa</b>
                          <span>$38.000</span>
                        </div>
                        <div className="tap-ring"></div>
                      </div>
                      <div className="bph-item">
                        <div className="bph-thumb bph-thumb--4"></div>
                        <div className="bph-text">
                          <b>Langostinos al Ajillo</b>
                          <span>$29.000</span>
                        </div>
                      </div>
                    </div>
                    <div className="ar-trigger">
                      <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
                        <path
                          d="M2 8V4h4M18 4h4v4M4 18v4H2M22 18v4h-4"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span>Ver en Realidad Aumentada</span>
                    </div>
                  </div>
                </div>
                <div className="panel__caption">
                  <span className="step">02</span>
                  <h3>Elegí lo que te conquista</h3>
                  <p>Con un toque, el comensal accede a la experiencia de realidad aumentada del plato que eligió.</p>
                </div>
              </div>

              {/* Panel 3: Aim at table */}
              <div className="panel panel--3" data-panel="3">
                <div className="phone">
                  <div className="phone__notch"></div>
                  <div className="phone__screen">
                    <div className="reticle">
                      <span className="reticle__corner tl"></span>
                      <span className="reticle__corner tr"></span>
                      <span className="reticle__corner bl"></span>
                      <span className="reticle__corner br"></span>
                      <div className="reticle__center"></div>
                      <div className="reticle__sweep"></div>
                    </div>
                    <div className="motion-hint">
                      <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
                        <path
                          d="M12 19V5M5 12l7-7 7 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Mové levemente el celular
                    </div>
                    <div className="phone__hint">Detectando superficie...</div>
                  </div>
                </div>
                <div className="panel__caption">
                  <span className="step">03</span>
                  <h3>Apuntá a la mesa</h3>
                  <p>
                    Enfoca la superficie con la cámara y mové levemente el celular. Sin instalar
                    apps. Funciona desde el navegador de cualquier celular moderno.
                  </p>
                </div>
              </div>

              {/* Panel 4: Dish materializes in AR */}
              <div className="panel panel--4" data-panel="4">
                <div className="dish">
                  <div className="dish__plate">
                    <div className="dish__food">
                      <div className="scallop s1"></div>
                      <div className="scallop s2"></div>
                      <div className="scallop s3"></div>
                      <div className="truffle t1"></div>
                      <div className="truffle t2"></div>
                      <div className="microgreen m1"></div>
                      <div className="microgreen m2"></div>
                      <div className="sauce-dot sd1"></div>
                      <div className="sauce-dot sd2"></div>
                      <div className="sauce-dot sd3"></div>
                      <div className="oil-shine"></div>
                    </div>
                    <div className="dish__rim"></div>
                  </div>
                  <div className="dish__shadow"></div>
                  <div className="dish__ar-ring"></div>
                  <div className="dish__verified">
                    <svg viewBox="0 0 24 24" width="14" height="14">
                      <path
                        d="M5 12l4 4 10-10"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Verificado como real
                  </div>
                </div>
                <div className="panel__caption">
                  <span className="step">04</span>
                  <h3>El plato aparece frente a vos</h3>
                  <p>
                    Tamaño real. Fotorrealismo puro. El comensal lo ve exactamente como llegará
                    a su mesa — antes de pedir.
                  </p>
                </div>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="sequence__progress" aria-hidden="true">
              <div className="prog__step active">
                <i></i>
                <span>01</span>
              </div>
              <div className="prog__step">
                <i></i>
                <span>02</span>
              </div>
              <div className="prog__step">
                <i></i>
                <span>03</span>
              </div>
              <div className="prog__step">
                <i></i>
                <span>04</span>
              </div>
              <div className="prog__bar">
                <div className="prog__fill"></div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ VENTAJAS ============ */}
        <section className="features" id="ventajas">
          <div className="section-head" data-reveal>
            <div className="eyebrow">
              <span className="eyebrow__line"></span>Por qué FlavorSync
              <span className="eyebrow__line"></span>
            </div>
            <h2>
              No es AR básica.
              <br />
              Es <span className="grad">precisión gastronómica.</span>
            </h2>
          </div>

          <div className="features__grid">
            <article className="feature" data-reveal>
              <div className="feature__icon">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M3 7l9-4 9 4-9 4-9-4z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    fill="none"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 12l9 4 9-4M3 17l9 4 9-4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    fill="none"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Fotorrealismo puro</h3>
              <p>
                Texturas PBR fotorrealistas, iluminación basada físicamente y sombras reales. Cada
                plato es un <em>digital twin</em>, no una caricatura 3D.
              </p>
            </article>

            <article className="feature" data-reveal>
              <div className="feature__icon">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" fill="none" />
                  <path
                    d="M12 7v5l3 2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3>Cero fricción</h3>
              <p>
                WebAR nativo: el comensal escanea el QR y la experiencia se abre en su navegador.{' '}
                <strong>No instala nada.</strong>
              </p>
            </article>

            <article className="feature" data-reveal>
              <div className="feature__icon">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M13 3L4 14h7l-1 7 9-11h-7l1-7z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    fill="none"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Rendimiento de élite</h3>
              <p>
                Modelos de alta calidad que cargan en sub-segundo en cualquier celular moderno.
                Cero excusas técnicas, cero esperas.
              </p>
            </article>

            <article className="feature feature--highlight" data-reveal>
              <div className="feature__icon">
                <svg viewBox="0 0 24 24">
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    fill="none"
                  />
                  <path
                    d="M3 9h18M8 14h8"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3>Menú 100% dinámico</h3>
              <p>
                Agregá platos, nuevas categorías y actualizá precios al instante desde el panel de
                administración. <em>Más rápido y económico que imprimir un menú nuevo</em> — y tus
                comensales siempre ven la versión más reciente.
              </p>
            </article>

            <article className="feature" data-reveal>
              <div className="feature__icon">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" fill="none" />
                </svg>
              </div>
              <h3>Identidad de tu marca</h3>
              <p>
                Tipografías, paleta, fotografía y tono. Hasta el último degradé respira la
                estética de tu restaurante.
              </p>
            </article>

            <article className="feature" data-reveal>
              <div className="feature__icon">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M3 12c4-7 14-7 18 0-4 7-14 7-18 0z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    fill="none"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" fill="none" />
                </svg>
              </div>
              <h3>Inteligencia visual</h3>
              <p>
                Dashboard con qué platos miran más, cuáles convierten y dónde el comensal duda.
                Decisiones de carta basadas en datos.
              </p>
            </article>
          </div>
        </section>

        {/* ============ SHOWCASE / CUSTOMIZATION ============ */}
        <section className="showcase" id="showcase">
          <div className="section-head" data-reveal>
            <div className="eyebrow">
              <span className="eyebrow__line"></span>Personalización total
              <span className="eyebrow__line"></span>
            </div>
            <h2>
              Una plataforma.
              <br />
              <span className="grad">Infinitas estéticas.</span>
            </h2>
            <p>
              Mismo motor, diferentes universos. Adaptamos cada experiencia al ADN visual del
              cliente — desde el fine dining más sobrio hasta la pizzería más vibrante.
            </p>
          </div>

          <div className="showcase__tabs" role="tablist" aria-label="Variantes de menú">
            <button className="tab is-active" role="tab" aria-selected="true" data-theme="lux">
              Fine Dining
            </button>
            <button className="tab" role="tab" aria-selected="false" data-theme="trattoria">
              Trattoria
            </button>
            <button className="tab" role="tab" aria-selected="false" data-theme="sushi">
              Omakase
            </button>
            <button className="tab" role="tab" aria-selected="false" data-theme="burger">
              Casual / Burger
            </button>
            <button className="tab" role="tab" aria-selected="false" data-theme="cafe">
              Café Specialty
            </button>
          </div>

          <div className="showcase__viewer" id="showcaseViewer">
            {/* LUX (current real menu vibe) */}
            <div className="theme theme--lux is-active" data-theme="lux">
              <div className="device device--cover">
                <div className="device__screen menu menu--lux">
                  <div className="menu__brand">
                    <span className="brand-mark brand-mark--lux">L</span>
                    <span className="brand-name">LUMIÈRE</span>
                  </div>
                  <h4 className="menu__title">
                    CARTA
                    <br />
                    INTERACTIVA
                  </h4>
                  <span className="menu__divider"></span>
                  <p className="menu__sub">Experiencia gastronómica en 3D</p>
                  <ul className="menu__cats">
                    <li>
                      <h5>BEBIDAS</h5>
                      <span>Vinos, cócteles y más</span>
                    </li>
                    <li className="active">
                      <h5>COMIDAS PRINCIPALES</h5>
                      <span>Platos principales y entrantes</span>
                      <i></i>
                    </li>
                    <li>
                      <h5>ENTRADAS</h5>
                      <span>Para empezar</span>
                    </li>
                    <li>
                      <h5>POSTRES</h5>
                      <span>Dulces tentaciones</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="device device--list">
                <div className="device__screen menu menu--lux">
                  <div className="chips">
                    <span className="chip">PRINCIPALES</span>
                    <span className="chip">PIZZAS</span>
                    <span className="chip chip--active">ESPECIALIDADES</span>
                  </div>
                  <div className="menu__divider menu__divider--label">ESPECIALIDADES</div>
                  <div className="dish-row">
                    <div className="dish-row__icon"></div>
                    <div className="dish-row__body">
                      <h6>
                        Empanadas de Carne <span className="badge badge--chef">★ CHEF</span>
                      </h6>
                      <p>Empanada clásica de carne cortada a cuchillo</p>
                    </div>
                    <div className="dish-row__price">$6.000,00</div>
                  </div>
                  <div className="dish-row">
                    <div className="dish-row__icon"></div>
                    <div className="dish-row__body">
                      <h6>
                        Risotto de Hongos <span className="tag tag--veg"></span>
                        <span className="tag tag--sf"></span>
                      </h6>
                      <p>Arroz carnaroli con mix de hongos y manteca trufada.</p>
                    </div>
                    <div className="dish-row__price">$22.000,00</div>
                  </div>
                  <div className="menu__divider menu__divider--label">PIZZAS DE AUTOR</div>
                  <div className="dish-row">
                    <div className="dish-row__icon"></div>
                    <div className="dish-row__body">
                      <h6>
                        Pizza de Salchicha Parrillera <span className="tag tag--veg"></span>
                      </h6>
                      <p>Mozzarella, salchicha desarmada y morrones a leña.</p>
                    </div>
                    <div className="dish-row__price">$18.500,00</div>
                  </div>
                </div>
              </div>
            </div>

            {/* TRATTORIA */}
            <div className="theme theme--trattoria" data-theme="trattoria">
              <div className="device device--cover">
                <div className="device__screen menu menu--trattoria">
                  <div className="menu__brand">
                    <span className="brand-mark brand-mark--tr">N</span>
                    <span className="brand-name">NONNA ROSA</span>
                  </div>
                  <h4 className="menu__title">
                    LA NOSTRA
                    <br />
                    CUCINA
                  </h4>
                  <span className="menu__divider"></span>
                  <p className="menu__sub">Ricette di famiglia · 1962</p>
                  <ul className="menu__cats">
                    <li className="active">
                      <h5>PASTA FRESCA</h5>
                      <span>Hecha cada mañana</span>
                      <i></i>
                    </li>
                    <li>
                      <h5>ANTIPASTI</h5>
                      <span>Para compartir</span>
                    </li>
                    <li>
                      <h5>SECONDI</h5>
                      <span>Carnes y pescados</span>
                    </li>
                    <li>
                      <h5>DOLCI</h5>
                      <span>Tiramisu &amp; más</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="device device--list">
                <div className="device__screen menu menu--trattoria">
                  <div className="chips">
                    <span className="chip">PASTA</span>
                    <span className="chip chip--active">PIZZA AL FORNO</span>
                    <span className="chip">RISOTTI</span>
                  </div>
                  <div className="menu__divider menu__divider--label">PIZZA AL FORNO</div>
                  <div className="dish-row">
                    <div className="dish-row__icon"></div>
                    <div className="dish-row__body">
                      <h6>
                        Margherita D.O.P. <span className="badge badge--chef">★ NONNA</span>
                      </h6>
                      <p>San Marzano, mozzarella di bufala, albahaca fresca.</p>
                    </div>
                    <div className="dish-row__price">$14.500</div>
                  </div>
                  <div className="dish-row">
                    <div className="dish-row__icon"></div>
                    <div className="dish-row__body">
                      <h6>Quattro Formaggi</h6>
                      <p>Mozzarella, gorgonzola, parmesano, fontina.</p>
                    </div>
                    <div className="dish-row__price">$16.800</div>
                  </div>
                  <div className="dish-row">
                    <div className="dish-row__icon"></div>
                    <div className="dish-row__body">
                      <h6>Tartufo Bianco</h6>
                      <p>Crema de hongos, mozzarella fior di latte, trufa.</p>
                    </div>
                    <div className="dish-row__price">$22.000</div>
                  </div>
                </div>
              </div>
            </div>

            {/* SUSHI */}
            <div className="theme theme--sushi" data-theme="sushi">
              <div className="device device--cover">
                <div className="device__screen menu menu--sushi">
                  <div className="menu__brand">
                    <span className="brand-mark brand-mark--su">禅</span>
                    <span className="brand-name">ZEN OMAKASE</span>
                  </div>
                  <h4 className="menu__title">
                    OMAKASE
                    <br />
                    PRECISION
                  </h4>
                  <span className="menu__divider"></span>
                  <p className="menu__sub">Edomae · 13 piezas · Chef Tanaka</p>
                  <ul className="menu__cats">
                    <li className="active">
                      <h5>NIGIRI</h5>
                      <span>Selección del día</span>
                      <i></i>
                    </li>
                    <li>
                      <h5>SASHIMI</h5>
                      <span>Cortes premium</span>
                    </li>
                    <li>
                      <h5>ROLLS</h5>
                      <span>De autor</span>
                    </li>
                    <li>
                      <h5>SAKE</h5>
                      <span>Junmai · Daiginjo</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="device device--list">
                <div className="device__screen menu menu--sushi">
                  <div className="chips">
                    <span className="chip">NIGIRI</span>
                    <span className="chip chip--active">SASHIMI</span>
                    <span className="chip">SPECIAL</span>
                  </div>
                  <div className="menu__divider menu__divider--label">SASHIMI</div>
                  <div className="dish-row">
                    <div className="dish-row__icon"></div>
                    <div className="dish-row__body">
                      <h6>
                        Otoro <span className="badge badge--chef">★ CHEF</span>
                      </h6>
                      <p>Atún rojo, parte ventral, 5 cortes.</p>
                    </div>
                    <div className="dish-row__price">¥4.800</div>
                  </div>
                  <div className="dish-row">
                    <div className="dish-row__icon"></div>
                    <div className="dish-row__body">
                      <h6>Hirame Engawa</h6>
                      <p>Lenguado madurado 48h.</p>
                    </div>
                    <div className="dish-row__price">¥3.200</div>
                  </div>
                  <div className="dish-row">
                    <div className="dish-row__icon"></div>
                    <div className="dish-row__body">
                      <h6>Uni Hokkaido</h6>
                      <p>Erizo del norte, presentación tradicional.</p>
                    </div>
                    <div className="dish-row__price">¥5.500</div>
                  </div>
                </div>
              </div>
            </div>

            {/* BURGER */}
            <div className="theme theme--burger" data-theme="burger">
              <div className="device device--cover">
                <div className="device__screen menu menu--burger">
                  <div className="menu__brand">
                    <span className="brand-mark brand-mark--bg">B</span>
                    <span className="brand-name">BIG BITE CO.</span>
                  </div>
                  <h4 className="menu__title">
                    SMASH
                    <br />
                    SEASON
                  </h4>
                  <span className="menu__divider"></span>
                  <p className="menu__sub">Hand-crafted · Argentina · 100% Angus</p>
                  <ul className="menu__cats">
                    <li className="active">
                      <h5>SMASH BURGERS</h5>
                      <span>Lo más pedido</span>
                      <i></i>
                    </li>
                    <li>
                      <h5>SIDES</h5>
                      <span>Papas locas, onion rings</span>
                    </li>
                    <li>
                      <h5>SHAKES</h5>
                      <span>Hechos a mano</span>
                    </li>
                    <li>
                      <h5>BREWS</h5>
                      <span>Cerveza tirada</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="device device--list">
                <div className="device__screen menu menu--burger">
                  <div className="chips">
                    <span className="chip chip--active">SMASH</span>
                    <span className="chip">DOUBLES</span>
                    <span className="chip">VEGGIE</span>
                  </div>
                  <div className="menu__divider menu__divider--label">SMASH BURGERS</div>
                  <div className="dish-row">
                    <div className="dish-row__icon"></div>
                    <div className="dish-row__body">
                      <h6>
                        The OG Smash <span className="badge badge--chef">★ TOP</span>
                      </h6>
                      <p>Doble carne, cheddar, pickles, salsa secreta.</p>
                    </div>
                    <div className="dish-row__price">$8.900</div>
                  </div>
                  <div className="dish-row">
                    <div className="dish-row__icon"></div>
                    <div className="dish-row__body">
                      <h6>BBQ Bacon Beast</h6>
                      <p>Triple carne, BBQ ahumada, panceta crujiente.</p>
                    </div>
                    <div className="dish-row__price">$11.500</div>
                  </div>
                  <div className="dish-row">
                    <div className="dish-row__icon"></div>
                    <div className="dish-row__body">
                      <h6>Mushroom Swiss</h6>
                      <p>Champiñones salteados, queso suizo derretido.</p>
                    </div>
                    <div className="dish-row__price">$9.200</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CAFE */}
            <div className="theme theme--cafe" data-theme="cafe">
              <div className="device device--cover">
                <div className="device__screen menu menu--cafe">
                  <div className="menu__brand">
                    <span className="brand-mark brand-mark--cf">○</span>
                    <span className="brand-name">ORBIT COFFEE</span>
                  </div>
                  <h4 className="menu__title">
                    SPECIALTY
                    <br />
                    COFFEE
                  </h4>
                  <span className="menu__divider"></span>
                  <p className="menu__sub">Tostado en casa · Origen único</p>
                  <ul className="menu__cats">
                    <li className="active">
                      <h5>FILTROS</h5>
                      <span>V60, Aeropress, Chemex</span>
                      <i></i>
                    </li>
                    <li>
                      <h5>ESPRESSOS</h5>
                      <span>Lattes &amp; cappuccinos</span>
                    </li>
                    <li>
                      <h5>BRUNCH</h5>
                      <span>Hasta las 14hs</span>
                    </li>
                    <li>
                      <h5>PASTELERÍA</h5>
                      <span>Cero gluten disponible</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="device device--list">
                <div className="device__screen menu menu--cafe">
                  <div className="chips">
                    <span className="chip chip--active">FILTROS</span>
                    <span className="chip">COLD BREW</span>
                    <span className="chip">BATCH</span>
                  </div>
                  <div className="menu__divider menu__divider--label">MÉTODOS DE FILTRO</div>
                  <div className="dish-row">
                    <div className="dish-row__icon"></div>
                    <div className="dish-row__body">
                      <h6>
                        V60 Etiopía Yirgacheffe <span className="badge badge--chef">★ BARISTA</span>
                      </h6>
                      <p>Notas a jazmín, durazno y cítricos.</p>
                    </div>
                    <div className="dish-row__price">$3.200</div>
                  </div>
                  <div className="dish-row">
                    <div className="dish-row__icon"></div>
                    <div className="dish-row__body">
                      <h6>Chemex Colombia Huila</h6>
                      <p>Cuerpo medio, chocolate, frutos rojos.</p>
                    </div>
                    <div className="dish-row__price">$2.900</div>
                  </div>
                  <div className="dish-row">
                    <div className="dish-row__icon"></div>
                    <div className="dish-row__body">
                      <h6>Aeropress Brasil Cerrado</h6>
                      <p>Dulce, nuez, caramelo, cuerpo intenso.</p>
                    </div>
                    <div className="dish-row__price">$2.700</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="showcase__note" data-reveal>
            Todo lo que ves arriba es el <strong>mismo motor FlavorSync</strong>: cambia el branding,
            cambia el rubro, cambian los platos. El producto se adapta a tu marca, no al revés.
          </p>
        </section>

        {/* ============ IMPACTO ============ */}
        <section className="impact" id="impacto">
          <div className="impact__inner">
            <div className="impact__copy" data-reveal>
              <div className="eyebrow eyebrow--left">
                <span className="eyebrow__line"></span>El impacto real
              </div>
              <h2>
                Decisión más rápida,
                <br />
                ticket más alto.
              </h2>
              <p>
                Cuando el comensal <em>ve</em> el plato exacto en tamaño real sobre su mesa, deja de
                dudar. La fricción de la decisión desaparece — y con ella, la indecisión que aplasta
                tu rotación.
              </p>
              <p className="impact__lead">
                FlavorSync no es decoración tecnológica. Es una palanca de negocio: elevás la
                experiencia, dirigís la atención hacia los platos que querés vender, y subís ticket
                promedio sin levantar precios.
              </p>
              <ul className="impact__list">
                <li>
                  <span className="check"></span>{' '}
                  <span>
                    Aumentá la <strong>tasa de selección</strong> de tus platos estrella
                  </span>
                </li>
                <li>
                  <span className="check"></span>{' '}
                  <span>
                    Subí la <strong>satisfacción</strong>: lo que ven es lo que reciben
                  </span>
                </li>
                <li>
                  <span className="check"></span>{' '}
                  <span>
                    Acelerá la <strong>rotación</strong> reduciendo el tiempo de decisión
                  </span>
                </li>
                <li>
                  <span className="check"></span>{' '}
                  <span>
                    Posicionate en la <strong>máxima escala tecnológica</strong> de tu rubro
                  </span>
                </li>
              </ul>
            </div>

            <div className="impact__stats" data-reveal>
              <div className="stat-card stat-card--1">
                <div className="stat-card__num" data-target="38" data-suffix="%">
                  0%
                </div>
                <div className="stat-card__label">+ selección de platos destacados</div>
                <div className="stat-card__bar">
                  <span style={{ '--w': '78%' } as React.CSSProperties}></span>
                </div>
              </div>
              <div className="stat-card stat-card--2">
                <div className="stat-card__num" data-target="22" data-suffix="%">
                  0%
                </div>
                <div className="stat-card__label">+ ticket promedio mensual</div>
                <div className="stat-card__bar">
                  <span style={{ '--w': '60%' } as React.CSSProperties}></span>
                </div>
              </div>
              <div className="stat-card stat-card--3">
                <div className="stat-card__num" data-target="3" data-prefix="–" data-suffix=" min">
                  0 min
                </div>
                <div className="stat-card__label">menos de tiempo de decisión por mesa</div>
                <div className="stat-card__bar">
                  <span style={{ '--w': '48%' } as React.CSSProperties}></span>
                </div>
              </div>
              <div className="stat-card stat-card--4">
                <div className="stat-card__num" data-target="100" data-suffix="%">
                  0%
                </div>
                <div className="stat-card__label">de comensales sin instalar nada</div>
                <div className="stat-card__bar">
                  <span style={{ '--w': '100%' } as React.CSSProperties}></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ TECH ============ */}
        <section className="tech">
          <div className="tech__inner" data-reveal>
            <div className="eyebrow">
              <span className="eyebrow__line"></span>Rendimiento &amp; tecnología
              <span className="eyebrow__line"></span>
            </div>
            <h2>
              Construido para no fallar
              <br />
              en la <span className="grad">noche más concurrida</span>.
            </h2>
            <div className="tech__grid">
              <div className="tech__pill">
                <i className="dot dot--blue"></i> WebAR · Sin apps · Sin instalación
              </div>
              <div className="tech__pill">
                <i className="dot dot--blue"></i> Carga sub-segundo garantizada
              </div>
              <div className="tech__pill">
                <i className="dot dot--black"></i> Modelos fotorrealistas de alta calidad
              </div>
              <div className="tech__pill">
                <i className="dot dot--black"></i> Disponible en cualquier celular moderno
              </div>
              <div className="tech__pill">
                <i className="dot dot--blue"></i> Actualizaciones en tiempo real
              </div>
              <div className="tech__pill">
                <i className="dot dot--black"></i> Panel de administración en vivo
              </div>
            </div>
          </div>
        </section>

        {/* ============ CTA ============ */}
        <section className="cta" id="contacto">
          <div className="cta__inner" data-reveal>
            <div className="cta__glow"></div>
            <div className="eyebrow">
              <span className="eyebrow__line"></span>Empezá hoy
              <span className="eyebrow__line"></span>
            </div>
            <h2>
              Creá tu catálogo
              <br />
              digital de <span className="grad">precisión</span>.
            </h2>
            <p>
              Coordinamos una demostración personalizada para tu restaurante. Mostramos FlavorSync
              funcionando con platos de alta cocina. <strong>Si no te convence, no avanzamos.</strong>
            </p>

            <div className="cta__buttons">
              <a
                className="btn btn--primary btn--xl"
                href="https://wa.me/5491168925915?text=Hola%2C%20quer%C3%ADa%20contactarlos%20por%20las%20opciones%20FlavorSync"
                target="_blank"
                rel="noopener"
              >
                <span>Solicitá una demostración</span>
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a
                className="btn btn--ghost btn--xl"
                href="https://wa.me/5491168925915?text=Hola%2C%20quer%C3%ADa%20contactarlos%20por%20las%20opciones%20FlavorSync"
                target="_blank"
                rel="noopener"
              >
                Hablar por WhatsApp
              </a>
            </div>

            <div className="cta__fineprint">Respondemos en menos de 24h hábiles · +54 9 11 6892-5915</div>
          </div>
        </section>

        {/* ============ FOOTER ============ */}
        <footer className="footer">
          <div className="footer__inner">
            <div className="footer__brand">
              <img src="/assets/flavorsync-logo.jpeg" alt="FlavorSync" />
              <p>
                El gemelo digital de la alta cocina.
                <br />
                Buenos Aires · Argentina
              </p>
            </div>
            <div className="footer__cols">
              <div>
                <h6>Producto</h6>
                <a href="#proceso">Proceso</a>
                <a href="#ventajas">Ventajas</a>
                <a href="#showcase">Showcase</a>
              </div>
              <div>
                <h6>Empresa</h6>
                <a href="#impacto">Impacto</a>
                <a href="#contacto">Contacto</a>
              </div>
              <div>
                <h6>Contacto</h6>
                <a href="https://wa.me/5491168925915" target="_blank" rel="noopener">
                  +54 9 11 6892-5915
                </a>
                <a href="mailto:ventas@flavorsync.com.ar">ventas@flavorsync.com.ar</a>
                <a href="mailto:soporte@flavorsync.com.ar">soporte@flavorsync.com.ar</a>
              </div>
            </div>
          </div>
          <div className="footer__bottom">
            <span>
              © <span id="year"></span> FlavorSync · Todos los derechos reservados
            </span>
            <span>Construido con precisión · Buenos Aires</span>
          </div>
        </footer>
      </main>

      {/* ============ Floating WhatsApp ============ */}
      <a
        className="wa"
        href="https://wa.me/5491168925915?text=Hola%2C%20quer%C3%ADa%20contactarlos%20por%20las%20opciones%20FlavorSync"
        target="_blank"
        rel="noopener"
        aria-label="Contactar por WhatsApp"
      >
        <span className="wa__pulse"></span>
        <svg className="wa__icon" viewBox="0 0 32 32" aria-hidden="true">
          <path
            fill="currentColor"
            d="M16 .4C7.4.4.4 7.4.4 16c0 2.8.7 5.5 2.1 7.9L.3 31.7l8-2.1c2.3 1.3 4.9 1.9 7.6 1.9 8.6 0 15.6-7 15.6-15.6S24.6.4 16 .4zm0 28.4c-2.4 0-4.7-.6-6.7-1.8l-.5-.3-4.7 1.2 1.3-4.6-.3-.5C3.8 20.7 3 18.4 3 16 3 8.8 8.8 3 16 3s13 5.8 13 13-5.8 12.8-13 12.8zm7.1-9.6c-.4-.2-2.3-1.1-2.7-1.3-.4-.1-.6-.2-.9.2s-1 1.3-1.2 1.5c-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3.1-1.9-1.1-1-1.9-2.3-2.1-2.7-.2-.4 0-.6.2-.8.2-.2.4-.4.5-.6.2-.2.2-.4.4-.6.1-.2.1-.5 0-.6-.1-.2-.9-2.2-1.2-3-.3-.8-.6-.7-.9-.7h-.7c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9 0 1.7 1.2 3.4 1.4 3.6.2.2 2.4 3.6 5.7 5 .8.3 1.5.5 2 .7.8.3 1.6.2 2.2.1.7-.1 2.1-.9 2.4-1.7.3-.8.3-1.5.2-1.7-.1-.2-.4-.3-.8-.5z"
          />
        </svg>
        <span className="wa__label">Hablanos</span>
      </a>

      {/* Cursor glow */}
      <div className="cursor-glow" aria-hidden="true"></div>

      <LandingScripts />
    </>
  )
}
