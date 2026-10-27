import { useState, useRef, useEffect } from 'react';

export default function WritingQuestion({ palabra, onSiguiente }) {
  const [inputValor, setInputValor] = useState('');
  const [estado, setEstado] = useState('escribiendo'); // 'escribiendo', 'correcto', 'incorrecto'
  const inputRef = useRef(null);

  // Mantiene el foco en el input al cambiar de palabra
  useEffect(() => {
    if (estado === 'escribiendo') {
      inputRef.current?.focus();
    }
  }, [estado, palabra]);

 const manejarEnvio = (e) => {
  // ... (código existente)
  const esCorrecto = inputValor.trim() === palabra.hanzi;
  if (esCorrecto) {
    setEstado('correcto');
  } else {
    setEstado('incorrecto');
  }

  setTimeout(() => {
    setEstado('escribiendo');
    setInputValor('');
    onSiguiente(esCorrecto ? 'correcto' : 'incorrecto');
  }, 2000);
};

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8 text-center">
      <h3 className="text-gray-500 text-sm font-semibold mb-6 uppercase tracking-wider">
        Escribe el Hanzi
      </h3>
      
      <div className="mb-6">
        <span className="text-5xl font-bold text-red-600 block mb-2">{palabra.pinyin}</span>
        <span className="text-lg text-gray-600 capitalize">{palabra.significado.join(', ')}</span>
      </div>

      <form onSubmit={manejarEnvio} className="mt-8">
        <input
          ref={inputRef}
          type="text"
          value={inputValor}
          onChange={(e) => setInputValor(e.target.value)}
          disabled={estado !== 'escribiendo'}
          placeholder="Escribe aquí..."
          className={`w-full text-center text-4xl py-4 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all ${
            estado === 'correcto' ? 'border-green-500 bg-green-50 text-green-700 focus:ring-green-200' :
            estado === 'incorrecto' ? 'border-red-500 bg-red-50 text-red-700 focus:ring-red-200' :
            'border-gray-300 bg-gray-50 focus:border-red-500 focus:ring-red-100'
          }`}
        />

        {/* Feedback visual si se equivoca */}
        {estado === 'incorrecto' && (
          <div className="mt-4 text-red-600 animate-bounce">
            <p className="text-sm font-bold">¡Incorrecto!</p>
            <p className="text-lg">Era: <span className="text-3xl font-black">{palabra.hanzi}</span></p>
          </div>
        )}

        {estado === 'correcto' && (
          <div className="mt-4 text-green-600 animate-bounce">
            <p className="text-lg font-bold">¡Muy bien! 对</p>
          </div>
        )}

        <button
          type="submit"
          disabled={estado !== 'escribiendo'}
          className="mt-6 w-full bg-gray-800 text-white font-bold py-3 rounded-xl hover:bg-black transition disabled:opacity-50"
        >
          Comprobar
        </button>
      </form>
    </div>
  );
}