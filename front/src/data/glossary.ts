import type {Level} from '../domain/types';

export type GlossaryEntry={id:string;sectionId:string;term:string;translation:string;level:Level;partOfSpeech:string;usage:string;example:string;exampleTranslation:string};
type EntryRow=[term:string,translation:string,level:Level,partOfSpeech:string,usage:string,example:string,exampleTranslation:string];
type Section={id:string;title:string;description:string;practice:string;entries:EntryRow[]};

// Original Lingora content. Levels indicate a suggested point of practice, not certification.
const sections:Section[]=[
 {id:'people',title:'Presentaciones y personas',description:'Habla de ti, de tu entorno y de las personas que conoces.',practice:'Preséntate en tres frases y menciona a una persona importante para ti.',entries:[
  ['name','nombre','A1','sustantivo','Usa My name is para decir tu nombre. Para preguntar, puedes usar What is your name?','My name is Rosa.','Me llamo Rosa.'],
  ['live','vivir','A1','verbo','Usa live in con una ciudad o país. No confundas vivir en un lugar con visitarlo.','I live in a small town.','Vivo en un pueblo pequeño.'],
  ['friend','amigo o amiga','A1','sustantivo','Friend no distingue género. Puedes decir my friend para presentar a alguien.','This is my friend Leo.','Este es mi amigo Leo.'],
  ['work','trabajar','A1','verbo','Usa work in para un área y work at para un lugar de trabajo. Aquí se usa como verbo.','I work at a bookshop.','Trabajo en una librería.'],
  ['hello','hola','A1','saludo','Saludo sencillo para comenzar una conversación. Hi es una alternativa más informal.','Hello, I am your new neighbour.','Hola, soy tu nuevo vecino.'],
  ['family','familia','A1','sustantivo','My family indica tu familia; a family se refiere a una familia cualquiera.','My family lives near the park.','Mi familia vive cerca del parque.'],
  ['neighbour','vecino o vecina','A2','sustantivo','Persona que vive cerca. En inglés estadounidense suele escribirse neighbor.','Our neighbour has a friendly dog.','Nuestro vecino tiene un perro amigable.'],
  ['address','dirección de domicilio','A1','sustantivo','En este contexto indica dónde vives. Para una dirección de correo añade email.','Please write your address here.','Escribe tu dirección aquí, por favor.'],
 ]},
 {id:'routines',title:'Rutinas y tiempo',description:'Describe hábitos y organiza lo que haces durante el día.',practice:'Cuenta tu rutina usando una parte del día y una palabra de frecuencia.',entries:[
  ['morning','mañana, parte del día','A1','sustantivo','Usa in the morning para hablar de esa parte del día. Tomorrow significa el día de mañana.','I read in the morning.','Leo por la mañana.'],
  ['evening','tarde o primeras horas de la noche','A1','sustantivo','Se refiere al final del día antes de ir a dormir. Su traducción depende del horario y del contexto.','We cook together in the evening.','Cocinamos juntos al final de la tarde.'],
  ['usually','normalmente','A2','adverbio','Expresa un hábito frecuente. Suele ir antes del verbo principal, pero después de be.','I usually walk to class.','Normalmente voy caminando a clase.'],
  ['always','siempre','A1','adverbio','Indica que algo ocurre en todas las ocasiones de las que hablas.','She always brings a notebook.','Ella siempre lleva una libreta.'],
  ['sometimes','a veces','A1','adverbio','Indica que algo ocurre algunas veces. Puede aparecer al inicio de la oración.','Sometimes we study outside.','A veces estudiamos afuera.'],
  ['before','antes de','A1','preposición','Úsalo para situar una actividad antes de otra o de una hora.','I have breakfast before class.','Desayuno antes de clase.'],
  ['after','después de','A1','preposición','Úsalo para indicar que una actividad ocurre más tarde que otra.','We play football after school.','Jugamos fútbol después de la escuela.'],
  ['appointment','cita programada','A2','sustantivo','Encuentro acordado, por ejemplo con un profesional. No equivale siempre a una cita romántica.','I have an appointment at ten.','Tengo una cita a las diez.'],
 ]},
 {id:'travel',title:'Viajes y transporte',description:'Reserva, pregunta por horarios y entiende avisos durante un viaje.',practice:'Pide un boleto y pregunta por la hora de salida usando dos términos de esta sección.',entries:[
  ['ticket','boleto','A2','sustantivo','Documento que permite viajar o entrar a un lugar. Usa a ticket to con el destino.','I need a ticket to Bristol.','Necesito un boleto a Bristol.'],
  ['luggage','equipaje','A2','sustantivo no contable','No añadas una s para hablar de varias maletas. Puedes decir two bags o two pieces of luggage.','My luggage is in the car.','Mi equipaje está en el coche.'],
  ['arrive','llegar','A2','verbo','Usa arrive in con ciudades y países; arrive at con lugares como una estación.','We arrive at the station at noon.','Llegamos a la estación al mediodía.'],
  ['book','reservar','A2','verbo','Aquí significa reservar un servicio; como sustantivo, book también significa libro.','Can I book a room for Friday?','¿Puedo reservar una habitación para el viernes?'],
  ['journey','trayecto o viaje','A2','sustantivo','Destaca el desplazamiento de un lugar a otro, no toda la estancia de vacaciones.','The journey takes two hours.','El trayecto dura dos horas.'],
  ['platform','andén','A2','sustantivo','En una estación de tren, es la zona donde esperas y subes al tren.','Our train leaves from platform three.','Nuestro tren sale del andén tres.'],
  ['departure','salida','B1','sustantivo','Indica el momento de salir. Departure time es la hora de salida de un transporte.','The departure time is on the screen.','La hora de salida está en la pantalla.'],
  ['delay','retraso','B1','sustantivo','En este uso nombra una espera respecto al horario previsto. Delayed describe algo retrasado.','There is a short delay today.','Hoy hay un pequeño retraso.'],
 ]},
 {id:'food',title:'Comida y restaurantes',description:'Entiende un menú y practica peticiones sencillas al comer fuera.',practice:'Imagina que estás en un restaurante: pide una bebida y después la cuenta.',entries:[
  ['menu','menú o carta','A1','sustantivo','Lista de lo que puedes pedir en un restaurante. Puedes solicitarla con Can I see the menu?','The menu includes vegetable soup.','El menú incluye sopa de verduras.'],
  ['order','pedir comida o bebida','A2','verbo','En un restaurante se usa para elegir lo que quieres consumir; no significa ordenar objetos.','I would like to order a sandwich.','Me gustaría pedir un sándwich.'],
  ['bill','cuenta','A2','sustantivo','En un restaurante británico se pide the bill; en Estados Unidos es común decir the check.','Could we have the bill, please?','¿Nos trae la cuenta, por favor?'],
  ['water','agua','A1','sustantivo no contable','Para contar porciones usa a glass of water o two bottles of water.','Can I have a glass of water?','¿Me da un vaso de agua?'],
  ['meal','comida, como ocasión de comer','A2','sustantivo','Se refiere a una comida como el desayuno o la cena, no a cualquier alimento aislado.','We share one meal every day.','Compartimos una comida cada día.'],
  ['hungry','con hambre','A1','adjetivo','En inglés se usa be hungry, no have hungry.','I am hungry after my walk.','Tengo hambre después de mi caminata.'],
  ['ingredient','ingrediente','B1','sustantivo','Cada alimento que forma parte de una preparación. Ingredients es la forma plural.','Rice is the main ingredient.','El arroz es el ingrediente principal.'],
  ['portion','porción o ración','B1','sustantivo','Cantidad servida para una persona o en un plato.','A small portion is enough for me.','Una porción pequeña es suficiente para mí.'],
 ]},
 {id:'work',title:'Trabajo y proyectos',description:'Describe experiencia, tareas, resultados y colaboración.',practice:'Describe una tarea reciente e incluye una fecha límite o un comentario que recibiste.',entries:[
  ['experience','experiencia','B1','sustantivo','Como conocimiento acumulado suele ser no contable; an experience es una vivencia concreta.','I have experience in customer service.','Tengo experiencia en atención al cliente.'],
  ['improve','mejorar','B1','verbo','Puede referirse a mejorar una habilidad o a que algo mejore por sí mismo.','We want to improve our service.','Queremos mejorar nuestro servicio.'],
  ['deadline','fecha límite','B1','sustantivo','Momento máximo para terminar una tarea. Meet a deadline significa cumplir el plazo.','The deadline for the report is Monday.','La fecha límite para el informe es el lunes.'],
  ['meeting','reunión','A2','sustantivo','Encuentro organizado para hablar de un asunto. Usa have a meeting para indicar que tienes uno.','Our meeting starts at eleven.','Nuestra reunión comienza a las once.'],
  ['feedback','comentarios para mejorar','B1','sustantivo no contable','Se usa para observaciones sobre un trabajo o actuación. Evita a feedback; usa some feedback.','Your feedback helped me revise the plan.','Tus comentarios me ayudaron a revisar el plan.'],
  ['task','tarea','A2','sustantivo','Trabajo concreto que debe hacerse. Puede formar parte de un proyecto mayor.','My first task is to check the dates.','Mi primera tarea es revisar las fechas.'],
  ['apply for','solicitar, presentar candidatura','B1','verbo con preposición','Usa apply for antes del puesto o la oportunidad que solicitas. No significa aplicar un objeto.','I will apply for the assistant position.','Voy a postularme al puesto de asistente.'],
  ['achieve','lograr','B1','verbo','Úsalo con un resultado u objetivo alcanzado mediante esfuerzo.','The team achieved its main goal.','El equipo logró su objetivo principal.'],
 ]},
 {id:'learning',title:'Estudio y aprendizaje',description:'Pregunta por significados, revisa errores y habla de tu práctica.',practice:'Escribe una pregunta en inglés para pedir una explicación y un ejemplo.',entries:[
  ['learn','aprender','A1','verbo','Expresa adquirir conocimientos o habilidades. Learn to va antes de un verbo.','I want to learn to write clearly.','Quiero aprender a escribir con claridad.'],
  ['understand','entender','A1','verbo','Expresa comprender un mensaje o una idea. Para pedir ayuda puedes decir I do not understand.','I understand the first question.','Entiendo la primera pregunta.'],
  ['explain','explicar','A2','verbo','Di explain something to someone; no añadas una persona inmediatamente después de explain sin to.','Can you explain this rule to me?','¿Puedes explicarme esta regla?'],
  ['mistake','error','A2','sustantivo','La combinación habitual es make a mistake, no do a mistake.','I made a mistake in the last sentence.','Cometí un error en la última oración.'],
  ['meaning','significado','A2','sustantivo','Lo que expresa una palabra o frase en un contexto.','The meaning changes in this sentence.','El significado cambia en esta oración.'],
  ['practice','práctica','A2','sustantivo','Aquí es un sustantivo. Como verbo se escribe practice en inglés estadounidense y practise en británico.','A little practice helps every day.','Un poco de práctica ayuda cada día.'],
  ['pronounce','pronunciar','B1','verbo','Se usa para hablar de cómo se dicen los sonidos de una palabra. El sustantivo es pronunciation.','How do you pronounce this word?','¿Cómo se pronuncia esta palabra?'],
  ['look up','buscar información','A2','verbo frasal','Se usa al consultar una palabra o un dato. Con pronombre: look it up, no look up it.','I look up new words after class.','Busco palabras nuevas después de clase.'],
 ]},
 {id:'ideas',title:'Conectores y argumentos',description:'Relaciona ideas, explica tiempos y compara ventajas con límites.',practice:'Compara dos maneras de estudiar usando un conector y una ventaja o dificultad.',entries:[
  ['since','desde','B1','preposición','En este uso introduce el inicio de una situación que continúa. También puede tener otros usos, como expresar una causa.','I have studied here since January.','Estudio aquí desde enero.'],
  ['for','durante, para expresar duración','B1','preposición','Aquí introduce cuánto dura una situación, no su punto de inicio. Compáralo con since.','I have worked here for six months.','Trabajo aquí desde hace seis meses.'],
  ['whereas','mientras que / en cambio','B2','conjunción','Contrasta dos situaciones; en este uso no indica que sucedan al mismo tiempo.','I prefer studying alone, whereas Marta enjoys group work.','Prefiero estudiar a solas, mientras que Marta disfruta el trabajo en grupo.'],
  ['although','aunque','B1','conjunción','Introduce una dificultad que no impide el resultado. No necesitas añadir but a la otra parte de la misma estructura.','Although the text was long, I finished it.','Aunque el texto era largo, lo terminé.'],
  ['however','sin embargo','B1','conector','Presenta un contraste entre ideas. Puede empezar una oración seguida de coma.','The course is useful. However, it requires regular practice.','El curso es útil. Sin embargo, requiere práctica constante.'],
  ['evidence','evidencia o pruebas','B2','sustantivo no contable','Información que apoya una afirmación. Evita an evidence; puedes decir a piece of evidence.','We need more evidence before choosing a method.','Necesitamos más pruebas antes de elegir un método.'],
  ['drawback','inconveniente','B2','sustantivo','Aspecto negativo de una opción que también puede tener ventajas.','One drawback of this plan is its cost.','Un inconveniente de este plan es su costo.'],
  ['trade-off','compensación entre ventajas y desventajas','B2','sustantivo','Situación en la que ganar algo implica ceder en otro aspecto. Es común trade-off between dos factores.','There is a trade-off between speed and detail.','Hay que equilibrar la rapidez y el nivel de detalle, cediendo en uno para ganar en el otro.'],
 ]},
 {id:'expressions',title:'Expresiones y verbos frasales',description:'Aprende combinaciones completas cuyo sentido va más allá de cada palabra.',practice:'Escribe una experiencia breve con find out y algo que esperas con look forward to.',entries:[
  ['look forward to','esperar con ilusión','B1','expresión verbal','Después de to usa un sustantivo o un verbo terminado en -ing. Aquí to es una preposición.','I look forward to meeting your team.','Me hace ilusión conocer a tu equipo.'],
  ['get along with','llevarse bien con','B1','expresión verbal','Describe una buena relación con alguien. Es común añadir well para destacarlo.','I get along well with my classmates.','Me llevo bien con mis compañeros de clase.'],
  ['find out','averiguar o enterarse','B1','verbo frasal','Indica descubrir información. No es lo mismo que encontrar un objeto perdido.','We found out that the library opens early.','Nos enteramos de que la biblioteca abre temprano.'],
  ['take part in','participar en','B1','expresión verbal','Introduce una actividad en la que participas. Conserva in antes de nombrarla.','I took part in a reading group.','Participé en un grupo de lectura.'],
  ['give up','abandonar o dejar de hacer','B1','verbo frasal','Con una actividad suele ir seguido de -ing. También se usa solo para decir rendirse.','I will not give up learning English.','No abandonaré el aprendizaje del inglés.'],
  ['deal with','ocuparse de o afrontar','B2','verbo con preposición','En este uso significa atender una situación o dificultad. El sentido exacto depende del objeto.','We need to deal with this problem together.','Necesitamos afrontar este problema juntos.'],
  ['carry on','continuar','B1','verbo frasal','Puedes usar carry on con un verbo en -ing para continuar una actividad.','Please carry on reading while I find the page.','Por favor, sigue leyendo mientras encuentro la página.'],
  ['point out','señalar o hacer notar','B2','verbo frasal','Destaca un dato para que alguien lo tenga en cuenta. Con pronombre: point it out.','The teacher pointed out a useful difference.','La profesora señaló una diferencia útil.'],
 ]},
];

export const glossarySections=sections.map(({entries:_,...section})=>section);
export const glossaryEntries:GlossaryEntry[]=sections.flatMap(section=>section.entries.map(([term,translation,level,partOfSpeech,usage,example,exampleTranslation])=>({
 id:`${section.id}-${term.replace(/\s+/g,'-')}`,sectionId:section.id,term,translation,level,partOfSpeech,usage,example,exampleTranslation
})));
