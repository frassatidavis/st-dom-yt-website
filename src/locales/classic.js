// Classic Mode wording: the site as it might have read around the church's
// dedication in 1954. These lines replace the everyday ones while Classic
// Mode is on — nothing online, no email, podcasts or social media; people
// telephone or call at the rectory, and the offertory goes in the envelope.
export const CLASSIC_TEXT = {
  en: {
    nav: { give: "Your Tithe", about: "Our History", architecture: "Dedication of St. Dominic Church" },
    footer: { cards: { emailTitle: "Write to Us" } },
    home: {
      involved: {
        desc: "Call at the rectory to register and receive your tithing envelopes. A parish registry is kept so that the pastor and his associates can know his flock. Don't stay an anonymous parishioner!",
        ctaRegister: "Register",
      },
      formation: { title: "Sunday is Just the Start" },
    },
    getInvolved: {
      clickHint: "Select to learn more",
      register: { cta: "Register" },
    },
    bulletin: {
      reviewed: "Printed each week and handed out at the church doors after every Mass.",
      fallback: {
        desc: "Our weekly bulletin is printed each week and handed out at the church doors after every Mass. Ask at the rectory for past issues.",
        cta: "See the Bulletins",
      },
      current: {
        view: "See the Bulletin",
        desc: "The full bulletin — Mass intentions, announcements, and the pastor's message — handed out at the doors each Sunday.",
        more: "All the bulletins",
      },
      info: {
        deadlineDesc: "All bulletin announcements must be brought or telephoned to the rectory by Monday at noon each week for inclusion in the following weekend's bulletin.",
        contactDesc: "To submit an announcement or event for the bulletin, telephone the rectory or leave a note at the office.",
      },
      archive: { noLink: "Kept at the rectory" },
    },
    faithFormation: {
      resources: {
        desc: "Reading from the Dominican intellectual tradition and the wider Catholic Church — theology, catechesis, and spiritual reading.",
        thomistic: { desc: "The Thomistic Institute promotes Catholic truth through lectures and study rooted in the thought of St. Thomas Aquinas." },
      },
      cta: { desc: "Pick up a good book, pray the Rosary, or open the Catechism. Every step you take toward understanding your faith is a step closer to Christ." },
      quote: "\"Be reformed in the newness of your mind, that you may prove what is the good, and the acceptable, and the perfect will of God.\"",
      quoteSrc: "— Romans 12:2",
    },
    give: {
      title: "Your Tithe",
      next: { mass: { title: "Your Sunday Tithe" } },
      methods: { offertory: { title: "Your Sunday Tithe" } },
      clarityDesc: "Most parishioners use their weekly tithing envelopes, but one-time gifts, memorial gifts, and mailed checks are always welcome.",
      quote: "\"Every one as he hath determined in his heart, not with sadness, or of necessity: for God loveth a cheerful giver.\"",
      quoteSrc: "— 2 Corinthians 9:7",
    },
    visit: {
      hero: { desc: "Don't let your Catholic upbringing lapse. Pope St. Pius X gave the Church his motto: \"To renew all things in Christ.\" Whether you are a lifelong parishioner or a fallen-away Catholic, an alum of the school or curious about the Catholic faith — you are welcome here." },
      directions: { cta: "Get Directions" },
      quote: "\"And hospitality do not forget; for by this some, being not aware of it, have entertained angels.\"",
      quoteSrc: "— Hebrews 13:2",
      map: {
        note: "Pile in the buggy or get on your feet!",
        directions: "Get directions from where you are →",
      },
    },
    friars: { priests: { desc: "Our parish is cared for by Dominican friars of the Province of St. Joseph. To reach a priest, telephone or call at the rectory." } },
    about: { title: "Our History" },
    // Catechism quotes from the Baltimore Catechism (1891 text, intratext.com),
    // not the 1992 Catechism; pope quotes from before 1930 (vatican.va)
    massTimes: {
      mass: {
        quote: "\"The Mass is the unbloody sacrifice of the body and blood of Christ.\"",
        quoteSrc: "— Baltimore Catechism",
      },
      confession: {
        quote: "\"The Sacrament of Penance remits sins and restores the friendship of God to the soul by means of the absolution of the priest.\"",
        quoteSrc: "— Baltimore Catechism",
      },
      adoration: {
        quote: "\"The Holy Eucharist is the Sacrament which contains the body and blood, soul and divinity, of our Lord Jesus Christ under the appearances of bread and wine.\"",
        quoteSrc: "— Baltimore Catechism",
      },
      parallax2: {
        quote: "\"May God, 'who is rich in mercy,' benignly speed this restoration of the human race in Jesus Christ.\"",
        src: "— Pope St. Pius X, E Supremi (1903)",
      },
    },
    staff: {
      clickHint: "Select to learn more",
      quotes: {
        "charles-rooney": {
          text: "This Sacrament is, as it were, the very soul of the Church.",
          source: "Pope Leo XIII, Mirae Caritatis (1902)",
        },
      },
    },
    // Bible quotes in the Challoner Douay-Rheims (drbo.org)
    becomingCatholic: {
      quote: "\"Faith then cometh by hearing; and hearing by the word of Christ.\"",
      quoteSrc: "— Romans 10:17",
    },
    sacraments: {
      quote: "\"A Sacrament is an outward sign instituted by Christ to give grace.\"",
      quoteSrc: "— Baltimore Catechism",
      baptism: {
        quote: "\"Going therefore, teach ye all nations; baptizing them in the name of the Father, and of the Son, and of the Holy Ghost.\"",
        quoteSrc: "— Matthew 28:19",
      },
      firstCommunion: {
        quote: "\"I am the living bread which came down from heaven. If any man eat of this bread, he shall live for ever.\"",
        quoteSrc: "— John 6:51–52",
      },
      confirmation: {
        quote: "\"You shall receive the power of the Holy Ghost coming upon you, and you shall be witnesses unto me.\"",
        quoteSrc: "— Acts 1:8",
      },
      marriage: {
        quote: "\"Wherefore a man shall leave father and mother, and shall cleave to his wife: and they shall be two in one flesh.\"",
        quoteSrc: "— Genesis 2:24",
        ccc: "\"The Sacrament of Matrimony is the Sacrament which unites a Christian man and woman in lawful marriage.\"",
        cccSrc: "— Baltimore Catechism",
      },
      anointing: {
        quote: "\"Is any man sick among you? Let him bring in the priests of the church, and let them pray over him, anointing him with oil in the name of the Lord.\"",
        quoteSrc: "— James 5:14",
      },
      funerals: {
        quote: "\"I am the resurrection and the life: he that believeth in me, although he be dead, shall live.\"",
        quoteSrc: "— John 11:25",
      },
    },
    arch: {
      title: "The Dedication of St.\u00a0Dominic Church",
      roseQuote: "I am the light of the world: he that followeth me, walketh not in darkness, but shall have the light of life.",
      roseQuoteSrc: "John 8:12",
    },
  },
  es: {
    nav: { give: "Su Diezmo", about: "Nuestra Historia", architecture: "Dedicación de la Iglesia de Santo Domingo" },
    footer: { cards: { emailTitle: "Escríbanos" } },
    home: {
      involved: {
        desc: "Pase por la rectoría para registrarse y recibir sus sobres para la ofrenda. El registro parroquial permite que el párroco y sus colaboradores conozcan a su rebaño. ¡No sea un feligrés anónimo!",
        ctaRegister: "Regístrese",
      },
      formation: { title: "El Domingo es Solo el Comienzo" },
    },
    getInvolved: {
      clickHint: "Seleccione para conocer más",
      register: { cta: "Regístrese" },
    },
    bulletin: {
      reviewed: "Impreso cada semana y repartido en las puertas de la iglesia después de cada Misa.",
      fallback: {
        desc: "Nuestro boletín semanal se imprime cada semana y se reparte en las puertas de la iglesia después de cada Misa. Pida los números anteriores en la rectoría.",
        cta: "Ver los Boletines",
      },
      current: {
        view: "Ver el Boletín",
        desc: "El boletín completo — intenciones de Misa, anuncios y el mensaje del párroco — se reparte en las puertas cada domingo.",
        more: "Todos los boletines",
      },
      info: {
        deadlineDesc: "Todos los anuncios del boletín deben llevarse o comunicarse por teléfono a la rectoría antes del lunes al mediodía cada semana para su inclusión en el boletín del siguiente fin de semana.",
        contactDesc: "Para enviar un anuncio o evento para el boletín, llame a la rectoría o deje una nota en la oficina.",
      },
      archive: { noLink: "Se guarda en la rectoría" },
    },
    faithFormation: {
      resources: {
        desc: "Lecturas de la tradición intelectual dominicana y la Iglesia Católica en general — teología, catequesis y lectura espiritual.",
        thomistic: { desc: "El Thomistic Institute promueve la verdad católica a través de conferencias y estudios enraizados en el pensamiento de Santo Tomás de Aquino." },
      },
      cta: { desc: "Tome un buen libro, rece el Rosario o abra el Catecismo. Cada paso que da hacia la comprensión de su fe es un paso más cerca de Cristo." },
    },
    give: {
      title: "Su Diezmo",
      next: { mass: { title: "Su Diezmo Dominical" } },
      methods: { offertory: { title: "Su Diezmo Dominical" } },
      clarityDesc: "La mayoría de los feligreses usan sus sobres semanales para la ofrenda, pero las donaciones únicas, memoriales y cheques por correo siempre son bienvenidos.",
    },
    visit: {
      hero: { desc: "No deje que su fe católica se apague. San Pío X dio a la Iglesia su lema: \"Instaurar todas las cosas en Cristo\". Sea usted feligrés de toda la vida o un católico alejado, exalumno de la escuela o alguien con curiosidad por la fe católica — es bienvenido aquí." },
      directions: { cta: "Cómo Llegar" },
      map: {
        note: "¡Súbase a la carreta o vaya a pie!",
        directions: "Cómo llegar desde donde está →",
      },
    },
    about: { title: "Nuestra Historia" },
    arch: { title: "La Dedicación de la Iglesia de Santo Domingo" },
    massTimes: {
      mass: {
        quote: "\"La Misa es el sacrificio incruento del cuerpo y la sangre de Cristo.\"",
        quoteSrc: "— Catecismo de Baltimore",
      },
      confession: {
        quote: "\"El Sacramento de la Penitencia perdona los pecados y devuelve al alma la amistad de Dios por medio de la absolución del sacerdote.\"",
        quoteSrc: "— Catecismo de Baltimore",
      },
      adoration: {
        quote: "\"La Sagrada Eucaristía es el Sacramento que contiene el cuerpo y la sangre, el alma y la divinidad de nuestro Señor Jesucristo bajo las apariencias de pan y vino.\"",
        quoteSrc: "— Catecismo de Baltimore",
      },
      parallax2: {
        quote: "\"Que Dios, 'rico en misericordia', apresure benignamente esta restauración del género humano en Jesucristo.\"",
        src: "— San Pío X, E Supremi (1903)",
      },
    },
    staff: {
      clickHint: "Seleccione para conocer más",
      quotes: {
        "charles-rooney": {
          text: "Este Sacramento es, por así decirlo, el alma misma de la Iglesia.",
          source: "León XIII, Mirae Caritatis (1902)",
        },
      },
    },
    sacraments: {
      quote: "\"Un Sacramento es un signo exterior instituido por Cristo para dar la gracia.\"",
      quoteSrc: "— Catecismo de Baltimore",
      marriage: {
        ccc: "\"El Sacramento del Matrimonio es el Sacramento que une a un hombre y una mujer cristianos en matrimonio legítimo.\"",
        cccSrc: "— Catecismo de Baltimore",
      },
    },
    friars: { priests: { desc: "Nuestra parroquia está al cuidado de los frailes dominicos de la Provincia de San José. Para comunicarse con un sacerdote, llame por teléfono o pase por la rectoría." } },
  },
};

// Words that change everywhere in Classic Mode, applied to every line of the
// site's text after the replacements above: the old name of the sacrament,
// and the church's full name in place of its nickname
export const CLASSIC_WORDS = {
  en: [
    [/Anointing of the Sick/g, "Extreme Unction"],
    [/\bAnointing\b/g, "Extreme Unction"],
    [/\bThe Extreme Unction\b/g, "Extreme Unction"],
    [/St\. ?Dom['’]s/g, "St. Dominic Church"],
  ],
  es: [
    [/[Ll]a Unción de los Enfermos/g, "la Extremaunción"],
    [/Unción de los Enfermos/g, "Extremaunción"],
    [/[Ll]a Unción\b/g, "la Extremaunción"],
    [/St\. ?Dom['’]s/g, "St. Dominic Church"],
  ],
};

/** Applies CLASSIC_WORDS[lng] to every string in a language bundle */
export function classicWords(bundle, lng) {
  const rules = CLASSIC_WORDS[lng] || [];
  const fix = (v) => {
    if (typeof v === "string") return rules.reduce((s, [re, to]) => s.replace(re, to), v);
    if (Array.isArray(v)) return v.map(fix);
    if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fix(x)]));
    return v;
  };
  return fix(bundle);
}
