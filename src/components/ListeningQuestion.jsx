import { useState, useEffect } from 'react';

export default function ListeningQuestion({ palabra, vocabulario, onSiguiente }) {
  const [opciones, setOpciones] = useState([]);
  const [respondido, setRespondido] = useState(false);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);

  const reproducirAudio = () => {
    // Verificamos que el navegador soporte la API de voz
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(palabra.hanzi);
      utterance.lang = 'zh-CN'; // Chino simplificado
      utterance.rate = 0.85; // Velocidad ligeramente reducida
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Tu navegador actual no soporta la síntesis de voz nativa.");
    }
  };

  useEffect(() => {
    const otrosVocablos = vocabulario.filter(v => v.id !== palabra.id);
    
    // Quitamos los tonos para obtener el pinyin base (ej: "bā" -> "ba")
    const quitarTonos = (texto) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const pinyinBaseCorrecto = quitarTonos(palabra.pinyin);
    const inicialCorrecta = palabra.pinyin.charAt(0).toLowerCase();

    // 1. Prioridad Alta: Palabras con el mismo pinyin base (distinto tono)
    const mismoPinyin = otrosVocablos.filter(v => quitarTonos(v.pinyin) === pinyinBaseCorrecto);
    
    // 2. Prioridad Media: Palabras que empiezan con la misma letra
    const mismaInicial = otrosVocablos.filter(v => 
      v.pinyin.charAt(0).toLowerCase() === inicialCorrecta && 
      quitarTonos(v.pinyin) !== pinyinBaseCorrecto // Evitar duplicados
    );

    // 3. Juntamos los candidatos ordenados por prioridad y los mezclamos dentro de su grupo
    let candidatos = [
      ...mismoPinyin.sort(() => 0.5 - Math.random()),
      ...mismaInicial.sort(() => 0.5 - Math.random())
    ];

    // Tomamos los 3 mejores distractores
    let distractores = candidatos.slice(0, 3);

    // Si la base de datos es pequeña y no alcanzó a juntar 3, rellenamos con aleatorios
    if (distractores.length < 3) {
      const restantes = otrosVocablos.filter(v => !distractores.some(d => d.id === v.id));
      const extras = restantes.sort(() => 0.5 - Math.random()).slice(0, 3 - distractores.length);
      distractores = [...distractores, ...extras];
    }

    const todasOpciones = [...distractores, palabra].sort(() => 0.5 - Math.random());
    
    setOpciones(todasOpciones);
    setRespondido(false);
    setOpcionSeleccionada(null);

    const timer = setTimeout(() => {
      reproducirAudio();
    }, 300);
    
    return () => clearTimeout(timer);
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
        Escucha y selecciona la respuesta
      </h3>
      
      <div className="mb-8 flex flex-col items-center">
        {/* Botón gigante de Play con ícono SVG (Tailwind) */}
        <button 
          onClick={reproducirAudio}
          className="bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full p-6 transition transform hover:scale-105 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5 10v4a2 2 0 002 2h2.586l3.707 3.707a1 1 0 001.707-.707V4.929a1 1 0 00-1.707-.707L9.586 7.9H7a2 2 0 00-2 2z" />
          </svg>
        </button>
        <p className="text-sm text-gray-400 mt-4">Haz clic para escuchar de nuevo</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {opciones.map((opcion, i) => {
          let clasesBoton = "bg-gray-50 border-2 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-blue-300 cursor-pointer";
          
          if (respondido) {
            if (opcion.id === palabra.id) {
              clasesBoton = "bg-green-100 border-green-500 text-green-800 font-bold"; 
            } else if (opcionSeleccionada?.id === opcion.id) {
              clasesBoton = "bg-red-100 border-red-500 text-red-800 font-bold"; 
            } else {
              clasesBoton = "bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed"; 
            }
          }

          return (
            <button
              key={i}
              onClick={() => manejarSeleccion(opcion)}
              disabled={respondido}
              className={`py-3 px-6 rounded-xl transition-all duration-300 flex justify-between items-center text-left ${clasesBoton}`}
            >
              <span className="font-bold text-3xl">{opcion.hanzi}</span>
              <div className="text-right">
                <span className="block text-sm font-semibold">{opcion.pinyin}</span>
                <span className="block text-xs capitalize text-gray-500">{opcion.significado.join(', ')}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}