import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import vocabularioBase from '../data/hsk3_vocab.json';
import Flashcard from '../components/Flashcard';
import QuizQuestion from '../components/QuizQuestion';
import WritingQuestion from '../components/WritingQuestion';
import ListeningQuestion from '../components/ListeningQuestion';

export default function PracticeRoom() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const modo = searchParams.get('modo');
  const nivel = parseInt(searchParams.get('nivel')) || 1;
  const cantidad = parseInt(searchParams.get('cantidad')) || 20;
  const mazoId = searchParams.get('mazoId'); // Capturamos el ID del mazo custom

  const [palabras, setPalabras] = useState([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [terminado, setTerminado] = useState(false);
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    if (mazoId) {
      // Si hay un mazoId, buscamos ese mazo específico en el navegador
      const mazosGuardados = JSON.parse(localStorage.getItem('mis_mazos') || '[]');
      const mazoActual = mazosGuardados.find(m => m.id.toString() === mazoId);
      
      if (mazoActual) {
        setPalabras(mazoActual.palabras);
      }
    } else {
      // Comportamiento normal: cargamos desde el JSON estático
      const palabrasFiltradas = vocabularioBase
        .filter(p => p.hsk_nivel === nivel)
        .slice(0, cantidad);
      
      setPalabras(palabrasFiltradas);
    }
  }, [nivel, cantidad, mazoId]);

  const avanzarSiguiente = (estadoRespuesta) => {
    // Guardamos qué palabra fue y cómo le fue al usuario
    setResultados(prev => [...prev, { 
      palabra: palabras[indiceActual], 
      estado: estadoRespuesta 
    }]);

    if (indiceActual + 1 < palabras.length) {
      setIndiceActual(indiceActual + 1);
    } else {
      setTerminado(true);
    }
  };

  if (palabras.length === 0) {
    return <div className="text-center mt-10 text-gray-500">Cargando vocabulario o no hay suficientes palabras...</div>;
  }

  if (terminado) {
    const correctos = resultados.filter(r => r.estado === 'correcto' || r.estado === 'facil');
    const incorrectos = resultados.filter(r => r.estado === 'incorrecto' || r.estado === 'dificil');

    return (
      <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Resumen de tu Sesión</h2>
        
        {/* Contadores */}
        <div className="flex justify-around mb-10 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <div className="text-center">
            <p className="text-5xl font-black text-green-500 mb-2">{correctos.length}</p>
            <p className="text-gray-600 font-bold uppercase tracking-wider text-sm">Acertadas</p>
          </div>
          <div className="w-px bg-gray-300"></div> {/* Divisor visual */}
          <div className="text-center">
            <p className="text-5xl font-black text-red-500 mb-2">{incorrectos.length}</p>
            <p className="text-gray-600 font-bold uppercase tracking-wider text-sm">Para repasar</p>
          </div>
        </div>

        {/* Lista de errores */}
        {incorrectos.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="text-red-500">⚠️</span> Hanzis que debes repasar:
            </h3>
            <div className="grid gap-3">
              {incorrectos.map((res, i) => (
                <div key={i} className="flex justify-between items-center bg-red-50 p-4 rounded-xl border border-red-100 transition hover:bg-red-100">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-gray-800">{res.palabra.hanzi}</span>
                    <span className="text-gray-600 font-medium text-lg">{res.palabra.pinyin}</span>
                  </div>
                  <span className="text-sm font-semibold capitalize text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border border-red-100">
                    {res.palabra.significado[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {incorrectos.length === 0 && (
          <div className="mb-8 text-center bg-green-50 p-6 rounded-xl border border-green-100">
            <p className="text-xl font-bold text-green-700 mb-2">¡Perfecto! 对对对！</p>
            <p className="text-green-600">No tuviste ningún error en esta sesión.</p>
          </div>
        )}

        <div className="text-center">
          <button 
            onClick={() => navigate('/')}
            className="w-full sm:w-auto bg-gray-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-black transition shadow-lg text-lg"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-2xl mx-auto mt-8">
      {/* Encabezado de progreso */}
      <div className="flex justify-between items-center mb-6 px-4">
        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
          Modo: {modo}
        </span>
        <span className="bg-white px-4 py-1 rounded-full shadow-sm border border-gray-100 text-gray-700 font-medium">
          {indiceActual + 1} / {palabras.length}
        </span>
      </div>

      {/* Renderizado condicional según el modo */}
      {modo === 'flashcards' && (
        <Flashcard 
          palabra={palabras[indiceActual]} 
          onSiguiente={avanzarSiguiente} 
        />
      )}
      
      {modo === 'quizzes' && (
        <QuizQuestion 
          palabra={palabras[indiceActual]} 
          vocabulario={vocabularioBase} // Le pasamos todo el JSON para que saque distractores
          onSiguiente={avanzarSiguiente} 
        />
      )}
      {modo === 'escritura' && (
        <WritingQuestion 
          palabra={palabras[indiceActual]} 
          onSiguiente={avanzarSiguiente} 
        />
      )}

      {modo === 'audicion' && (
        <ListeningQuestion 
          palabra={palabras[indiceActual]} 
          vocabulario={vocabularioBase}
          onSiguiente={avanzarSiguiente} 
        />
      )}
    </div>
  );
}