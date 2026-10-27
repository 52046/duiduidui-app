import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [modo, setModo] = useState('flashcards');
  const [nivel, setNivel] = useState(1);
  const [cantidad, setCantidad] = useState(20);

  const iniciarPractica = () => {
    // Navegamos a la sala de práctica enviando la configuración elegida
    navigate(`/practica?modo=${modo}&nivel=${nivel}&cantidad=${cantidad}`);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Configura tu Sesión</h1>
      
      <div className="space-y-6">
        {/* Selección de Modo */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">1. ¿Qué quieres practicar?</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['flashcards', 'quizzes', 'escritura','audicion'].map((m) => (
              <button
                key={m}
                onClick={() => setModo(m)}
                className={`py-3 px-4 rounded-lg capitalize font-medium transition ${
                  modo === m 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Selección de Nivel HSK */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">2. Nivel HSK (3.0)</label>
          <select 
            value={nivel}
            onChange={(e) => setNivel(Number(e.target.value))}
            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
              <option key={n} value={n}>HSK Nivel {n}</option>
            ))}
          </select>
        </div>

        {/* Selección de Cantidad */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">3. Cantidad de ejercicios</label>
          <div className="flex gap-3">
            {[20, 50, 70].map((c) => (
              <button
                key={c}
                onClick={() => setCantidad(c)}
                className={`flex-1 py-2 rounded-lg font-medium transition ${
                  cantidad === c 
                    ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-500' 
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Botón de Inicio */}
        <button 
          onClick={iniciarPractica}
          className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transition transform hover:-translate-y-1 text-lg"
        >
          ¡Comenzar Práctica!
        </button>
      </div>
    </div>
  );
}