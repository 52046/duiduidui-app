import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import vocabularioBase from '../data/hsk3_vocab.json';

export default function MyDecks() {
  const { user } = useContext(AuthContext);
  const [vista, setVista] = useState('lista'); // 'lista' o 'crear'
  const navigate = useNavigate();
  
  // Simulamos la base de datos de mazos del usuario
  const [mazos, setMazos] = useState(() => {
    const guardados = localStorage.getItem('mis_mazos');
    return guardados ? JSON.parse(guardados) : [];
  });
  
  // Estados para el creador de mazos
  const [nombreMazo, setNombreMazo] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [seleccionadas, setSeleccionadas] = useState([]);
  
  // Estado para el modal de estudio
  const [mazoAEstudiar, setMazoAEstudiar] = useState(null);

  // Protección de ruta pasiva
  if (!user) {
    return (
      <div className="text-center mt-20 bg-white p-10 rounded-2xl shadow-sm max-w-lg mx-auto border border-gray-100">
        <span className="text-6xl mb-4 block">🔒</span>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Acceso Restringido</h2>
        <p className="text-gray-500">Inicia sesión en la parte superior para crear y guardar tus propios mazos de estudio.</p>
      </div>
    );
  }

  // Motor de búsqueda en tiempo real
  const resultadosBusqueda = busqueda.trim() === '' 
    ? [] 
    : vocabularioBase.filter(v => 
        v.hanzi.includes(busqueda) || 
        v.pinyin.toLowerCase().includes(busqueda.toLowerCase()) ||
        v.significado.some(s => s.toLowerCase().includes(busqueda.toLowerCase()))
      ).slice(0, 5); // Limitamos a 5 resultados para no saturar la vista

  const agregarPalabra = (palabra) => {
    if (!seleccionadas.some(p => p.id === palabra.id)) {
      setSeleccionadas([...seleccionadas, palabra]);
    }
  };

  const quitarPalabra = (id) => {
    setSeleccionadas(seleccionadas.filter(p => p.id !== id));
  };

  const guardarMazo = () => {
    if (nombreMazo.trim() === '' || seleccionadas.length === 0) return;

    const nuevoMazo = {
      id: Date.now(),
      nombre: nombreMazo,
      palabras: seleccionadas,
      fecha: new Date().toLocaleDateString()
    };

    const nuevosMazos = [...mazos, nuevoMazo];
    setMazos(nuevosMazos);
    localStorage.setItem('mis_mazos', JSON.stringify(nuevosMazos)); // Guardamos en memoria

    setVista('lista');
    setNombreMazo('');
    setSeleccionadas([]);
    setBusqueda('');
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      {vista === 'lista' && (
        <div>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Mis Mazos</h1>
            <button 
              onClick={() => setVista('crear')}
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-emerald-700 transition shadow-sm"
            >
              + Nuevo Mazo
            </button>
          </div>

          {mazos.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border-2 border-dashed border-gray-200">
              <span className="text-5xl block mb-4 text-gray-300">🗂️</span>
              <p className="text-gray-500 font-medium">Aún no tienes mazos personalizados.</p>
              <p className="text-gray-400 text-sm mt-1">Crea uno para agrupar las palabras que más te cuestan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mazos.map(mazo => (
                <div key={mazo.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer group">
                  <h3 className="font-bold text-xl text-gray-800 mb-1 group-hover:text-emerald-600 transition">{mazo.nombre}</h3>
                  <p className="text-sm text-gray-500 mb-4">{mazo.palabras.length} palabras • Creado el {mazo.fecha}</p>
                  <button 
                    onClick={() => setMazoAEstudiar(mazo)}
                    className="text-emerald-600 text-sm font-semibold hover:underline"
                  >
                    Estudiar ahora →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {vista === 'crear' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">Crear Nuevo Mazo</h2>
            <button onClick={() => setVista('lista')} className="text-gray-500 hover:text-gray-800 font-medium">
              ✕ Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Columna Izquierda: Buscador */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Mazo</label>
              <input 
                type="text" 
                value={nombreMazo}
                onChange={(e) => setNombreMazo(e.target.value)}
                placeholder="Ej. Vocabulario del Trabajo"
                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none mb-6"
              />

              <label className="block text-sm font-semibold text-gray-700 mb-2">Buscar palabras</label>
              <input 
                type="text" 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Busca por hanzi, pinyin o significado..."
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none mb-3"
              />

              {/* Resultados de búsqueda */}
              <div className="space-y-2">
                {resultadosBusqueda.map(palabra => (
                  <div key={palabra.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-300 transition">
                    <div>
                      <span className="text-xl font-bold mr-3">{palabra.hanzi}</span>
                      <span className="text-gray-600 text-sm">{palabra.pinyin}</span>
                    </div>
                    <button 
                      onClick={() => agregarPalabra(palabra)}
                      className="text-emerald-600 hover:bg-emerald-50 px-3 py-1 rounded text-sm font-bold transition"
                    >
                      Añadir
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Columna Derecha: Palabras Seleccionadas */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 flex flex-col h-full">
              <h3 className="font-bold text-gray-700 mb-4">Palabras en este mazo ({seleccionadas.length})</h3>
              
              <div className="flex-1 overflow-y-auto space-y-2 mb-6 max-h-[300px]">
                {seleccionadas.length === 0 ? (
                  <p className="text-gray-400 text-sm italic text-center mt-10">Tu mazo está vacío. Busca y añade palabras.</p>
                ) : (
                  seleccionadas.map(palabra => (
                    <div key={palabra.id} className="flex justify-between items-center p-2 bg-white rounded border border-gray-100 shadow-sm">
                      <span className="font-bold">
                        {palabra.hanzi} - <span className="font-normal text-gray-500 text-sm">{palabra.pinyin}</span>
                      </span>
                      <button 
                        onClick={() => quitarPalabra(palabra.id)}
                        className="text-emerald-400 hover:text-emerald-600 px-2 py-1 rounded text-xs font-bold transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>

              <button 
                onClick={guardarMazo}
                disabled={nombreMazo.trim() === '' || seleccionadas.length === 0}
                className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Guardar Mazo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para elegir modo de estudio */}
      {mazoAEstudiar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl max-w-sm w-full relative">
            <button 
              onClick={() => setMazoAEstudiar(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-xl"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Estudiar Mazo
            </h3>
            <p className="text-gray-600 font-medium mb-6">{mazoAEstudiar.nombre}</p>
            
            <div className="grid grid-cols-2 gap-3">
              {['flashcards', 'quizzes', 'escritura', 'audicion'].map((m) => (
                <button
                  key={m}
                  onClick={() => navigate(`/practica?modo=${m}&mazoId=${mazoAEstudiar.id}`)}
                  className="py-3 rounded-xl capitalize font-medium transition bg-gray-50 text-gray-700 border border-gray-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300"
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}