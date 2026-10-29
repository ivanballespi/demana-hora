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
  calculos: { slug: "calculadoras", icon: "🧮", title: "Calculadoras online gratis", intro: "Porcentajes, IVA, descuentos, regla de tres, nota media, máximo común divisor... Las calculadoras que más se usan en el día a día, con la explicación de cada cálculo." },
  finanzas: { slug: "finanzas", icon: "💶", title: "Calculadoras financieras", intro: "Calcula la cuota de tu hipoteca, cuánto crecerán tus ahorros con el interés compuesto o cuánto te costará un viaje en coche." },
  fechas: { slug: "fechas", icon: "📅", title: "Calculadoras de fechas y tiempo", intro: "Días entre dos fechas, edad exacta, semana del año, cuenta atrás, sumar días a una fecha o sumar horas trabajadas." },
  salud: { slug: "salud", icon: "❤️", title: "Calculadoras de salud", intro: "Calcula tu índice de masa corporal (IMC) o la fecha probable de parto. Son orientativas: ante cualquier duda, consulta con un profesional sanitario." },
  documentos: { slug: "documentos", icon: "🪪", title: "Herramientas para documentos", intro: "Calcula la letra del DNI o NIE y comprueba si un IBAN es correcto antes de hacer una transferencia." },
  texto: { slug: "texto", icon: "✍️", title: "Herramientas de texto", intro: "Convierte números a letras, cuenta palabras y caracteres, cambia mayúsculas y minúsculas o pasa números a romanos." },
  utilidades: { slug: "utilidades", icon: "🛠️", title: "Utilidades online", intro: "Genera contraseñas seguras, números aleatorios para sorteos y convierte unidades de medida." },
};

export const ICONS: Record<string, string> = {
  "numeros-a-letras": "🔤", "letra-dni": "🪪", "validar-iban": "🏦", "dias-entre-fechas": "📆", "calculadora-edad": "🎂",
  "sumar-dias-fecha": "➕", "sumar-horas": "⏱️", "calculadora-porcentajes": "％", "calculadora-iva": "🧾", "regla-de-tres": "📐",
  "calculadora-nota-media": "🎓", "calculadora-hipoteca": "🏠", "interes-compuesto": "📈", "contador-palabras": "📝",
  "convertir-mayusculas-minusculas": "🔠", "numeros-romanos": "🏛️", "generador-contrasenas": "🔐", "calculadora-imc": "⚖️",
  "fecha-probable-de-parto": "🤰", "mcd-mcm": "➗", "calculadora-descuentos": "🏷️", "coste-viaje-gasolina": "⛽",
  "conversor-unidades": "📏", "semana-del-ano": "🗓️", "numero-aleatorio": "🎲", "cuenta-atras": "⏳",
};

/** Les que surten destacades a la portada. */
export const POPULAR = ["calculadora-iva", "calculadora-porcentajes", "numeros-a-letras", "letra-dni", "calculadora-hipoteca", "dias-entre-fechas", "calculadora-imc", "semana-del-ano"];

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
];

export const toolBySlug = (slug: string) => TOOLS.find((t) => t.slug === slug);
