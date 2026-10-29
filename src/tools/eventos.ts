// Text SEO de les pàgines «¿Cuánto falta para...?». Les dates es calculen a logic.ts (EVENTOS).

export const EVENTO_INFO: Record<string, { titulo: string; icon: string; texto: string[] }> = {
  navidad: {
    titulo: "¿Cuánto falta para Navidad?",
    icon: "🎄",
    texto: [
      "La Navidad se celebra el 25 de diciembre, aunque en muchas casas la gran cena es la Nochebuena, el 24 por la noche.",
      "Si estás organizando los regalos, recuerda que en España muchas familias los dan también el 6 de enero, el Día de Reyes.",
    ],
  },
  nochevieja: {
    titulo: "¿Cuánto falta para Nochevieja y Año Nuevo?",
    icon: "🥂",
    texto: [
      "Nochevieja es el 31 de diciembre. A medianoche, la tradición en España es comer las doce uvas al ritmo de las campanadas.",
      "La cuenta atrás de esta página llega hasta las 00:00 del 31 de diciembre; para las campanadas, suma un día.",
    ],
  },
  "reyes-magos": {
    titulo: "¿Cuánto falta para el Día de Reyes?",
    icon: "👑",
    texto: [
      "El Día de Reyes se celebra el 6 de enero. La noche del 5 hay cabalgatas en casi todas las ciudades y los Reyes Magos dejan los regalos.",
      "Es festivo nacional en toda España.",
    ],
  },
  "semana-santa": {
    titulo: "¿Cuánto falta para Semana Santa?",
    icon: "✝️",
    texto: [
      "La Semana Santa cambia de fecha cada año: empieza el Domingo de Ramos y termina el Domingo de Pascua, que es el primer domingo después de la primera luna llena de primavera.",
      "La cuenta atrás va hasta el Domingo de Ramos. El Jueves Santo y el Viernes Santo son festivos en la mayoría de comunidades, y el Lunes de Pascua en algunas, como Cataluña o la Comunidad Valenciana.",
    ],
  },
  "san-valentin": {
    titulo: "¿Cuánto falta para San Valentín?",
    icon: "❤️",
    texto: ["San Valentín, el día de los enamorados, se celebra el 14 de febrero.", "Si quieres reservar en un restaurante, mejor hacerlo con un par de semanas de antelación."],
  },
  "dia-del-padre": {
    titulo: "¿Cuánto falta para el Día del Padre?",
    icon: "👨",
    texto: ["En España, el Día del Padre se celebra el 19 de marzo, día de San José.", "En otros países, como México o Estados Unidos, es el tercer domingo de junio."],
  },
  "dia-de-la-madre": {
    titulo: "¿Cuánto falta para el Día de la Madre?",
    icon: "💐",
    texto: ["En España, el Día de la Madre se celebra el primer domingo de mayo, así que cambia de fecha cada año.", "En otros países, como México, se celebra siempre el 10 de mayo."],
  },
  verano: {
    titulo: "¿Cuánto falta para el verano?",
    icon: "☀️",
    texto: [
      "El verano astronómico empieza con el solsticio de junio, el día más largo del año, que cae el 20 o el 21 de junio.",
      "La cuenta atrás toma como referencia el 21 de junio.",
    ],
  },
  halloween: {
    titulo: "¿Cuánto falta para Halloween?",
    icon: "🎃",
    texto: ["Halloween se celebra la noche del 31 de octubre, víspera del Día de Todos los Santos (1 de noviembre), que es festivo en España."],
  },
  "black-friday": {
    titulo: "¿Cuánto falta para el Black Friday?",
    icon: "🛍️",
    texto: [
      "El Black Friday es el viernes siguiente al Día de Acción de Gracias de Estados Unidos, que es el cuarto jueves de noviembre. Por eso cambia de fecha cada año.",
      "Muchas tiendas empiezan las ofertas días antes. Para saber si un descuento es real, usa nuestra calculadora de descuentos.",
    ],
  },
};

/** «¿Cuánto falta para el Día de Reyes?» → «Día de Reyes» (per als botons). */
export const shortName = (titulo: string) => {
  const t = titulo.replace(/^¿Cuánto falta para /, "").replace(/\?$/, "").replace(/^(el|la) /, "");
  return t[0].toUpperCase() + t.slice(1);
};
