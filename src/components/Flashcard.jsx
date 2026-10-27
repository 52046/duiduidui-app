import { useState } from 'react';

export default function Flashcard({ palabra, onSiguiente }) {
  const [volteada, setVolteada] = useState(false);

  const manejarEvaluacion = (dificultad) => {
    // Aquí en el futuro conectaremos el algoritmo Anki.
    // Por ahora, simplemente avanzamos a la siguiente tarjeta.
    console.log(`Evaluado como: ${dificultad}`);
    setVolteada(false);
    onSiguiente(dificultad);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        onClick={() => !volteada && setVolteada(true)}
        className={`min-h-[300px] w-full bg-white rounded-2xl shadow-lg border-2 flex flex-col items-center justify-center p-8 cursor-pointer transition-all duration-300 ${
          volteada ? 'border-red-200' : 'border-gray-200 hover:border-red-300 hover:shadow-xl'
        }`}
      >
        {!volteada ? (
          <div className="text-center">
            <span className="text-8xl font-bold text-gray-800">{palabra.hanzi}</span>
            <p className="text-gray-400 mt-6 text-sm">Toca para voltear</p>
          </div>
        ) : (
          <div className="text-center flex flex-col h-full w-full justify-between">
            <div className="mt-4">
              <span className="text-5xl font-bold text-red-600 mb-4 block">{palabra.pinyin}</span>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {palabra.significado.map((sig, i) => (
                  <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-lg">
                    {sig}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Botones de evaluación Anki (Binario) */}
            <div className="grid grid-cols-2 gap-4 mt-8 w-full">
              <button 
                onClick={(e) => { e.stopPropagation(); manejarEvaluacion('dificil'); }}
                className="bg-red-100 text-red-700 flex flex-col items-center py-3 rounded-lg hover:bg-red-200 transition"
              >
                <span className="text-2xl font-bold mb-1">错</span>
              </button>
              
              <button 
                onClick={(e) => { e.stopPropagation(); manejarEvaluacion('facil'); }}
                className="bg-green-100 text-green-700 flex flex-col items-center py-3 rounded-lg hover:bg-green-200 transition"
              >
                <span className="text-2xl font-bold mb-1">对</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}