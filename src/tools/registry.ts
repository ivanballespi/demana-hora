// Metadades i text SEO de cada eina. El component interactiu és a ./components.

export type Category = "texto" | "documentos" | "fechas" | "calculos" | "finanzas" | "utilidades" | "salud";

export const CATEGORIES: Record<Category, string> = {
  calculos: "Cálculos rápidos",
  finanzas: "Finanzas",
  fechas: "Fechas y tiempo",
  salud: "Salud",
  documentos: "Documentos",
  texto: "Texto",
  utilidades: "Utilidades",
};

/** Pàgina de categoria: /categoria/<slug>/ */
export const CATEGORY_INFO: Record<Category, { slug: string; icon: string; title: string; intro: string }> = {
  calculos: { slug: "calculadoras", icon: "🧮", title: "Calculadoras online gratis", intro: "Porcentajes, IVA, descuentos, fracciones, regla de tres, media y mediana, áreas y perímetros... Las calculadoras que más se usan en el día a día y en clase, con la explicación de cada cálculo." },
  finanzas: { slug: "finanzas", icon: "💶", title: "Calculadoras financieras", intro: "Calcula tu sueldo neto, tu finiquito, la cuota de tu hipoteca o de un préstamo personal, pasa de TIN a TAE, descubre cuánto crecerán tus ahorros con el interés compuesto o cuánto te costará un viaje en coche." },
  fechas: { slug: "fechas", icon: "📅", title: "Calculadoras de fechas y tiempo", intro: "Días entre dos fechas, edad exacta, semana del año, cuenta atrás, vacaciones proporcionales, horas entre dos horas o sumar las horas trabajadas." },
  salud: { slug: "salud", icon: "❤️", title: "Calculadoras de salud", intro: "Calcula tu índice de masa corporal (IMC), tu ritmo de carrera o la fecha probable de parto. Son orientativas: ante cualquier duda, consulta con un profesional sanitario." },
  documentos: { slug: "documentos", icon: "🪪", title: "Herramientas para documentos", intro: "Calcula la letra del DNI o NIE y comprueba si un IBAN es correcto antes de hacer una transferencia." },
  texto: { slug: "texto", icon: "✍️", title: "Herramientas de texto", intro: "Convierte números a letras, cuenta palabras y caracteres, cambia mayúsculas y minúsculas, pasa números a romanos o entre binario, decimal y hexadecimal." },
  utilidades: { slug: "utilidades", icon: "🛠️", title: "Utilidades online", intro: "Genera contraseñas seguras y números aleatorios para sorteos, convierte unidades de medida o calcula la edad de tu perro o gato en años humanos." },
};

export const ICONS: Record<string, string> = {
  "numeros-a-letras": "🔤", "letra-dni": "🪪", "validar-iban": "🏦", "dias-entre-fechas": "📆", "calculadora-edad": "🎂",
  "sumar-dias-fecha": "➕", "sumar-horas": "⏱️", "calculadora-porcentajes": "％", "calculadora-iva": "🧾", "regla-de-tres": "📐",
  "calculadora-nota-media": "🎓", "calculadora-hipoteca": "🏠", "interes-compuesto": "📈", "contador-palabras": "📝",
  "convertir-mayusculas-minusculas": "🔠", "numeros-romanos": "🏛️", "generador-contrasenas": "🔐", "calculadora-imc": "⚖️",
  "fecha-probable-de-parto": "🤰", "mcd-mcm": "➗", "calculadora-descuentos": "🏷️", "coste-viaje-gasolina": "⛽",
  "conversor-unidades": "📏", "semana-del-ano": "🗓️", "numero-aleatorio": "🎲", "cuenta-atras": "⏳",
  "calculadora-fracciones": "½", "media-mediana-moda": "📊", "area-perimetro": "🔷", "conversor-binario-decimal": "💻",
  "calculadora-prestamo": "💳", "tin-tae": "🏛", "vacaciones-proporcionales": "🏖️", "horas-entre-dos-horas": "🕘",
  "calculadora-ritmo-running": "🏃", "edad-perro-gato-anos-humanos": "🐶",
  "calculadora-sueldo-neto": "💼", "calculadora-finiquito": "📄",
};

/** Les que surten destacades a la portada. */
export const POPULAR = ["calculadora-sueldo-neto", "calculadora-iva", "calculadora-porcentajes", "calculadora-finiquito", "calculadora-hipoteca", "letra-dni", "numeros-a-letras", "dias-entre-fechas"];

export type ToolMeta = {
  slug: string;
  category: Category;
  name: string; // nombre corto para tarjetas y menús
  title: string; // <title> y H1
  description: string; // meta description
  intro: string;
  howTo: { title: string; body: string[] };
  faq: [string, string][];
};

