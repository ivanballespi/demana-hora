// Metadades i text SEO de cada eina. El component interactiu és a ./components.

export type Category = "texto" | "documentos" | "fechas" | "calculos" | "finanzas" | "utilidades";

export const CATEGORIES: Record<Category, string> = {
  calculos: "Cálculos rápidos",
  finanzas: "Finanzas",
  fechas: "Fechas y tiempo",
  documentos: "Documentos",
  texto: "Texto",
  utilidades: "Utilidades",
};

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
];

export const toolBySlug = (slug: string) => TOOLS.find((t) => t.slug === slug);
