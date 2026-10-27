import { useState, useEffect } from 'react';

export default function QuizQuestion({ palabra, vocabulario, onSiguiente }) {
  const [opciones, setOpciones] = useState([]);
  const [respondido, setRespondido] = useState(false);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);

  useEffect(() => {
    // 1. Filtramos para quitar la palabra correcta de la lista de distractores
    const otrosVocablos = vocabulario.filter(v => v.id !== palabra.id);
    
    // 2. Elegimos 3 palabras al azar
    const distractores = otrosVocablos
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    // 3. Unimos la respuesta correcta con los distractores y mezclamos el orden
    const todasOpciones = [...distractores, palabra].sort(() => 0.5 - Math.random());
    
    setOpciones(todasOpciones);
    setRespondido(false);
    setOpcionSeleccionada(null);
  }, [palabra, vocabulario]);

  const manejarSeleccion = (opcion) => {
  if (respondido) return;
  setRespondido(true);
  setOpcionSeleccionada(opcion);

  const esCorrecto = opcion.id === palabra.id;

  setTimeout(() => {
    onSiguiente(esCorrecto ? 'correcto' : 'incorrecto');
  }, 1500);
};

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8 text-center">
      <h3 className="text-gray-500 text-sm font-semibold mb-6 uppercase tracking-wider">
        ¿Qué significa este Hanzi?
      </h3>
      
      <div className="mb-8">
        <span className="text-8xl font-bold text-gray-800">{palabra.hanzi}</span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {opciones.map((opcion, i) => {
          // Lógica para cambiar los colores de los botones después de responder
          let clasesBoton = "bg-gray-50 border-2 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-red-300 cursor-pointer";
          
          if (respondido) {
            if (opcion.id === palabra.id) {
              // Respuesta Correcta (Verde)
              clasesBoton = "bg-green-100 border-green-500 text-green-800 font-bold"; 
            } else if (opcionSeleccionada?.id === opcion.id) {
              // Respuesta Incorrecta que el usuario eligió (Roja)
              clasesBoton = "bg-red-100 border-red-500 text-red-800 font-bold"; 
            } else {
              // Las demás opciones se opacan
              clasesBoton = "bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed"; 
            }
          }

          return (
            <button
              key={i}
              onClick={() => manejarSeleccion(opcion)}
              disabled={respondido}
              className={`py-4 px-6 rounded-xl transition-all duration-300 text-left flex justify-between items-center ${clasesBoton}`}
            >
              <span className="font-bold text-lg">{opcion.pinyin}</span>
              <span className="text-sm capitalize">{opcion.significado.join(', ')}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}