export const TOOLS: ToolMeta[] = [
  {
    slug: "numeros-a-letras",
    category: "texto",
    name: "Números a letras",
    title: "Convertir números a letras (también en euros)",
    description: "Convierte cualquier número a letras en español al instante: cantidades en euros con céntimos para facturas, cheques y contratos. Gratis y sin registro.",
    intro: "Escribe un número y te lo devolvemos escrito en letras, con las reglas de la RAE. Activa «euros» para facturas, cheques, recibos o contratos.",
    howTo: {
      title: "Cómo se escriben los números en letras",
      body: [
        "Del 16 al 29 se escriben en una sola palabra: dieciséis, veintiuno, veintidós. A partir del 31 se usa «y»: treinta y uno, cuarenta y cinco.",
        "«Cien» se usa solo para el 100 exacto; a partir de 101 se escribe «ciento»: ciento uno, ciento cincuenta.",
        "Delante de un sustantivo masculino, «uno» se convierte en «un» y «veintiuno» en «veintiún»: veintiún euros, treinta y un mil, un millón.",
        "Cuando una cantidad es un número redondo de millones, se escribe «de euros»: un millón de euros, dos millones de euros.",
      ],
    },
    faq: [
      ["¿Cómo se escribe 1.000.000 en letras?", "Un millón. Si es una cantidad de dinero: un millón de euros."],
      ["¿Se escribe veintiún euros o veintiuno euros?", "Veintiún euros. Delante de un sustantivo masculino, «veintiuno» pierde la última vocal."],
      ["¿Cómo pongo los céntimos en un cheque?", "Se escriben después de «con»: «doscientos euros con cincuenta céntimos». Activa la opción de euros y te lo escribe así."],
    ],
  },
  {
    slug: "letra-dni",
    category: "documentos",
    name: "Letra del DNI y NIE",
    title: "Calcular la letra del DNI y del NIE (y validarlo)",
    description: "Calcula la letra del DNI o NIE a partir de los números, o comprueba si un DNI es correcto. Algoritmo oficial del Ministerio del Interior.",
    intro: "Escribe los 8 números de un DNI (o un NIE que empiece por X, Y o Z) y te calculamos la letra. Si escribes el DNI completo, te decimos si es válido.",
    howTo: {
      title: "Cómo se calcula la letra del DNI",
      body: [
        "Se divide el número del DNI entre 23 y se toma el resto, que va de 0 a 22.",
        "Cada resto corresponde a una letra de esta secuencia: T R W A G M Y F P D X B N J Z S Q V H L C K E. Por ejemplo, resto 0 = T, resto 1 = R.",
        "En el NIE, la letra inicial se sustituye por un número (X = 0, Y = 1, Z = 2) y se hace el mismo cálculo.",
      ],
    },
    faq: [
      ["¿Por qué no se usan las letras I, Ñ, O ni U?", "Para evitar confusiones con números (I con 1, O con 0) y con otras letras."],
      ["¿Un DNI con la letra correcta es un DNI real?", "No necesariamente: la letra solo comprueba que no hay errores al escribirlo, no que el documento exista."],
      ["¿Se guardan los DNI que escribo?", "No. El cálculo se hace en tu navegador y no se envía a ningún sitio."],
    ],
  },
  {
    slug: "validar-iban",
    category: "documentos",
    name: "Validar IBAN",
    title: "Validar IBAN: comprueba si un número de cuenta es correcto",
    description: "Comprueba al instante si un IBAN español o europeo es válido calculando sus dígitos de control. Evita transferencias a cuentas mal escritas.",
    intro: "Pega un IBAN (con o sin espacios) y te decimos si es correcto. Comprobamos la longitud del país y los dígitos de control.",
    howTo: {
      title: "Cómo se comprueba un IBAN",
      body: [
        "Un IBAN español tiene 24 caracteres: ES, 2 dígitos de control y los 20 dígitos de la cuenta.",
        "Para validarlo se mueven los 4 primeros caracteres al final, se cambian las letras por números (A = 10, B = 11...) y se divide entre 97. Si el resto es 1, el IBAN es correcto.",
        "Así se detectan casi todos los errores de un solo dígito o de dos dígitos intercambiados.",
      ],
    },
    faq: [
      ["¿Un IBAN válido garantiza que la cuenta existe?", "No. Indica que el número está bien formado, pero no que la cuenta esté abierta o sea de quien dice ser."],
      ["¿Cuántos dígitos tiene un IBAN español?", "24 caracteres en total: ES + 22 números."],
      ["¿Es seguro pegar mi IBAN aquí?", "Sí: la comprobación se hace en tu navegador y el IBAN no sale de tu dispositivo."],
    ],
  },
  {
    slug: "dias-entre-fechas",
    category: "fechas",
    name: "Días entre fechas",
    title: "Calcular días entre dos fechas (naturales y laborables)",
    description: "Calcula cuántos días, semanas y días laborables hay entre dos fechas. Ideal para plazos, contratos, vacaciones y cuentas atrás.",
    intro: "Elige dos fechas y te decimos cuántos días hay entre ellas, cuántas semanas y cuántos días laborables (de lunes a viernes).",
    howTo: {
      title: "Cómo se cuentan los días",
      body: [
        "Contamos los días que pasan de una fecha a la otra, sin incluir el día final. Del 1 al 3 de enero hay 2 días.",
        "Los días laborables son los de lunes a viernes. No descontamos los festivos porque cambian según la comunidad autónoma y el municipio.",
        "Si necesitas incluir el día final (por ejemplo, para contar días de vacaciones), suma 1 al resultado.",
      ],
    },
    faq: [
      ["¿Incluye el primer y el último día?", "Cuenta el primero pero no el último, que es como se calculan normalmente los plazos. Si quieres incluir ambos, suma un día."],
      ["¿Descuenta los festivos?", "No, solo los fines de semana, porque los festivos dependen de cada comunidad autónoma y municipio."],
      ["¿Tiene en cuenta los años bisiestos?", "Sí, el cálculo usa el calendario real."],
    ],
  },
  {
    slug: "calculadora-edad",
    category: "fechas",
    name: "Calculadora de edad",
    title: "Calculadora de edad exacta: años, meses y días",
    description: "Calcula tu edad exacta en años, meses y días, los días que has vivido y cuánto falta para tu próximo cumpleaños.",
    intro: "Pon tu fecha de nacimiento y te decimos tu edad exacta, cuántos días has vivido y cuánto falta para tu cumpleaños.",
    howTo: {
      title: "Cómo se calcula la edad exacta",
      body: [
        "Primero contamos los años completos desde tu nacimiento, luego los meses completos desde tu último cumpleaños y, por último, los días que sobran.",
        "Si naciste el 29 de febrero, en los años no bisiestos consideramos que cumples el 28 de febrero.",
      ],
    },
    faq: [
      ["¿Puedo calcular la edad en una fecha concreta?", "Sí, cambia la fecha de referencia (por defecto es hoy) y te calcula la edad que tendrás o tenías ese día."],
      ["¿Cómo funciona con los nacidos el 29 de febrero?", "En los años no bisiestos se toma el 28 de febrero como día del cumpleaños."],
    ],
  },
  {
    slug: "sumar-dias-fecha",
    category: "fechas",
    name: "Sumar días a una fecha",
    title: "Sumar o restar días a una fecha (también laborables)",
    description: "Suma o resta días naturales o laborables a una fecha y obtén la fecha resultante. Perfecto para calcular plazos y vencimientos.",
    intro: "Elige una fecha y cuántos días quieres sumar o restar. Puedes contar solo días laborables (de lunes a viernes).",
    howTo: {
      title: "Cómo calcular un plazo",
      body: [
        "Para un plazo en días naturales, se suman todos los días del calendario.",
        "Para un plazo en días hábiles o laborables, se saltan sábados y domingos. Recuerda que los festivos no los descontamos porque dependen de cada lugar.",
        "Para restar días, escribe un número negativo (por ejemplo, -30).",
      ],
    },
    faq: [
      ["¿Qué fecha es dentro de 30 días?", "Pon la fecha de hoy y 30 días: te damos la fecha exacta y el día de la semana."],
      ["¿Los días hábiles incluyen el sábado?", "En esta calculadora no: contamos de lunes a viernes. En algunos ámbitos (como el administrativo) el sábado tampoco es hábil."],
    ],
  },
  {
    slug: "sumar-horas",
    category: "fechas",
    name: "Sumar horas",
    title: "Sumar horas y minutos (calculadora de horas trabajadas)",
    description: "Suma horas y minutos fácilmente: calcula las horas trabajadas de la semana, horas extra o tiempos totales. Formato 8:30, 7h45...",
    intro: "Escribe una cantidad de horas por línea (8:30, 7h45, 1:15...) y te damos el total. Para restar, pon un signo menos delante.",
    howTo: {
      title: "Cómo se suman las horas",
      body: [
        "Las horas no se pueden sumar como números decimales: 7:45 + 0:30 no son 7:75, sino 8:15.",
        "Pasamos todo a minutos, lo sumamos y lo volvemos a convertir a horas y minutos.",
        "También te damos el total en horas decimales (por ejemplo, 8,25 h), que es lo que se usa para multiplicar por un precio por hora.",
      ],
    },
    faq: [
      ["¿Cómo calculo cuánto cobro por horas?", "Multiplica el total en horas decimales por tu precio por hora. Si has trabajado 37,5 h a 12 €/h, cobras 450 €."],
      ["¿Qué formatos acepta?", "8:30, 8.30, 8h30, 8,30 o solo 8 (horas). Los minutos deben estar entre 0 y 59."],
    ],
  },
  {
    slug: "calculadora-porcentajes",
    category: "calculos",
    name: "Porcentajes",
    title: "Calculadora de porcentajes: cuánto es el X% de un número",
    description: "Calcula porcentajes al instante: el X% de una cantidad, qué porcentaje representa un número y el aumento o descuento porcentual entre dos valores.",
    intro: "Tres calculadoras en una: el tanto por ciento de una cantidad, qué porcentaje es un número de otro y cuánto ha subido o bajado algo en porcentaje.",
    howTo: {
      title: "Cómo se calcula un porcentaje",
      body: [
        "El X% de una cantidad = cantidad × X ÷ 100. Por ejemplo, el 15% de 80 = 80 × 15 ÷ 100 = 12.",
        "Qué porcentaje es A de B = A ÷ B × 100. Por ejemplo, 30 de 120 es el 25%.",
        "Variación porcentual = (valor nuevo − valor antiguo) ÷ valor antiguo × 100. Si algo pasa de 80 a 100, ha subido un 25%.",
      ],
    },
    faq: [
      ["¿Cómo calculo un descuento del 20%?", "Multiplica el precio por 0,8. Un artículo de 50 € con un 20% de descuento queda en 40 €."],
      ["¿Subir un 10% y bajar un 10% deja el mismo precio?", "No. 100 + 10% = 110, y 110 − 10% = 99. Por eso las variaciones porcentuales no se compensan."],
    ],
  },
  {
    slug: "calculadora-iva",
    category: "calculos",
    name: "Calculadora de IVA",
    title: "Calculadora de IVA: añadir o quitar el IVA (21%, 10%, 4%)",
    description: "Suma o quita el IVA a cualquier importe con los tipos de España (21%, 10%, 4%) o uno personalizado. Calcula base imponible, cuota y total.",
    intro: "Escribe un importe, elige el tipo de IVA y si quieres añadirlo (a partir de la base) o quitarlo (a partir del total con IVA).",
    howTo: {
      title: "Cómo se calcula el IVA",
      body: [
        "Para añadir el IVA: total = base × (1 + tipo ÷ 100). 100 € + 21% de IVA = 121 €.",
        "Para quitar el IVA de un precio final: base = total ÷ (1 + tipo ÷ 100). De 121 € con IVA, la base es 100 €. No vale con restar el 21% del total: daría 95,59 €, que es incorrecto.",
        "En España, el tipo general es el 21%, el reducido el 10% (hostelería, transporte...) y el superreducido el 4% (pan, libros, medicamentos...).",
      ],
    },
    faq: [
      ["¿Por qué no puedo restar el 21% para quitar el IVA?", "Porque el 21% se calcula sobre la base, no sobre el total. Hay que dividir entre 1,21."],
      ["¿Qué IVA tiene cada producto?", "Depende del producto o servicio. Consulta la normativa de la Agencia Tributaria si tienes dudas."],
    ],
  },
  {
    slug: "regla-de-tres",
    category: "calculos",
    name: "Regla de tres",
    title: "Calculadora de regla de tres simple (directa e inversa)",
    description: "Resuelve cualquier regla de tres simple directa o inversa al instante, con la explicación paso a paso.",
    intro: "Si A es a B, ¿qué es C? Rellena los tres valores y te damos el cuarto. Elige «inversa» cuando una magnitud sube y la otra baja.",
    howTo: {
      title: "Directa o inversa",
      body: [
        "Directa: si una magnitud aumenta, la otra también. Si 2 kg cuestan 10 €, 5 kg cuestan 10 × 5 ÷ 2 = 25 €.",
        "Inversa: si una magnitud aumenta, la otra disminuye. Si 4 personas tardan 6 días, 8 personas tardan 4 × 6 ÷ 8 = 3 días.",
      ],
    },
    faq: [
      ["¿Cómo sé si es directa o inversa?", "Pregúntate: si duplico la primera magnitud, ¿la segunda se duplica (directa) o se reduce a la mitad (inversa)?"],
    ],
  },
  {
    slug: "calculadora-nota-media",
    category: "calculos",
    name: "Nota media",
    title: "Calculadora de nota media ponderada",
    description: "Calcula tu nota media o tu media ponderada por créditos o porcentajes. Para el instituto, la universidad, la EBAU o las oposiciones.",
    intro: "Añade cada nota con su peso (créditos, porcentaje o número de veces) y te calculamos la media ponderada. Si todas pesan igual, deja el peso a 1.",
    howTo: {
      title: "Cómo se calcula la media ponderada",
      body: [
        "Se multiplica cada nota por su peso, se suma todo y se divide entre la suma de los pesos.",
        "Ejemplo: un examen que vale el 40% con un 8 y otro que vale el 60% con un 6 → (8 × 40 + 6 × 60) ÷ 100 = 6,8.",
      ],
    },
    faq: [
      ["¿Cómo calculo la media del expediente universitario?", "Pon cada asignatura con su nota y sus créditos como peso. Es la fórmula oficial de la media ponderada por créditos."],
      ["¿Qué nota necesito en el examen final para aprobar?", "Prueba diferentes notas en la fila del examen final hasta que la media llegue a 5."],
    ],
  },
  {
    slug: "calculadora-hipoteca",
    category: "finanzas",
    name: "Calculadora de hipoteca",
    title: "Calculadora de hipoteca: cuota mensual e intereses",
    description: "Calcula la cuota mensual de tu hipoteca, los intereses totales y el cuadro de amortización año a año. Sistema francés, el habitual en España.",
    intro: "Indica el importe del préstamo, el tipo de interés y el plazo. Te calculamos la cuota mensual, cuánto pagarás en intereses y cómo baja la deuda cada año.",
    howTo: {
      title: "Cómo se calcula la cuota de una hipoteca",
      body: [
        "En España casi todas las hipotecas usan el sistema francés: pagas la misma cuota cada mes, pero al principio una gran parte son intereses y al final casi todo es capital.",
        "La fórmula es: cuota = capital × i ÷ (1 − (1 + i)^−n), donde i es el interés mensual (interés anual ÷ 12) y n el número de meses.",
        "Para una hipoteca variable, el cálculo sirve para el interés actual (euríbor + diferencial); la cuota cambiará cuando se revise el tipo.",
      ],
    },
    faq: [
      ["¿Cuánto pagaré por una hipoteca de 150.000 € a 30 años al 3%?", "Unos 632 € al mes, y unos 77.700 € de intereses en total."],
      ["¿Cuánto debería ser la cuota respecto a mis ingresos?", "Como referencia habitual, los bancos recomiendan que no supere el 30-35% de los ingresos netos."],
      ["¿Incluye seguros, comisiones o gastos?", "No. Es la cuota de capital e intereses. Los seguros vinculados y otros gastos se pagan aparte."],
    ],
  },
  {
    slug: "interes-compuesto",
    category: "finanzas",
    name: "Interés compuesto",
    title: "Calculadora de interés compuesto con aportaciones mensuales",
    description: "Calcula cuánto crecerán tus ahorros con interés compuesto y aportaciones mensuales. Ve la evolución año a año.",
    intro: "Indica el capital inicial, cuánto ahorras cada mes, la rentabilidad anual y los años. Te decimos cuánto tendrás y cuánto será gracias a los intereses.",
    howTo: {
      title: "Qué es el interés compuesto",
      body: [
        "Con el interés compuesto, los intereses que ganas se suman al capital y empiezan a generar intereses ellos también.",
        "Por eso el tiempo es tan importante: 10.000 € al 5% anual se convierten en unos 16.470 € en 10 años, pero en unos 44.700 € en 30 años.",
        "La calculadora capitaliza los intereses cada mes y suma la aportación a final de mes. No tiene en cuenta impuestos, comisiones ni inflación.",
      ],
    },
    faq: [
      ["¿Qué rentabilidad debo poner?", "Depende de dónde inviertas. Una cuenta remunerada puede dar un 2-3%; la bolsa ha dado históricamente más a largo plazo, pero con riesgo y sin garantías."],
      ["¿Tiene en cuenta los impuestos?", "No. En España, los rendimientos tributan en el IRPF como rendimientos del ahorro."],
    ],
  },
  {
    slug: "contador-palabras",
    category: "texto",
    name: "Contador de palabras",
    title: "Contador de palabras y caracteres online",
    description: "Cuenta palabras, caracteres (con y sin espacios), frases y párrafos de cualquier texto al instante. Incluye tiempo de lectura.",
    intro: "Pega o escribe tu texto y verás al momento cuántas palabras, caracteres, frases y párrafos tiene, y cuánto se tarda en leerlo.",
    howTo: {
      title: "Para qué sirve",
      body: [
        "Para trabajos y redacciones con un mínimo o máximo de palabras, textos para redes sociales con límite de caracteres, descripciones SEO o traducciones que se cobran por palabra.",
        "El tiempo de lectura se calcula a unas 200 palabras por minuto, que es la velocidad media de lectura en voz baja.",
      ],
    },
    faq: [
      ["¿Se guarda mi texto?", "No. Todo se calcula en tu navegador y el texto no sale de tu dispositivo."],
      ["¿Cuenta los espacios como caracteres?", "Te damos las dos cifras: caracteres con espacios y sin espacios."],
    ],
  },
  {
    slug: "convertir-mayusculas-minusculas",
    category: "texto",
    name: "Mayúsculas y minúsculas",
    title: "Convertir texto a mayúsculas, minúsculas o tipo título",
    description: "Pasa cualquier texto a MAYÚSCULAS, minúsculas, Tipo Título o tipo oración con un clic, y cópialo al instante.",
    intro: "Pega el texto y elige cómo lo quieres: todo en mayúsculas, todo en minúsculas, con mayúscula al principio de cada frase o de cada palabra importante.",
    howTo: {
      title: "Cuándo usar cada formato",
      body: [
        "Tipo oración: el estándar en español. Mayúscula solo al principio de la frase y en los nombres propios.",
        "Tipo título: útil para títulos de trabajos o presentaciones. Ojo: en español, la norma de la RAE es escribir los títulos de obras solo con la primera mayúscula.",
        "Si has escrito un texto con el Bloq Mayús activado por error, pasa el texto a «tipo oración» y revisa los nombres propios.",
      ],
    },
    faq: [
      ["¿Respeta las tildes y la ñ?", "Sí, convierte correctamente á, é, í, ó, ú, ü y ñ."],
    ],
  },
  {
    slug: "numeros-romanos",
    category: "texto",
    name: "Números romanos",
    title: "Conversor de números romanos (y a números normales)",
    description: "Convierte números a números romanos y números romanos a números arábigos del 1 al 3999. Con explicación de las reglas.",
    intro: "Escribe un número (del 1 al 3999) o un número romano y te lo convertimos al momento.",
    howTo: {
      title: "Reglas de los números romanos",
      body: [
        "Los símbolos son I = 1, V = 5, X = 10, L = 50, C = 100, D = 500 y M = 1000.",
        "Un símbolo a la izquierda de otro mayor se resta: IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM = 900.",
        "Un mismo símbolo no se repite más de tres veces seguidas: 4 es IV, no IIII.",
      ],
    },
    faq: [
      ["¿Cómo se escribe 2026 en números romanos?", "MMXXVI."],
      ["¿Por qué solo hasta 3999?", "Porque con los símbolos clásicos el número más alto que se puede escribir es MMMCMXCIX (3999)."],
    ],
  },
  {
    slug: "generador-contrasenas",
    category: "utilidades",
    name: "Generador de contraseñas",
    title: "Generador de contraseñas seguras",
    description: "Crea contraseñas seguras y aleatorias con letras, números y símbolos. Se generan en tu navegador y nunca salen de tu dispositivo.",
    intro: "Elige la longitud y los tipos de caracteres. Generamos la contraseña en tu navegador con el generador aleatorio criptográfico: nadie más la ve.",
    howTo: {
      title: "Qué hace segura una contraseña",
      body: [
        "La longitud es lo más importante: una contraseña de 16 caracteres aleatorios es muchísimo más difícil de romper que una de 8.",
        "No reutilices contraseñas: si una web sufre una filtración, las cuentas donde usas la misma contraseña quedan expuestas.",
        "Usa un gestor de contraseñas para guardarlas y activa la verificación en dos pasos siempre que puedas.",
      ],
    },
    faq: [
      ["¿Guardáis las contraseñas que genero?", "No. Se generan en tu navegador y no se envían a ningún servidor."],
      ["¿Qué significa «sin caracteres ambiguos»?", "Quita los que se confunden fácilmente (l, I, 1, O, 0), útil si tienes que copiar la contraseña a mano."],
    ],
  },
  {
    slug: "calculadora-imc",
    category: "salud",
    name: "Calculadora de IMC",
    title: "Calculadora de IMC: calcula tu índice de masa corporal",
    description: "Calcula tu índice de masa corporal (IMC) con tu peso y tu altura, y descubre en qué rango estás según la OMS y cuál sería tu peso saludable.",
    intro: "Introduce tu peso y tu altura y te decimos tu IMC, en qué categoría estás según la Organización Mundial de la Salud y qué rango de peso se considera saludable para tu altura.",
    howTo: {
      title: "Cómo se calcula el IMC",
      body: [
        "El IMC es el peso en kilos dividido entre la altura en metros al cuadrado. Una persona de 70 kg y 1,75 m tiene un IMC de 70 ÷ (1,75 × 1,75) = 22,9.",
        "Según la OMS, en adultos: menos de 18,5 es bajo peso, de 18,5 a 24,9 es peso normal, de 25 a 29,9 es sobrepeso y 30 o más es obesidad.",
        "El IMC es orientativo: no distingue entre músculo y grasa, y no sirve igual para deportistas, embarazadas, niños o personas mayores. Consulta con un profesional sanitario si tienes dudas.",
      ],
    },
    faq: [
      ["¿Qué IMC es normal?", "En adultos, un IMC entre 18,5 y 24,9 se considera peso normal según la OMS."],
      ["¿El IMC sirve para niños?", "No directamente: en niños y adolescentes se usan tablas de percentiles según la edad y el sexo."],
      ["¿Es fiable el IMC?", "Es una referencia rápida y útil para la mayoría de adultos, pero no mide la grasa corporal. Una persona muy musculada puede salir con sobrepeso sin tenerlo."],
    ],
  },
  {
    slug: "fecha-probable-de-parto",
    category: "salud",
    name: "Fecha probable de parto",
    title: "Calculadora de embarazo: fecha probable de parto y semanas",
    description: "Calcula la fecha probable de parto a partir de la última regla y descubre de cuántas semanas estás embarazada y en qué trimestre.",
    intro: "Pon la fecha de inicio de tu última regla y te calculamos la fecha probable de parto, las semanas de embarazo que llevas y el trimestre en el que estás.",
    howTo: {
      title: "Cómo se calcula la fecha probable de parto",
      body: [
        "Se usa la regla de Naegele: se suman 280 días (40 semanas) al primer día de la última regla.",
        "Las semanas de embarazo se cuentan también desde la última regla, aunque la concepción suele producirse unas dos semanas después.",
        "Es una estimación: solo una pequeña parte de los partos se producen exactamente ese día. La fecha que te dé tu ginecólogo o comadrona con la ecografía es la que manda.",
      ],
    },
    faq: [
      ["¿Cuántas semanas dura un embarazo?", "Unas 40 semanas contando desde la última regla. Se considera a término entre la semana 37 y la 42."],
      ["¿Qué pasa si mis ciclos son irregulares?", "El cálculo será menos preciso. La ecografía del primer trimestre es la forma más fiable de datar el embarazo."],
    ],
  },
  {
    slug: "mcd-mcm",
    category: "calculos",
    name: "MCD y MCM",
    title: "Calculadora de máximo común divisor y mínimo común múltiplo",
    description: "Calcula el máximo común divisor (MCD) y el mínimo común múltiplo (mcm) de dos o más números al instante, con la explicación.",
    intro: "Escribe dos o más números separados por comas o espacios y te damos su máximo común divisor y su mínimo común múltiplo.",
    howTo: {
      title: "Cómo se calculan el MCD y el mcm",
      body: [
        "El máximo común divisor es el número más grande que divide a todos exactamente. El de 12, 18 y 24 es 6.",
        "El mínimo común múltiplo es el número más pequeño que es múltiplo de todos. El de 4, 6 y 10 es 60.",
        "Para dos números se cumple que MCD × mcm = a × b. La calculadora usa el algoritmo de Euclides, que es el más rápido.",
      ],
    },
    faq: [
      ["¿Para qué sirve el mínimo común múltiplo?", "Por ejemplo, para sumar fracciones con distinto denominador: el denominador común es el mcm."],
      ["¿Cuánto vale el MCD de dos números primos?", "Siempre 1. Por eso se dice que son primos entre sí."],
    ],
  },
  {
    slug: "calculadora-descuentos",
    category: "calculos",
    name: "Calculadora de descuentos",
    title: "Calculadora de descuentos: precio final con rebaja",
    description: "Calcula el precio final de un producto con descuento y cuánto te ahorras. También con descuentos acumulados (rebajas + cupón).",
    intro: "Pon el precio y el porcentaje de descuento y te decimos cuánto pagarás y cuánto te ahorras. Puedes añadir un segundo descuento para las rebajas con cupón.",
    howTo: {
      title: "Cómo se calcula un descuento",
      body: [
        "Precio final = precio × (1 − descuento ÷ 100). Un artículo de 80 € con un 25% de descuento cuesta 80 × 0,75 = 60 €.",
        "Dos descuentos no se suman: un 20% y luego un 10% más no es un 30%, sino un 28%, porque el segundo se aplica sobre el precio ya rebajado.",
      ],
    },
    faq: [
      ["¿Un 50% + 50% es gratis?", "No. Es un 75% de descuento: el segundo 50% se aplica sobre la mitad del precio."],
      ["¿Cómo sé el porcentaje de descuento que me han hecho?", "Usa la calculadora de porcentajes: la variación entre el precio inicial y el final te da el descuento real."],
    ],
  },
  {
    slug: "coste-viaje-gasolina",
    category: "finanzas",
    name: "Coste de un viaje",
    title: "Calculadora de gasolina: cuánto cuesta un viaje en coche",
    description: "Calcula cuánto te costará un viaje en coche según los kilómetros, el consumo y el precio del combustible, y cuánto toca pagar a cada uno.",
    intro: "Indica los kilómetros, el consumo de tu coche y el precio del litro de gasolina o diésel. Te decimos cuánto costará el viaje y cuánto debe poner cada persona.",
    howTo: {
      title: "Cómo calcular el gasto de combustible",
      body: [
        "Litros = kilómetros × consumo ÷ 100. Coste = litros × precio por litro.",
        "Un viaje de 500 km con un coche que gasta 6 l/100 km necesita 30 litros. A 1,60 €/l, son 48 €.",
        "El consumo real depende de la velocidad, el tráfico, la carga y el aire acondicionado. En autopista a velocidad alta suele ser mayor que el oficial.",
      ],
    },
    faq: [
      ["¿Cuánto consume mi coche?", "Lo tienes en la ficha técnica o en el ordenador de a bordo. Un turismo medio gasta entre 5 y 7 litros cada 100 km."],
      ["¿Incluye los peajes?", "No, solo el combustible. Si hay peajes, súmalos aparte."],
    ],
  },
  {
    slug: "conversor-unidades",
    category: "utilidades",
    name: "Conversor de unidades",
    title: "Conversor de unidades: longitud, peso, volumen y temperatura",
    description: "Convierte unidades al instante: km a millas, kilos a libras, litros a galones, metros cuadrados a hectáreas, Celsius a Fahrenheit y más.",
    intro: "Elige la magnitud, escribe la cantidad y las unidades de origen y destino. El resultado se actualiza al momento.",
    howTo: {
      title: "Las conversiones más buscadas",
      body: [
        "1 milla = 1,609 km; 1 kilómetro = 0,621 millas. 1 pulgada = 2,54 cm; 1 pie = 30,48 cm.",
        "1 kilo = 2,205 libras; 1 libra = 453,6 gramos. 1 onza = 28,35 gramos.",
        "Para pasar de grados Celsius a Fahrenheit: °F = °C × 9 ÷ 5 + 32. 20 °C son 68 °F.",
        "1 hectárea = 10.000 m². 1 acre = 4.047 m².",
      ],
    },
    faq: [
      ["¿Cuántos centímetros tiene una pulgada?", "2,54 cm exactos. Una pantalla de 55 pulgadas mide unos 140 cm de diagonal."],
      ["¿Cuántos grados Fahrenheit son 37 °C?", "98,6 °F, la temperatura corporal normal."],
    ],
  },
  {
    slug: "semana-del-ano",
    category: "fechas",
    name: "Semana del año",
    title: "¿En qué semana del año estamos? Número de semana actual",
    description: "Descubre en qué número de semana estamos hoy (calendario ISO, el que se usa en España) o la semana de cualquier fecha.",
    intro: "Te decimos el número de semana de hoy según el calendario ISO 8601, el que se usa en España y en Europa. También puedes elegir cualquier otra fecha.",
    howTo: {
      title: "Cómo se numeran las semanas",
      body: [
        "En el calendario ISO 8601, las semanas empiezan en lunes y la semana 1 es la que contiene el primer jueves del año.",
        "Por eso los primeros días de enero pueden pertenecer a la última semana del año anterior, y un año puede tener 52 o 53 semanas.",
        "En Estados Unidos se usa otro sistema (semanas que empiezan en domingo), así que el número puede variar en uno.",
      ],
    },
    faq: [
      ["¿Cuántas semanas tiene un año?", "52 o 53 según el calendario ISO. Tienen 53 los años que empiezan en jueves (o en miércoles, si son bisiestos)."],
      ["¿La semana empieza en lunes o en domingo?", "En España y en el estándar ISO, en lunes."],
    ],
  },
  {
    slug: "numero-aleatorio",
    category: "utilidades",
    name: "Número aleatorio",
    title: "Generador de números aleatorios para sorteos",
    description: "Genera números aleatorios entre dos valores, uno o varios, con o sin repetición. Perfecto para sorteos, rifas y concursos en redes sociales.",
    intro: "Elige el rango y cuántos números quieres. Usamos el generador aleatorio criptográfico de tu navegador, así que el resultado es imparcial.",
    howTo: {
      title: "Cómo hacer un sorteo justo",
      body: [
        "Numera a los participantes (por ejemplo, por orden de comentario) y genera un número entre 1 y el total de participantes.",
        "Si hay varios premios, activa «sin repetir» para que no salga dos veces el mismo ganador.",
        "Para que sea transparente, haz una captura de pantalla o graba el sorteo y publícalo.",
      ],
    },
    faq: [
      ["¿Los números son realmente aleatorios?", "Sí: usamos crypto.getRandomValues, el generador criptográfico del navegador, sin sesgos."],
      ["¿Puedo sacar varios números sin que se repitan?", "Sí, activa la opción «sin repetir». Ideal para sorteos con varios premios o para la lotería."],
    ],
  },
  {
    slug: "cuenta-atras",
    category: "fechas",
    name: "Cuenta atrás",
    title: "Cuenta atrás: cuántos días faltan para una fecha",
    description: "Calcula cuántos días, horas y minutos faltan para cualquier fecha: un viaje, un cumpleaños, una boda o las vacaciones.",
    intro: "Elige la fecha (y la hora, si quieres) y verás una cuenta atrás en directo con los días, horas, minutos y segundos que faltan.",
    howTo: {
      title: "Cuentas atrás populares",
      body: [
        "También tenemos cuentas atrás preparadas para las fechas más esperadas del año: Navidad, Nochevieja, el Día de Reyes, Semana Santa, el verano, Halloween o el Black Friday.",
      ],
    },
    faq: [
      ["¿Cuenta el día de hoy?", "La cuenta atrás va hasta el instante exacto que elijas; si no pones hora, hasta las 00:00 de ese día."],
    ],
  },
  {
    slug: "calculadora-fracciones",
    category: "calculos",
    name: "Calculadora de fracciones",
    title: "Calculadora de fracciones: sumar, restar, multiplicar y dividir",
    description: "Suma, resta, multiplica y divide fracciones y obtén el resultado simplificado, como número mixto y en decimal. Con la explicación paso a paso.",
    intro: "Escribe dos fracciones (por ejemplo 1/2 y 3/4, también números mixtos como 1 1/2 o decimales) y elige la operación. Te damos el resultado simplificado.",
    howTo: {
      title: "Cómo se opera con fracciones",
      body: [
        "Para sumar o restar se busca un denominador común: a/b + c/d = (a·d + c·b) / (b·d). Después se simplifica dividiendo arriba y abajo por el máximo común divisor.",
        "Para multiplicar se multiplican numeradores y denominadores: a/b × c/d = (a·c) / (b·d).",
        "Para dividir se multiplica por la fracción inversa: a/b ÷ c/d = (a·d) / (b·c).",
      ],
    },
    faq: [
      ["¿Cómo se simplifica una fracción?", "Dividiendo el numerador y el denominador entre su máximo común divisor. 6/8 se simplifica a 3/4 dividiendo entre 2."],
      ["¿Qué es un número mixto?", "Un entero más una fracción: 7/3 es 2 1/3, es decir, dos enteros y un tercio."],
    ],
  },
  {
    slug: "media-mediana-moda",
    category: "calculos",
    name: "Media, mediana y moda",
    title: "Calcular la media, la mediana y la moda (y la desviación típica)",
    description: "Pega una lista de números y calcula al instante la media, la mediana, la moda, el rango y la desviación típica. Para estadística del colegio o del trabajo.",
    intro: "Escribe o pega los números separados por comas, espacios o saltos de línea. Te calculamos las medidas estadísticas más habituales.",
    howTo: {
      title: "Qué es cada medida",
      body: [
        "La media es la suma de todos los valores dividida entre cuántos hay. La mediana es el valor central cuando los ordenas (si hay un número par de datos, la media de los dos centrales). La moda es el valor que más se repite.",
        "El rango es la diferencia entre el valor más alto y el más bajo, y la desviación típica mide cuánto se alejan los datos de la media.",
        "Usa la desviación típica poblacional si tienes todos los datos, y la muestral si es una muestra de un grupo mayor.",
      ],
    },
    faq: [
      ["¿Cuándo es mejor la mediana que la media?", "Cuando hay valores extremos. En sueldos, por ejemplo, unos pocos sueldos muy altos suben mucho la media, pero apenas mueven la mediana."],
      ["¿Puede haber más de una moda?", "Sí. Si dos valores se repiten el mismo número de veces, la distribución es bimodal."],
    ],
  },
  {
    slug: "area-perimetro",
    category: "calculos",
    name: "Área y perímetro",
    title: "Calculadora de área y perímetro: cuadrado, rectángulo, círculo y triángulo",
    description: "Calcula el área y el perímetro de un cuadrado, un rectángulo, un círculo o un triángulo (con la fórmula de Herón). Con las fórmulas explicadas.",
    intro: "Elige la figura e introduce sus medidas. Te damos el área y el perímetro al momento, en las mismas unidades que uses.",
    howTo: {
      title: "Fórmulas de área y perímetro",
      body: [
        "Cuadrado: área = lado², perímetro = 4 × lado. Rectángulo: área = base × altura, perímetro = 2 × (base + altura).",
        "Círculo: área = π × radio², perímetro (circunferencia) = 2 × π × radio.",
        "Triángulo con sus tres lados: perímetro = a + b + c; el área se calcula con la fórmula de Herón, √(s(s−a)(s−b)(s−c)), donde s es el semiperímetro.",
      ],
    },
    faq: [
      ["¿Cómo calculo los metros cuadrados de una habitación?", "Multiplica el largo por el ancho en metros. Una habitación de 4 × 3 m tiene 12 m²."],
      ["¿Por qué no me deja calcular un triángulo?", "Porque con esas medidas no existe: cada lado tiene que ser menor que la suma de los otros dos."],
    ],
  },
  {
    slug: "conversor-binario-decimal",
    category: "texto",
    name: "Binario, decimal y hexadecimal",
    title: "Conversor binario, decimal, octal y hexadecimal",
    description: "Convierte números entre binario, decimal, octal y hexadecimal al instante, incluso números muy grandes. Para clase, programación y electrónica.",
    intro: "Elige la base del número que tienes, escríbelo y te lo damos en las otras tres bases.",
    howTo: {
      title: "Cómo funcionan las bases numéricas",
      body: [
        "En base 10 (decimal) cada posición vale 10 veces más que la anterior. En base 2 (binario) cada posición vale el doble: 1101 = 8 + 4 + 0 + 1 = 13.",
        "El hexadecimal usa 16 símbolos (0-9 y A-F) y es muy cómodo en informática porque cada cifra equivale a 4 bits: FF = 255 = 11111111.",
      ],
    },
    faq: [
      ["¿Cuánto es 255 en binario?", "11111111 (ocho unos), que en hexadecimal es FF."],
      ["¿Admite números grandes?", "Sí, trabaja con enteros de cualquier tamaño sin perder precisión."],
    ],
  },
  {
    slug: "calculadora-prestamo",
    category: "finanzas",
    name: "Calculadora de préstamos",
    title: "Calculadora de préstamos personales: cuota mensual e intereses",
    description: "Calcula la cuota mensual de un préstamo personal o para el coche, los intereses totales y lo que pagarás en total, según el importe, el interés y los meses.",
    intro: "Indica cuánto pides, el tipo de interés (TIN) y en cuántos meses lo devuelves. Te calculamos la cuota y cuánto te cuesta realmente el préstamo.",
    howTo: {
      title: "Cómo se calcula la cuota de un préstamo",
      body: [
        "Los préstamos personales en España suelen usar el sistema francés: la misma cuota cada mes, con más intereses al principio.",
        "Cuota = importe × i ÷ (1 − (1 + i)^−n), donde i es el TIN anual ÷ 12 y n el número de meses.",
        "Para comparar préstamos, fíjate en la TAE, que incluye las comisiones y la frecuencia de pago. Puedes pasar de TIN a TAE con nuestra calculadora.",
      ],
    },
    faq: [
      ["¿Cuánto pagaré por un préstamo de 10.000 € a 5 años al 7%?", "Unos 198 € al mes, y unos 1.880 € de intereses en total."],
      ["¿Incluye comisiones?", "No: es la cuota de capital e intereses. Las comisiones de apertura y los seguros vinculados se pagan aparte."],
    ],
  },
  {
    slug: "tin-tae",
    category: "finanzas",
    name: "TIN a TAE",
    title: "Calculadora TIN a TAE (y de TAE a TIN)",
    description: "Convierte el TIN de un préstamo, hipoteca o depósito a TAE y al revés, según la frecuencia de pago. Entiende cuánto cuesta o rinde de verdad.",
    intro: "Escribe el TIN (o la TAE) y la frecuencia con la que se pagan los intereses. Te damos el otro valor al instante.",
    howTo: {
      title: "Diferencia entre TIN y TAE",
      body: [
        "El TIN (tipo de interés nominal) es el porcentaje que se aplica al capital. La TAE (tasa anual equivalente) tiene en cuenta además cada cuánto se pagan o cobran los intereses.",
        "TAE = (1 + TIN ÷ n)^n − 1, donde n es el número de pagos al año (12 si es mensual). Un TIN del 5% con pagos mensuales equivale a una TAE del 5,12%.",
        "La TAE oficial de un producto incluye también las comisiones y algunos gastos, así que la que te dé el banco puede ser algo mayor que la de esta calculadora.",
      ],
    },
    faq: [
      ["¿Qué es mejor, fijarse en el TIN o en la TAE?", "En la TAE: es el dato que permite comparar productos con distintas comisiones y frecuencias de pago."],
      ["¿Por qué la TAE es mayor que el TIN?", "Porque los intereses que se pagan antes de fin de año generan, a su vez, intereses."],
    ],
  },
  {
    slug: "vacaciones-proporcionales",
    category: "fechas",
    name: "Vacaciones proporcionales",
    title: "Calculadora de vacaciones proporcionales: días que te corresponden",
    description: "Calcula cuántos días de vacaciones te corresponden según el tiempo trabajado, para un contrato que empieza o acaba a mitad de año o para el finiquito.",
    intro: "Indica las fechas de inicio y fin del periodo trabajado y los días de vacaciones al año de tu convenio. Te decimos cuántos días has generado y cuántos te quedan.",
    howTo: {
      title: "Cómo se calculan las vacaciones",
      body: [
        "El Estatuto de los Trabajadores fija un mínimo de 30 días naturales de vacaciones al año. Muchos convenios lo expresan en días laborables (normalmente 22) o mejoran esa cifra.",
        "Si no has trabajado el año entero, te corresponde la parte proporcional: días al año × días trabajados ÷ 365. Medio año da unos 15 días naturales.",
        "Las vacaciones no disfrutadas al terminar un contrato se pagan en el finiquito. Revisa siempre tu convenio, que manda sobre esta estimación.",
      ],
    },
    faq: [
      ["¿Cuántos días de vacaciones me tocan al año?", "Como mínimo 30 días naturales, según el artículo 38 del Estatuto de los Trabajadores. Tu convenio puede darte más."],
      ["¿Se redondean los días?", "Depende de la empresa y del convenio; lo habitual es redondear hacia arriba a favor del trabajador, pero no es obligatorio."],
    ],
  },
  {
    slug: "horas-entre-dos-horas",
    category: "fechas",
    name: "Horas entre dos horas",
    title: "Calcular las horas entre dos horas (también turnos de noche)",
    description: "Calcula cuántas horas y minutos hay entre una hora de entrada y una de salida, descontando la pausa. Funciona con turnos que pasan la medianoche.",
    intro: "Pon la hora de entrada, la de salida y, si quieres, los minutos de pausa. Te decimos cuánto tiempo has trabajado, también si el turno acaba al día siguiente.",
    howTo: {
      title: "Cómo se calcula",
      body: [
        "Se resta la hora de entrada a la de salida. Si la salida es más temprana que la entrada (por ejemplo, de 22:00 a 06:00), se entiende que el turno pasa la medianoche y se suman 24 horas.",
        "Después se descuenta la pausa. Para sumar las horas de toda la semana, usa la calculadora de sumar horas.",
      ],
    },
    faq: [
      ["¿Cuántas horas hay de 9:00 a 17:30 con media hora de pausa?", "8 horas."],
      ["¿Funciona con turnos de noche?", "Sí: de 22:00 a 06:00 son 8 horas."],
    ],
  },
  {
    slug: "calculadora-ritmo-running",
    category: "salud",
    name: "Ritmo de carrera",
    title: "Calculadora de ritmo para correr (min/km) y predicción de tiempos",
    description: "Calcula tu ritmo por kilómetro y tu velocidad a partir de la distancia y el tiempo, y descubre qué tiempo harías en 5K, 10K, media maratón y maratón.",
    intro: "Escribe la distancia que has corrido y el tiempo. Te damos tu ritmo (min/km), tu velocidad media y los tiempos a ese ritmo en las distancias clásicas.",
    howTo: {
      title: "Cómo se calcula el ritmo",
      body: [
        "Ritmo = tiempo ÷ distancia. Si corres 10 km en 50 minutos, vas a 5:00 min/km, es decir, a 12 km/h.",
        "Las predicciones suponen que mantienes el mismo ritmo durante toda la distancia. En distancias más largas, lo normal es ir algo más lento.",
      ],
    },
    faq: [
      ["¿Qué ritmo necesito para bajar de 50 minutos en 10K?", "Menos de 5:00 min/km."],
      ["¿A qué ritmo se corre una maratón en 4 horas?", "A unos 5:41 min/km."],
    ],
  },
  {
    slug: "edad-perro-gato-anos-humanos",
    category: "utilidades",
    name: "Edad del perro y del gato",
    title: "Edad de tu perro o gato en años humanos",
    description: "Calcula la edad de tu perro o tu gato en años humanos según su edad y su tamaño, con la regla de los veterinarios y la fórmula científica más reciente.",
    intro: "Elige si es perro o gato, su tamaño y su edad, y te decimos a cuántos años humanos equivale.",
    howTo: {
      title: "¿Un año de perro son siete humanos?",
      body: [
        "No. Esa regla es un mito: los perros maduran muy deprisa al principio. El primer año equivale a unos 15 años humanos y el segundo a unos 9 más.",
        "A partir del tercer año, cada año suma unos 4 años humanos en perros pequeños, 5 en medianos y 6 en grandes, que envejecen antes. En los gatos se suele contar 4 años por año a partir del tercero.",
        "Un estudio de 2020 basado en cambios en el ADN de labradores propuso la fórmula 16 × ln(edad) + 31, que también te mostramos. Son estimaciones: tu veterinario es quien mejor conoce a tu mascota.",
      ],
    },
    faq: [
      ["¿Cuántos años humanos tiene un perro de 5 años?", "Unos 36 si es pequeño, 39 si es mediano y 42 si es grande."],
      ["¿Y un gato de 10 años?", "Unos 56 años humanos."],
    ],
  },
  {
    slug: "calculadora-sueldo-neto",
    category: "finanzas",
    name: "Sueldo neto",
    title: "Calculadora de sueldo neto 2026: de bruto a neto",
    description: "Calcula tu sueldo neto mensual y anual en 2026 a partir del bruto: cotización a la Seguridad Social, retención de IRPF estimada y neto en 12 o 14 pagas.",
    intro: "Escribe tu salario bruto anual, el número de pagas y tu situación familiar. Te estimamos cuánto pagas a la Seguridad Social, cuánto te retienen de IRPF y cuánto cobrarás limpio cada mes.",
    howTo: {
      title: "Cómo se pasa del sueldo bruto al neto",
      body: [
        "Primero se resta la cotización a la Seguridad Social. En 2026, el trabajador aporta el 6,50 % del sueldo con contrato indefinido (4,70 % de contingencias comunes, 1,55 % de desempleo, 0,10 % de formación profesional y 0,15 % del Mecanismo de Equidad Intergeneracional) o el 6,55 % con contrato temporal, con una base máxima de 5.101,20 € al mes.",
        "Después se aplica la retención de IRPF. La empresa la calcula con el procedimiento de la Agencia Tributaria: al sueldo se le restan la Seguridad Social, 2.000 € de gastos y, en sueldos bajos, la reducción por rendimientos del trabajo; se aplica la escala de retención (del 19 % al 47 %) y se descuenta la parte que corresponde al mínimo personal y familiar (5.550 € más los hijos).",
        "Si cobras poco, puede que no te retengan nada: por ejemplo, un soltero sin hijos con un único pagador no tiene retención si gana 15.876 € al año o menos.",
        "La retención es un adelanto del impuesto: lo que pagas de verdad se ajusta en la declaración de la renta, donde también influyen la comunidad autónoma, otras rentas y deducciones.",
      ],
    },
    faq: [
      ["¿Cuánto es 30.000 € brutos en neto?", "Con contrato indefinido, soltero y sin hijos, unos 23.100 € al año: unos 1.650 € al mes en 14 pagas o unos 1.927 € en 12."],
      ["¿Por qué cobro diferente de lo que dice la calculadora?", "Es una estimación: la retención real depende de datos que la empresa conoce (discapacidad, pensiones compensatorias, préstamo de vivienda anterior a 2013, regularizaciones durante el año…) y de tu convenio."],
      ["¿Me sale más neto en 12 o en 14 pagas?", "Al año, lo mismo. En 14 pagas cobras menos cada mes, pero recibes dos pagas extra (normalmente en junio y diciembre)."],
      ["¿El IRPF cambia según la comunidad autónoma?", "La retención de la nómina, no: se calcula con una escala única. El impuesto final de la declaración sí cambia según tu comunidad."],
    ],
  },
  {
    slug: "calculadora-finiquito",
    category: "finanzas",
    name: "Finiquito e indemnización",
    title: "Calculadora de finiquito e indemnización por despido 2026",
    description: "Calcula tu finiquito (salario pendiente, vacaciones no disfrutadas y pagas extra) y la indemnización por despido improcedente, objetivo o fin de contrato.",
    intro: "Indica tu salario bruto anual, las fechas del contrato y cómo termina. Te estimamos el finiquito y, si te corresponde, la indemnización según el Estatuto de los Trabajadores.",
    howTo: {
      title: "Qué incluye el finiquito y cómo se calcula la indemnización",
      body: [
        "El finiquito liquida lo que la empresa te debe al terminar: los días trabajados del último mes, las vacaciones generadas y no disfrutadas, y la parte proporcional de las pagas extra si no las cobras prorrateadas. Te corresponde siempre, también si te vas tú.",
        "La indemnización depende de cómo acaba el contrato. Fin de contrato temporal: 12 días de salario por año trabajado. Despido objetivo: 20 días por año, con un máximo de 12 mensualidades. Despido improcedente: 33 días por año, con un máximo de 720 días. Si te vas voluntariamente o el despido disciplinario es procedente, no hay indemnización.",
        "Si empezaste a trabajar antes del 12 de febrero de 2012, el despido improcedente se calcula a 45 días por año hasta esa fecha y a 33 días desde entonces, con las reglas de la disposición transitoria 11.ª del Estatuto.",
        "El salario diario es el salario bruto anual (con las pagas extra) dividido entre 365, y los periodos de menos de un año se prorratean por meses: un mes empezado cuenta como entero.",
      ],
    },
    faq: [
      ["¿Cuánto me corresponde por despido improcedente con 5 años de antigüedad?", "33 días por año: 165 días de salario. Con un sueldo de 24.000 € al año (65,75 € al día), unos 10.849 €."],
      ["¿Me pagan el finiquito si me voy yo?", "Sí. El finiquito (salario pendiente, vacaciones y pagas extra) se cobra siempre; lo que no tienes es indemnización."],
      ["¿El finiquito tributa?", "El finiquito sí: tiene retención de IRPF y Seguridad Social como una nómina. La indemnización por despido está exenta de IRPF hasta el importe obligatorio por ley (con un límite de 180.000 €)."],
      ["¿Es exacta esta calculadora?", "Es una estimación con las reglas generales. Tu convenio, los complementos salariales o un acuerdo con la empresa pueden cambiar el resultado: revisa siempre el documento antes de firmarlo y, si dudas, consulta con un abogado laboralista o tu sindicato."],
    ],
  },
];

export const toolBySlug = (slug: string) => TOOLS.find((t) => t.slug === slug);
