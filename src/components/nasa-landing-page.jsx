import React, { useState, useEffect } from "react";
import {
  Star,
  Rocket,
  Globe,
  Calendar,
  ChevronDown,
  Menu,
  X,
  Satellite,
  Mountain,
  Zap,
  Camera,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Componente principal de la aplicación
const App = () => {
  const [apodData, setApodData] = useState(null);
  const [marsPhotos, setMarsPhotos] = useState([]);
  const [asteroids, setAsteroids] = useState([]);
  const [earthImages, setEarthImages] = useState([]);
  const [selectedRover, setSelectedRover] = useState('curiosity');
  const [selectedSol, setSelectedSol] = useState(1000);
  const [loading, setLoading] = useState(true);
  const [ setSectionsLoading] = useState({
    apod: true,
    mars: true,
    asteroids: true,
    earth: true
  });
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Clave de la API de NASA (usa tu propia clave para producción)
  const NASA_API_KEY = "g6wvkHOsh2LLqD7Yyasl6n5wbbONLEx6NhYAq5iI";

  // Rovers disponibles
  const rovers = {
    curiosity: 'Curiosity',
    opportunity: 'Opportunity', 
    spirit: 'Spirit',
    perseverance: 'Perseverance'
  };

  useEffect(() => {
    const fetchNASAData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch paralelo de todas las APIs
        const [apodRes, marsRes, asteroidsRes, earthRes] = await Promise.allSettled([
          // APOD
          fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`),
          
          // Mars Rover Photos
          fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${selectedRover}/photos?sol=${selectedSol}&api_key=${NASA_API_KEY}`),
          
          // Near Earth Objects
          fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${new Date().toISOString().split('T')[0]}&api_key=${NASA_API_KEY}`),
          
          // Earth Imagery (EPIC)
          fetch(`https://api.nasa.gov/EPIC/api/natural/images?api_key=${NASA_API_KEY}`)
        ]);

        // Procesar APOD
        if (apodRes.status === 'fulfilled' && apodRes.value.ok) {
          const apodData = await apodRes.value.json();
          setApodData(apodData);
        }

        // Procesar Mars Photos
        if (marsRes.status === 'fulfilled' && marsRes.value.ok) {
          const marsData = await marsRes.value.json();
          if (marsData.photos) {
            setMarsPhotos(marsData.photos.slice(0, 8));
          }
        }

        // Procesar Asteroids
        if (asteroidsRes.status === 'fulfilled' && asteroidsRes.value.ok) {
          const asteroidData = await asteroidsRes.value.json();
          if (asteroidData.near_earth_objects) {
            const today = new Date().toISOString().split('T')[0];
            const todayAsteroids = asteroidData.near_earth_objects[today] || [];
            setAsteroids(todayAsteroids.slice(0, 6));
          }
        }

        // Procesar Earth Images
        if (earthRes.status === 'fulfilled' && earthRes.value.ok) {
          const earthData = await earthRes.value.json();
          setEarthImages(earthData.slice(0, 6));
        }

        setSectionsLoading({
          apod: false,
          mars: false,
          asteroids: false,
          earth: false
        });

      } catch (err) {
        console.error("Error al obtener datos de la NASA:", err);
        setError(`Error: ${err.message}. La clave de la API puede haber excedido su límite de uso.`);
      } finally {
        setLoading(false);
      }
    };

    fetchNASAData();
  }, [NASA_API_KEY, selectedRover, selectedSol]);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="font-sans antialiased min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-black text-white">
      {/* Navegación */}
      <nav className="fixed w-full bg-black/30 backdrop-blur-lg z-50 border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Rocket className="h-8 w-8 text-blue-400 animate-pulse-slow" />
              <span className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                NASA Explorer
              </span>
            </div>

            {/* Menú de escritorio */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("home")}
                className="hover:text-blue-300 transition-colors transform hover:scale-110"
              >
                Inicio
              </button>
              <button
                onClick={() => scrollToSection("apod")}
                className="hover:text-blue-300 transition-colors transform hover:scale-110"
              >
                APOD
              </button>
              <button
                onClick={() => scrollToSection("mars")}
                className="hover:text-blue-300 transition-colors transform hover:scale-110"
              >
                Marte
              </button>
              <button
                onClick={() => scrollToSection("asteroids")}
                className="hover:text-blue-300 transition-colors transform hover:scale-110"
              >
                Asteroides
              </button>
              <button
                onClick={() => scrollToSection("earth")}
                className="hover:text-blue-300 transition-colors transform hover:scale-110"
              >
                Tierra
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="hover:text-blue-300 transition-colors transform hover:scale-110"
              >
                Acerca
              </button>
            </div>

            {/* Botón del menú móvil */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Menú móvil */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/10">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-left py-2 px-4 hover:bg-white/10 rounded-lg transition-colors"
                >
                  Inicio
                </button>
                <button
                  onClick={() => scrollToSection("apod")}
                  className="text-left py-2 px-4 hover:bg-white/10 rounded-lg transition-colors"
                >
                  APOD
                </button>
                <button
                  onClick={() => scrollToSection("mars")}
                  className="text-left py-2 px-4 hover:bg-white/10 rounded-lg transition-colors"
                >
                  Marte
                </button>
                <button
                  onClick={() => scrollToSection("asteroids")}
                  className="text-left py-2 px-4 hover:bg-white/10 rounded-lg transition-colors"
                >
                  Asteroides
                </button>
                <button
                  onClick={() => scrollToSection("earth")}
                  className="text-left py-2 px-4 hover:bg-white/10 rounded-lg transition-colors"
                >
                  Tierra
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-left py-2 px-4 hover:bg-white/10 rounded-lg transition-colors"
                >
                  Acerca
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Sección principal (Hero) */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
      >
        {/* Estrellas animadas en el fondo */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full animate-pulse-slow"></div>
          <div className="absolute top-40 right-20 w-1 h-1 bg-blue-400 rounded-full animate-pulse-slow delay-1000"></div>
          <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse-slow delay-2000"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse-slow delay-3000"></div>
          <div className="absolute bottom-1/4 right-10 w-2 h-2 bg-pink-400 rounded-full animate-pulse-slow delay-4000"></div>
        </div>

        <div className="text-center z-10 px-4 max-w-6xl mx-auto">
          <div className="mb-8">
            <Star className="h-16 w-16 text-yellow-400 mx-auto mb-4 animate-spin-slow" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-fade-in-up">
            Explora el Universo
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto animate-fade-in-up delay-300">
            Descubre las maravillas del cosmos a través de los datos en tiempo
            real de la NASA
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-600">
            <button
              onClick={() => scrollToSection("apod")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Ver Imagen del Día
            </button>
            <button
              onClick={() => scrollToSection("mars")}
              className="border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-black px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Explorar Marte
            </button>
            <button
              onClick={() => scrollToSection("asteroids")}
              className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Asteroides Cercanos
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
          <ChevronDown className="h-8 w-8 text-white/60" />
        </div>
      </section>

      {/* Sección APOD */}
      <section id="apod" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Imagen Astronómica del Día
            </h2>
            <p className="text-xl text-gray-300">
              Descubre una nueva vista del universo cada día
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-400 p-8 bg-red-900/20 rounded-xl border border-red-500/30">
              <p className="font-semibold text-lg">{error}</p>
              <p className="text-sm mt-2">
                Para evitar este error, puedes obtener tu propia clave de API en
                el sitio web de la NASA.
              </p>
            </div>
          ) : apodData ? (
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 md:p-10 border border-white/10 shadow-2xl transition-all duration-500 hover:shadow-3xl">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-5 w-5 text-blue-400" />
                    <span className="text-blue-400 font-semibold">
                      {apodData.date}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    {apodData.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-base md:text-lg mb-6">
                    {apodData.explanation}
                  </p>
                  {apodData.copyright && (
                    <p className="text-sm text-gray-400 italic">
                      © {apodData.copyright}
                    </p>
                  )}
                </div>
                <div className="order-1 md:order-2">
                  {apodData.media_type === "image" ? (
                    <img
                      src={apodData.url}
                      alt={apodData.title}
                      className="w-full h-auto rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                      <iframe
                        src={apodData.url}
                        title={apodData.title}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              No se pudo cargar la imagen del día. Intenta de nuevo más tarde.
            </div>
          )}
        </div>
      </section>

      {/* Sección de fotos de Marte */}
      <section
        id="mars"
        className="py-20 px-4 bg-gradient-to-r from-red-950/20 to-orange-950/20"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Fotos de Marte
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Imágenes reales capturadas por los rovers de la NASA
            </p>
            
            {/* Controles de rover y sol */}
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-red-400" />
                <select
                  value={selectedRover}
                  onChange={(e) => setSelectedRover(e.target.value)}
                  className="bg-black/30 border border-red-400/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-400"
                >
                  {Object.entries(rovers).map(([key, name]) => (
                    <option key={key} value={key} className="bg-black">
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-red-400" />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedSol(Math.max(1, selectedSol - 100))}
                    className="bg-red-400/20 hover:bg-red-400/30 p-2 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-white px-4 py-2 bg-black/30 rounded-lg min-w-[100px] text-center">
                    Sol {selectedSol}
                  </span>
                  <button
                    onClick={() => setSelectedSol(selectedSol + 100)}
                    className="bg-red-400/20 hover:bg-red-400/30 p-2 rounded-lg transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-400"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-400 p-8 bg-red-900/20 rounded-xl border border-red-500/30">
              <p className="font-semibold text-lg">{error}</p>
              <p className="text-sm mt-2">
                Para evitar este error, puedes obtener tu propia clave de API en
                el sitio web de la NASA.
              </p>
            </div>
          ) : marsPhotos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {marsPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <img
                    src={photo.img_src}
                    alt={`Mars photo by ${photo.camera.full_name}`}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                  <div className="p-4">
                    <h4 className="font-semibold text-lg mb-2">
                      {photo.camera.full_name}
                    </h4>
                    <p className="text-sm text-gray-400 mb-1">
                      Rover: {rovers[selectedRover]}
                    </p>
                    <p className="text-sm text-gray-400 mb-1">
                      Sol: {photo.sol}
                    </p>
                    <p className="text-sm text-gray-400">
                      Fecha en la Tierra: {photo.earth_date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400">
              No se pudieron cargar las fotos de Marte para este rover y sol.
            </div>
          )}
        </div>
      </section>

      {/* Sección de Asteroides Cercanos */}
      <section id="asteroids" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Asteroides Cercanos a la Tierra
            </h2>
            <p className="text-xl text-gray-300">
              Objetos cercanos detectados hoy por la NASA
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
            </div>
          ) : error ? (
            <div className="text-center text-yellow-400 p-8 bg-yellow-900/20 rounded-xl border border-yellow-500/30">
              <p className="font-semibold text-lg">{error}</p>
            </div>
          ) : asteroids.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {asteroids.map((asteroid) => (
                <div
                  key={asteroid.id}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white truncate">
                      {asteroid.name}
                    </h3>
                    {asteroid.is_potentially_hazardous_asteroid && (
                      <Zap className="h-6 w-6 text-red-400 animate-pulse" />
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Diámetro estimado:</span>
                      <span className="text-yellow-400 font-semibold">
                        {Math.round(asteroid.estimated_diameter.meters.estimated_diameter_min)}-
                        {Math.round(asteroid.estimated_diameter.meters.estimated_diameter_max)}m
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Velocidad:</span>
                      <span className="text-blue-400 font-semibold">
                        {Math.round(asteroid.close_approach_data[0]?.relative_velocity.kilometers_per_hour)} km/h
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Distancia mínima:</span>
                      <span className="text-green-400 font-semibold">
                        {Math.round(asteroid.close_approach_data[0]?.miss_distance.kilometers)} km
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Peligroso:</span>
                      <span className={`font-semibold ${
                        asteroid.is_potentially_hazardous_asteroid 
                          ? 'text-red-400' 
                          : 'text-green-400'
                      }`}>
                        {asteroid.is_potentially_hazardous_asteroid ? 'Sí' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400">
              No se detectaron asteroides cercanos para hoy.
            </div>
          )}
        </div>
      </section>

      {/* Sección de Imágenes de la Tierra */}
      <section 
        id="earth" 
        className="py-20 px-4 bg-gradient-to-r from-green-950/20 to-blue-950/20"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              La Tierra desde el Espacio
            </h2>
            <p className="text-xl text-gray-300">
              Imágenes de nuestro planeta capturadas por satélites de la NASA
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-400"></div>
            </div>
          ) : error ? (
            <div className="text-center text-green-400 p-8 bg-green-900/20 rounded-xl border border-green-500/30">
              <p className="font-semibold text-lg">{error}</p>
            </div>
          ) : earthImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {earthImages.map((image, index) => (
                <div
                  key={image.identifier || index}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <img
                    src={`https://api.nasa.gov/EPIC/archive/natural/${image.date?.split(' ')[0].replace(/-/g, '/')}/png/${image.image}.png?api_key=${NASA_API_KEY}`}
                    alt={`Earth view - ${image.caption || 'NASA EPIC'}`}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Satellite className="h-5 w-5 text-green-400" />
                      <h4 className="font-semibold text-lg">
                        NASA EPIC
                      </h4>
                    </div>
                    <p className="text-sm text-gray-400 mb-1">
                      Fecha: {image.date?.split(' ')[0]}
                    </p>
                    <p className="text-sm text-gray-400">
                      {image.caption || 'Vista de la Tierra desde el espacio profundo'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400">
              No se pudieron cargar las imágenes de la Tierra.
            </div>
          )}
        </div>
      </section>

      {/* Sección Acerca de */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Sobre NASA Explorer
          </h2>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
            <Globe className="h-16 w-16 text-green-400 mx-auto mb-6" />
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              NASA Explorer es una plataforma que te conecta directamente con
              los datos más fascinantes de la NASA, incluyendo la imagen
              astronómica del día, fotografías en tiempo real desde Marte,
              asteroides cercanos a la Tierra e imágenes de nuestro planeta desde el espacio.
            </p>
            <p className="text-lg text-gray-400 mb-8">
              Construido con React y Tailwind CSS, utilizando múltiples APIs oficiales
              de la NASA para brindarte una experiencia espacial única y
              educativa.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium border border-blue-500/30">
                React
              </span>
              <span className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium border border-purple-500/30">
                Tailwind CSS
              </span>
              <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium border border-green-500/30">
                NASA APIs
              </span>
              <span className="bg-red-500/20 text-red-400 px-4 py-2 rounded-full text-sm font-medium border border-red-500/30">
                Mars Rovers
              </span>
              <span className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-medium border border-yellow-500/30">
                Asteroides
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pie de página */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <Rocket className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              NASA Explorer
            </span>
          </div>
          <p className="text-gray-400 mb-4">
            Datos proporcionados por la API oficial de la NASA
          </p>
          <p className="text-sm text-gray-500">
            © 2025 Wilson Paredes - NASA Explorer. Desarrollado con ❤️ para la exploración
            espacial.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
