import { useState, useCallback, useEffect } from 'react';
import type { AppData, Goal, GalleryPhoto, JournalEntry, PersonalObjective, ObjectiveCheckin } from '@/types';

const STORAGE_KEY = 'jc_island_data';

const START_DATE = new Date('2026-04-20T00:00:00');

const defaultData: AppData = {
  milestones: [
    {
      id: '1',
      date: '20 ago 2025',
      title: 'Nuestro primer encuentro',
      description: 'No fue una cita, no fue una juntada, no fue buscandonos, solo apareci buscando trabajo, los dos teniamos nuestra vida estructurada y haciamos nuestra vida por separados.',    },
    {
      id: '2',
      date: '20 abril 2026',
      title: 'Nos confezamos',
      description: 'Nos veiamos tirando honda y finjiendo demencia a la vez, con gans de ser todo pero siendo nada, amandonos pero en silencio, recuerdo como contemplaba la infinidad de tu mirar escondido para que no lo notaras pero ese dia lo expresamos no hicimos nada al respecto pero lo expresamos y fue mutuo.',
    },
    {
      id: '3',
      date: '23 abril 2026',
      title: 'el primer beso',
      description: 'Lo que sentiamos ya lo sabiamos y nos sentiamos comodo con eso, la tension cuando nos juntabamos era asfixiante era la intencion de serlo todo vs el miedo a cagar la amistad mas linda que teniamos en ese entonces, fuimos a un picnic y hablamos, hablamos mucho y yo solo me imaginaba el como darte un beso y que sea increible, tenia miedo, estaba nervioso pero lo hice, antes de juntar las cosas te ayude a levantarte y nos besamos, lo unico que recuerdo en ese entonces son estrellas y un sentimiento muy profundo de paz .',
    },
    {
      id: '4',
      date: '26 abril 2026',
      title: 'Te am....',
      description: 'ese dia estabamos en la cama, estabamos acostados y recuerdo que pensaba, como puedo amar tanto a esta personita? aparte de eso el camino hasta tu casa fui meditando "no le digas amor, no le digas te amo, no todavia, pero cuando estabamos juntos me olvide de todo, solo se que sentia mucho amor por vos y se me salio no pude aguantar lo tuve que decir.',
    },
    {
      id: '5',
      date: '15 mayo 2026',
      title: 'fue magico',
      description: 'fue nuestra primera vez juntos y la verdad fue wow, amanecimos y encima tuvimos mañanero, fue una locura, intente volver a los saltitos a mi casa pero no pude.',
    },
  ],
  photos: [
    { id: '1', src: '/images/imagen_espejo.jpeg', date: '15 Ago 2022', note: 'Atardecer en la playa', aspectRatio: '3/4' as const },
    { id: '2', src: '/images/imagen_abrazo.jpeg', date: '20 Sep 2022', note: 'Café y croissants', aspectRatio: '4/3' as const },
    { id: '3', src: '/images/gallery-3.jpg', date: '5 Nov 2022', note: 'Bailando bajo la lluvia', aspectRatio: '1/1' as const },
    { id: '4', src: '/images/gallery-4.jpg', date: '14 Feb 2023', note: 'Nuestras manos, nuestro pacto', aspectRatio: '16/9' as const },
    { id: '5', src: '/images/gallery-5.jpg', date: '3 Jun 2023', note: 'Domingo de pelis', aspectRatio: '3/4' as const },
    { id: '6', src: '/images/gallery-6.jpg', date: '12 Ago 2023', note: 'Aventura en la montaña', aspectRatio: '4/3' as const },
  ],
    goals: [
    {
      id: '7',
      title: 'Hacer mantecol casero',
      description: 'Preparar nuestro propio mantecol desde cero y compartirlo mientras nos reimos de los errores de la receta.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '7-1', title: 'Buscar una receta', done: false },
        { id: '7-2', title: 'Comprar los ingredientes', done: false },
        { id: '7-3', title: 'Elegir un dia para cocinar', done: false },
        { id: '7-4', title: 'Sacar fotos del proceso', done: false },
        { id: '7-5', title: 'Calificar el resultado del 1 al 10', done: false },
      ],
      createdAt: '2026-06-13T10:00:00',
    },
    {
      id: '8',
      title: 'Hacer los cuadritos',
      description: 'Crear arte juntos y decorar nuestros espacios con algo hecho por nosotros.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '8-1', title: 'Elegir diseno', done: false },
        { id: '8-2', title: 'Pintarlos', done: false },
        { id: '8-3', title: 'Terminarlos', done: false },
        { id: '8-4', title: 'Sacar una foto del resultado', done: false },
      ],
      createdAt: '2026-06-13T10:10:00',
    },
    {
      id: '9',
      title: 'Ir al club juntos',
      description: 'Pasar un dia relajados disfrutando del agua, el sol y nuestra compania.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '9-1', title: 'Elegir fecha', done: false },
        { id: '9-2', title: 'Preparar mochila', done: false },
        { id: '9-3', title: 'Llevar mate', done: false },
        { id: '9-4', title: 'Sacarnos una foto juntos', done: false },
      ],
      createdAt: '2026-06-13T10:20:00',
    },
    {
      id: '10',
      title: 'Picnic en un arroyito',
      description: 'Escaparnos un rato del mundo y disfrutar de la naturaleza.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '10-1', title: 'Buscar el lugar', done: false },
        { id: '10-2', title: 'Preparar comida', done: false },
        { id: '10-3', title: 'Llevar manta', done: false },
        { id: '10-4', title: 'Tomar fotos', done: false },
        { id: '10-5', title: 'Ver el atardecer', done: false },
      ],
      createdAt: '2026-06-13T10:30:00',
    },
    {
      id: '11',
      title: 'Tocar el piano',
      description: 'Aprender una cancion especial para nosotros.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '11-1', title: 'Elegir cancion', done: false },
        { id: '11-2', title: 'Aprender acordes basicos', done: false },
        { id: '11-3', title: 'Practicar juntos', done: false },
        { id: '11-4', title: 'Grabar el resultado', done: false },
      ],
      createdAt: '2026-06-13T10:40:00',
    },
    {
      id: '12',
      title: 'Tomar mate al amanecer',
      description: 'Ver salir el sol mientras compartimos un mate.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '12-1', title: 'Elegir lugar', done: false },
        { id: '12-2', title: 'Preparar termo', done: false },
        { id: '12-3', title: 'Levantarse temprano', done: false },
        { id: '12-4', title: 'Sacar una foto del amanecer', done: false },
      ],
      createdAt: '2026-06-13T10:50:00',
    },
    {
      id: '13',
      title: 'Trasnochar trabajando',
      description: 'Pasar una noche construyendo proyectos, estudiando o simplemente acompanandonos.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '13-1', title: 'Elegir proyecto', done: false },
        { id: '13-2', title: 'Preparar cafe o mate', done: false },
        { id: '13-3', title: 'Hacer una playlist', done: false },
        { id: '13-4', title: 'Ver quien aguanta mas despierto', done: false },
      ],
      createdAt: '2026-06-13T11:00:00',
    },
    {
      id: '14',
      title: 'Ver una saga completa',
      description: 'Maraton de peliculas con manta, comida y cero interrupciones.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '14-1', title: 'Elegir saga', done: false },
        { id: '14-2', title: 'Preparar snacks', done: false },
        { id: '14-3', title: 'Organizar fechas', done: false },
        { id: '14-4', title: 'Puntuar cada pelicula', done: false },
      ],
      createdAt: '2026-06-13T11:10:00',
    },
    {
      id: '15',
      title: 'Acampar',
      description: 'Dormir bajo las estrellas y crear recuerdos inolvidables.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '15-1', title: 'Elegir lugar', done: false },
        { id: '15-2', title: 'Preparar equipo', done: false },
        { id: '15-3', title: 'Llevar comida', done: false },
        { id: '15-4', title: 'Ver el amanecer', done: false },
        { id: '15-5', title: 'Sacar fotos nocturnas', done: false },
      ],
      createdAt: '2026-06-13T11:20:00',
    },
    {
      id: '16',
      title: 'Sentarse a ver la lluvia',
      description: 'Disfrutar juntos de un dia lluvioso sin hacer nada mas.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '16-1', title: 'Buscar refugio', done: false },
        { id: '16-2', title: 'Compartir mate', done: false },
        { id: '16-3', title: 'Escuchar la lluvia', done: false },
        { id: '16-4', title: 'Crear un recuerdo', done: false },
      ],
      createdAt: '2026-06-13T11:30:00',
    },
    {
      id: '17',
      title: 'Viernes de tacos',
      description: 'Convertir los viernes en una tradicion deliciosa.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '17-1', title: 'Comprar ingredientes', done: false },
        { id: '17-2', title: 'Cocinar juntos', done: false },
        { id: '17-3', title: 'Probar una receta nueva', done: false },
        { id: '17-4', title: 'Elegir el mejor taco', done: false },
      ],
      createdAt: '2026-06-13T11:40:00',
    },
    {
      id: '18',
      title: 'Ver Lucifer',
      description: 'Disfrutar la serie juntos comentando cada episodio.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '18-1', title: 'Empezar la serie', done: false },
        { id: '18-2', title: 'Llevar registro de capitulos', done: false },
        { id: '18-3', title: 'Elegir personaje favorito', done: false },
        { id: '18-4', title: 'Terminar todas las temporadas', done: false },
      ],
      createdAt: '2026-06-13T11:50:00',
    },
    {
      id: '19',
      title: 'Noche de juegos',
      description: 'Competir, reirnos y pasar una noche diferente.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '19-1', title: 'Elegir juegos', done: false },
        { id: '19-2', title: 'Preparar snacks', done: false },
        { id: '19-3', title: 'Llevar marcador', done: false },
        { id: '19-4', title: 'Coronar al campeon', done: false },
      ],
      createdAt: '2026-06-13T12:00:00',
    },
    {
      id: '20',
      title: 'Saltar en paracaidas',
      description: 'Enfrentar el miedo y vivir una aventura extrema juntos.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '20-1', title: 'Investigar lugares', done: false },
        { id: '20-2', title: 'Ahorrar dinero', done: false },
        { id: '20-3', title: 'Reservar fecha', done: false },
        { id: '20-4', title: 'Grabar la experiencia', done: false },
      ],
      createdAt: '2026-06-13T12:10:00',
    },
    {
      id: '21',
      title: 'Mates de limon',
      description: 'Compartir una tarde diferente probando algo que nos identifica.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '21-1', title: 'Conseguir limones', done: false },
        { id: '21-2', title: 'Preparar mate', done: false },
        { id: '21-3', title: 'Encontrar la combinacion perfecta', done: false },
        { id: '21-4', title: 'Sacar una foto', done: false },
      ],
      createdAt: '2026-06-13T12:20:00',
    },
    {
      id: '22',
      title: 'Sacarse fotos lindas juntos',
      description: 'Guardar recuerdos de cada etapa de nuestra historia.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '22-1', title: 'Elegir lugar', done: false },
        { id: '22-2', title: 'Coordinar ropa', done: false },
        { id: '22-3', title: 'Sacar varias fotos', done: false },
        { id: '22-4', title: 'Elegir favoritas', done: false },
        { id: '22-5', title: 'Crear album', done: false },
      ],
      createdAt: '2026-06-13T12:30:00',
    },
    {
      id: '23',
      title: 'Leer libros juntos',
      description: 'Aprender y crecer compartiendo historias y conocimientos.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '23-1', title: 'Elegir libro', done: false },
        { id: '23-2', title: 'Definir ritmo de lectura', done: false },
        { id: '23-3', title: 'Comentar capitulos', done: false },
        { id: '23-4', title: 'Terminarlo juntos', done: false },
      ],
      createdAt: '2026-06-13T12:40:00',
    },
    {
      id: '24',
      title: 'Crear habitos sanos juntos',
      description: 'Ayudarnos a ser mejores cada dia.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '24-1', title: 'Definir objetivos', done: false },
        { id: '24-2', title: 'Crear seguimiento', done: false },
        { id: '24-3', title: 'Celebrar avances', done: false },
        { id: '24-4', title: 'Mantener constancia', done: false },
      ],
      createdAt: '2026-06-13T12:50:00',
    },
    {
      id: '25',
      title: 'Regular horarios de sueno',
      description: 'Dormir mejor para vivir mejor.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '25-1', title: 'Definir horario', done: false },
        { id: '25-2', title: 'Evitar pantallas antes de dormir', done: false },
        { id: '25-3', title: 'Hacer seguimiento semanal', done: false },
        { id: '25-4', title: 'Cumplir un mes completo', done: false },
      ],
      createdAt: '2026-06-13T13:00:00',
    },
    {
      id: '26',
      title: 'Tener momentos de paz y reflexion',
      description: 'Detenernos para valorar lo que tenemos y hacia donde vamos.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '26-1', title: 'Elegir un lugar tranquilo', done: false },
        { id: '26-2', title: 'Conversar sin distracciones', done: false },
        { id: '26-3', title: 'Compartir pensamientos', done: false },
        { id: '26-4', title: 'Registrar reflexiones', done: false },
      ],
      createdAt: '2026-06-13T13:10:00',
    },
    {
      id: '27',
      title: 'Mantener el devocional diario',
      description: 'Buscar a Dios juntos y fortalecer nuestra relacion a traves de la fe.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '27-1', title: 'Leer un pasaje biblico', done: false },
        { id: '27-2', title: 'Compartir reflexion', done: false },
        { id: '27-3', title: 'Orar juntos', done: false },
        { id: '27-4', title: 'Mantener una racha de 30 dias', done: false },
      ],
      createdAt: '2026-06-13T13:20:00',
    },
    {
      id: '28',
      title: 'Casarse',
      description: 'Construir una vida juntos basada en amor, compromiso, respeto y fe.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '28-1', title: 'Hablar sobre nuestros suenos', done: false },
        { id: '28-2', title: 'Construir estabilidad emocional', done: false },
        { id: '28-3', title: 'Construir estabilidad economica', done: false },
        { id: '28-4', title: 'Conocer mas profundamente nuestras diferencias', done: false },
        { id: '28-5', title: 'Planear el futuro juntos', done: false },
        { id: '28-6', title: 'Dar el paso cuando llegue el momento correcto', done: false },
      ],
      createdAt: '2026-06-13T13:30:00',
    },
  ],
  personalObjectives: [
    // === JAVI ===
    {
      id: 'j1',
      owner: 'javi' as const,
      title: 'Despertarme antes de las 7',
      description: 'Todos los días, sin excepción. Disciplina y constancia.',
      emoji: '⏰',
      priority: 1,
      tasks: [
        { id: 'j1-1', title: 'Poner alarma', done: false },
        { id: 'j1-2', title: 'Pedirle a mi mamá que me llame cuando va al trabajo', done: false },
        { id: 'j1-3', title: 'Bañarme apenas me levanto', done: false },
        { id: 'j1-4', title: 'Si no me levanto correr 10km', done: false },
      ],
      checkins: [],
      createdAt: '2026-07-17T00:00:00',
    },
    {
      id: 'j2',
      owner: 'javi' as const,
      title: 'Ingresos estables',
      description: 'Conseguir trabajo, vender una página, vender una alfombra, cualquier cosa que genere ingresos.',
      emoji: '💰',
      priority: 2,
      tasks: [
        { id: 'j2-1', title: 'Entregar mínimo 10 CV el lunes', done: false },
        { id: 'j2-2', title: 'Buscar qué hacer antes de conseguir trabajo', done: false },
        { id: 'j2-3', title: 'Ofrecer al menos 1 página por semana a alguien', done: false },
        { id: 'j2-4', title: 'Ahorrar para comprar lana y proyector', done: false },
      ],
      checkins: [],
      createdAt: '2026-07-17T00:01:00',
    },
    {
      id: 'j3',
      owner: 'javi' as const,
      title: 'Vos, Camila',
      description: 'Darte lo mejor, construir un futuro juntos.',
      emoji: '💕',
      priority: 3,
      tasks: [
        { id: 'j3-1', title: 'Demostrarte más amor de todas las formas', done: false },
        { id: 'j3-2', title: 'Hacer que te pueda dar una mejor vida', done: false },
        { id: 'j3-3', title: 'Independizarme para que en el futuro vivamos los 2', done: false },
        { id: 'j3-4', title: 'Tener carácter', done: false },
      ],
      checkins: [],
      createdAt: '2026-07-17T00:02:00',
    },
    {
      id: 'j4',
      owner: 'javi' as const,
      title: 'Ser mejor bombero',
      description: 'Mejorar como instructor, cuidar el servicio, rechazar dramas.',
      emoji: '🔥',
      priority: 4,
      tasks: [
        { id: 'j4-1', title: 'Mejorar mis clases con los cadetes', done: false },
        { id: 'j4-2', title: 'Buscar capacitación para ser mejor instructor', done: false },
        { id: 'j4-3', title: 'Cuidar mis EPP', done: false },
        { id: 'j4-4', title: 'Mínimo 1h de ejercicio en el cuartel por día (2h si no cumplo)', done: false },
        { id: 'j4-5', title: 'Estar más disponible', done: false },
        { id: 'j4-6', title: 'Buscar, ayudar y mejorar el servicio ofrecido', done: false },
        { id: 'j4-7', title: 'Brindar ideas y rechazar todos los dramas', done: false },
      ],
      checkins: [],
      createdAt: '2026-07-17T00:03:00',
    },
    {
      id: 'j5',
      owner: 'javi' as const,
      title: 'Servir mejor a Dios',
      description: 'Dejar de ir de rebote, buscar crear, formar, adorar. No solo reaccionar ante la vida.',
      emoji: '✝️',
      priority: 5,
      tasks: [
        { id: 'j5-1', title: 'Hablar con Richard o con mis pastores', done: false },
        { id: 'j5-2', title: 'Adorar más a Dios, mejorar personalidad y carácter', done: false },
        { id: 'j5-3', title: 'Hacer devocionales diarios', done: false },
        { id: 'j5-4', title: 'Buscar la mayor cercanía posible con Dios', done: false },
        { id: 'j5-5', title: 'No solo servir en el cuartel sino en la iglesia también', done: false },
      ],
      checkins: [],
      createdAt: '2026-07-17T00:04:00',
    },
    {
      id: 'j6',
      owner: 'javi' as const,
      title: 'No caer en burnout',
      description: 'Recordar que somos humanos. La idea no es ser perfecto, es ser consistente.',
      emoji: '🧘',
      priority: 6,
      tasks: [
        { id: 'j6-1', title: 'Salidas para que descansemos', done: false },
        { id: 'j6-2', title: 'En el medio de mucho caos darnos un tiempo de un mate', done: false },
        { id: 'j6-3', title: 'Palicearte a veces en el Monopoli', done: false },
        { id: 'j6-4', title: 'Llorar mucho para sacar todo lo que nos frustra', done: false },
        { id: 'j6-5', title: 'Reír aún más para ser dos almas alegres en su máximo esplendor', done: false },
      ],
      checkins: [],
      createdAt: '2026-07-17T00:05:00',
    },
    // === CAMI ===
    {
      id: 'c1',
      owner: 'cami' as const,
      title: 'Rutina y disciplina',
      description: 'Levantarme temprano, armar rutina y cumplirla 21 días para hacerla hábito.',
      emoji: '🌅',
      priority: 1,
      tasks: [
        { id: 'c1-1', title: 'Despertarme a las 8 y hacer devocional sin excepción', done: false },
        { id: 'c1-2', title: 'A las 9 ya estar prendiendo la computadora', done: false },
        { id: 'c1-3', title: 'Armar rutina y cumplirla por 21 días seguidos', done: false },
        { id: 'c1-4', title: 'Poner alarma y despertarme sin dar vueltas', done: false },
        { id: 'c1-5', title: 'Priorizar mis ocupaciones antes que salir a hacer algo por los demás', done: false },
        { id: 'c1-6', title: 'Reducir tiempo en pantalla de redes', done: false },
        { id: 'c1-7', title: 'Si no me levanto, día siguiente una hora antes', done: false },
      ],
      checkins: [],
      createdAt: '2026-07-17T00:06:00',
    },
    {
      id: 'c2',
      owner: 'cami' as const,
      title: 'Activar Criatto y generar ingresos',
      description: 'Activar redes, armar catálogo, ventas pasivas, conseguir ingreso extra en diseño gráfico.',
      emoji: '🎨',
      priority: 2,
      tasks: [
        { id: 'c2-1', title: 'Activar redes de Criatto y armar catálogo de productos', done: false },
        { id: 'c2-2', title: 'Generar ventas pasivas de archivos digitales', done: false },
        { id: 'c2-3', title: 'Conseguir ingreso extra en empresa de diseño gráfico', done: false },
        { id: 'c2-4', title: 'Actualizar CV y portafolio', done: false },
        { id: 'c2-5', title: 'Reorganizar qué servicios seguir ofreciendo en Criatto', done: false },
        { id: 'c2-6', title: 'Vender o darle uso a las máquinas que ocupan espacio', done: false },
      ],
      checkins: [],
      createdAt: '2026-07-17T00:07:00',
    },
    {
      id: 'c3',
      owner: 'cami' as const,
      title: 'Vida espiritual',
      description: 'Darle prioridad a mi vida espiritual, reforzar propósito y compromiso con Dios.',
      emoji: '🙏',
      priority: 3,
      tasks: [
        { id: 'c3-1', title: 'Priorizar momentos con Dios: orar, devocional, estudios bíblicos', done: false },
        { id: 'c3-2', title: 'No resistirme a los planes de Dios y confiar', done: false },
        { id: 'c3-3', title: 'Cumplir con mi rol dentro de la iglesia', done: false },
        { id: 'c3-4', title: 'Ir donde Dios me mande', done: false },
      ],
      checkins: [],
      createdAt: '2026-07-17T00:08:00',
    },
    {
      id: 'c4',
      owner: 'cami' as const,
      title: 'Fortalecerme para formar una familia',
      description: 'Amarme más, ser estable, ser un hogar. Cumplir el sueño de casarme y formar una familia.',
      emoji: '🏡',
      priority: 4,
      tasks: [
        { id: 'c4-1', title: 'Amarme más, reforzar carácter y autoestima', done: false },
        { id: 'c4-2', title: 'Establecer límites y tener convicciones fuertes', done: false },
        { id: 'c4-3', title: 'Formarme profesional y ser estable económicamente', done: false },
        { id: 'c4-4', title: 'Ser un hogar: dar paz y tranquilidad, no causar tanto drama', done: false },
        { id: 'c4-5', title: 'Amar a Javi todos los días y demostrarle lo que significa', done: false },
        { id: 'c4-6', title: 'Apoyarte y ser compañera en todo lo que emprendas', done: false },
        { id: 'c4-7', title: 'Esforzarnos por cumplir objetivos para formar un hogar juntos', done: false },
        { id: 'c4-8', title: 'No bajar los brazos, ser mejor persona cada día', done: false },
        { id: 'c4-9', title: 'No dejar que los malos comentarios me afecten', done: false },
      ],
      checkins: [],
      createdAt: '2026-07-17T00:09:00',
    },
    {
      id: 'c5',
      owner: 'cami' as const,
      title: 'Estudiar psicología en la UAP',
      description: 'Empezar por el SVA, trabajar y conocer países en el proceso.',
      emoji: '📚',
      priority: 5,
      tasks: [
        { id: 'c5-1', title: 'Empezar por el SVA, trabajar y conocer otros países', done: false },
        { id: 'c5-2', title: 'Comprometerme con la parte económica', done: false },
        { id: 'c5-3', title: 'Conseguir trabajo mientras estudio para sustentar gastos', done: false },
      ],
      checkins: [],
      createdAt: '2026-07-17T00:10:00',
    },
    {
      id: 'c6',
      owner: 'cami' as const,
      title: 'Disfrutar el proceso',
      description: 'No caer en la rutina ni en la exigencia. Hacer pausa para las pequeñas cositas de la vida.',
      emoji: '🌸',
      priority: 6,
      tasks: [
        { id: 'c6-1', title: 'No caer en la rutina, hacer pausa para disfrutar', done: false },
        { id: 'c6-2', title: 'Dejar de intentar caer bien a todo el mundo', done: false },
        { id: 'c6-3', title: 'Vivir mi vida como me gustaría, sin limitaciones externas', done: false },
        { id: 'c6-4', title: 'Hacer lo que me haga feliz', done: false },
      ],
      checkins: [],
      createdAt: '2026-07-17T00:11:00',
    },
  ],
  journal: [
    {
      id: '1',
      title: 'Nuestro finde en Villa de Leyva',
      date: '2023-09-18',
      location: 'Villa de Leyva, Boyacá',
      body: 'Llegamos el viernes por la tarde y la luz dorada del atardecer nos recibió como una bendición. Caminamos por las calles empedradas, tomamos chocolate caliente en la plaza y nos reímos hasta que nos dolió la panza. Esos son los momentos que guardo en el corazón.',
      photos: [],
      moodTags: ['Aventura', 'Romance', 'Chocolate'],
    },
    {
      id: '2',
      title: 'El día que Stitch aprendió a sentarse',
      date: '2024-01-20',
      location: 'Casa, Bogotá',
      body: 'Después de tres semanas de intentarlo, Stitch finalmente sentó su trasero peludo en comando! Celebramos con premios y una sesión de fotos que duró media hora. Es increíble cómo las pequeñas cosas se sienten tan grandes cuando las compartes con alguien especial.',
      photos: [],
      moodTags: ['Stitch', 'Felicidad', 'Hogar'],
    },
  ],
  letters: [
    {
      id: '1',
      date: '14 Feb 2023',
      label: 'Carta #1',
      content: 'Mi amor,\n\nHoy cumplimos un año juntos y no puedo evitar sonreír al recordar cada momento que hemos compartido. Desde aquella primera cita en la que estaba tan nervioso que derramé el café, hasta anoche cuando nos quedamos viendo estrellas desde el balcón.\n\nEres mi persona favorita en este mundo. Contigo todo es más fácil, más bonito, más real. Gracias por ser mi compañera, mi confidente, mi mejor amiga.\n\nCon todo mi amor,\nJavi',
      opened: false,
    },
    {
      id: '2',
      date: '25 Dic 2023',
      label: 'Carta #2',
      content: 'Cami,\n\nEsta Navidad me regalaste algo que no se compra con dinero: tu tiempo, tu paciencia y tu amor incondicional. Despertarme a tu lado en esta mañana de diciembre es el mejor regalo que la vida me ha dado.\n\nTe prometo que cada día voy a esforzarme por ser la persona que mereces. Por hacerte reír, por escucharte, por estar ahí en los días buenos y en los difíciles.\n\nFeliz Navidad, mi amor. Y que vengan muchas más juntos.\n\nCon todo mi amor,\nJavi',
      opened: false,
    },
    {
      id: '3',
      date: '14 Feb 2024',
      label: 'Carta #3',
      content: 'Mi querida Cami,\n\nDos años. Dos años de risas, de aprendizajes, de crecimiento. Dos años en los que he descubierto que el amor verdadero no es solo mariposas en el estómago, sino también la tranquilidad de saber que alguien siempre está ahí.\n\nEres mi hogar, mi paz, mi aventura favorita. No sé qué me deparará el futuro, pero sé que quiero que tú estés en él.\n\nFeliz San Valentín.\n\nTe amo con todo mi ser.\n\nCon todo mi amor,\nJavi',
      opened: false,
    },
  ],
};

function getStatusFromTasks(tasks: { id: string; title: string; done: boolean }[]) {
  if (!tasks || tasks.length === 0 || tasks.every(task => !task.done)) {
    return 'pending';
  }

  if (tasks.every(task => task.done)) {
    return 'completed';
  }

  return 'in-progress';
}

function normalizeStoredGoal(goal: any) {
  const tasks = Array.isArray(goal?.tasks)
    ? goal.tasks.map((task: any) => ({
        id: task?.id || crypto.randomUUID(),
        title: String(task?.title || ''),
        done: Boolean(task?.done),
      }))
    : [];

  return {
    id: goal?.id || crypto.randomUUID(),
    title: String(goal?.title || ''),
    description: String(goal?.description || ''),
    status: getStatusFromTasks(tasks),
    photos: Array.isArray(goal?.photos) ? goal.photos : [],
    tasks,
    createdAt: goal?.createdAt || new Date().toISOString(),
  };
}

function normalizeStoredObjective(obj: any): PersonalObjective {
  const tasks = Array.isArray(obj?.tasks)
    ? obj.tasks.map((task: any) => ({
        id: task?.id || crypto.randomUUID(),
        title: String(task?.title || ''),
        done: Boolean(task?.done),
      }))
    : [];

  return {
    id: obj?.id || crypto.randomUUID(),
    owner: obj?.owner === 'cami' ? 'cami' : 'javi',
    title: String(obj?.title || ''),
    description: String(obj?.description || ''),
    emoji: String(obj?.emoji || '🎯'),
    priority: Number(obj?.priority) || 99,
    tasks,
    checkins: Array.isArray(obj?.checkins)
      ? obj.checkins.map((c: any) => ({ date: String(c?.date || ''), note: String(c?.note || '') }))
      : [],
    createdAt: obj?.createdAt || new Date().toISOString(),
  };
}

function loadData(): AppData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...defaultData,
        ...parsed,
        goals: Array.isArray(parsed.goals)
          ? parsed.goals.map(normalizeStoredGoal)
          : defaultData.goals,
        personalObjectives: Array.isArray(parsed.personalObjectives)
          ? parsed.personalObjectives.map(normalizeStoredObjective)
          : defaultData.personalObjectives,
      };
    }
  } catch {
    // ignore
  }
  return defaultData;
}

function saveData(data: AppData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function useAppData() {
  const [data, setData] = useState<AppData>(loadData);

  useEffect(() => {
    saveData(data);
  }, [data]);

  // Goals CRUD
  const addGoal = useCallback((goal: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goal,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setData(prev => ({ ...prev, goals: [...prev.goals, newGoal] }));
  }, []);

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === id ? { ...g, ...updates } : g),
    }));
  }, []);

  const addPhotoToGoal = useCallback((id: string, photoSrc: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.map(g =>
        g.id === id ? { ...g, photos: [...g.photos, photoSrc] } : g
      ),
    }));
  }, []);

  const deletePhotoFromGoal = useCallback((goalId: string, photoIndex: number) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.map(g =>
        g.id === goalId ? { ...g, photos: g.photos.filter((_, i) => i !== photoIndex) } : g
      ),
    }));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== id),
    }));
  }, []);

  // Personal Objectives CRUD
  const toggleObjectiveTask = useCallback((objectiveId: string, taskId: string) => {
    setData(prev => ({
      ...prev,
      personalObjectives: prev.personalObjectives.map(obj =>
        obj.id === objectiveId
          ? {
              ...obj,
              tasks: obj.tasks.map(t =>
                t.id === taskId ? { ...t, done: !t.done } : t
              ),
            }
          : obj
      ),
    }));
  }, []);

  const addObjectiveCheckin = useCallback((objectiveId: string, note: string) => {
    const today = new Date().toISOString().split('T')[0];
    setData(prev => ({
      ...prev,
      personalObjectives: prev.personalObjectives.map(obj =>
        obj.id === objectiveId
          ? {
              ...obj,
              checkins: [
                ...obj.checkins.filter(c => c.date !== today),
                { date: today, note },
              ],
            }
          : obj
      ),
    }));
  }, []);

  const addObjective = useCallback((objective: Omit<PersonalObjective, 'id' | 'createdAt' | 'checkins'>) => {
    const newObj: PersonalObjective = {
      ...objective,
      id: crypto.randomUUID(),
      checkins: [],
      createdAt: new Date().toISOString(),
    };
    setData(prev => ({
      ...prev,
      personalObjectives: [...prev.personalObjectives, newObj],
    }));
  }, []);

  const deleteObjective = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      personalObjectives: prev.personalObjectives.filter(o => o.id !== id),
    }));
  }, []);

  // Photos CRUD
  const addPhoto = useCallback((photo: Omit<GalleryPhoto, 'id'>) => {
    const newPhoto: GalleryPhoto = { ...photo, id: crypto.randomUUID() };
    setData(prev => ({
      ...prev,
      photos: [...prev.photos, newPhoto].slice(-20),
    }));
  }, []);

  const deletePhoto = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      photos: prev.photos.filter(p => p.id !== id),
    }));
  }, []);

  // Journal CRUD
  const addJournalEntry = useCallback((entry: Omit<JournalEntry, 'id'>) => {
    const newEntry: JournalEntry = { ...entry, id: crypto.randomUUID() };
    setData(prev => ({
      ...prev,
      journal: [newEntry, ...prev.journal],
    }));
  }, []);

  // Letters
  const openLetter = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      letters: prev.letters.map(l => l.id === id ? { ...l, opened: true } : l),
    }));
  }, []);

  return {
    data,
    startDate: START_DATE,
    addGoal,
    updateGoal,
    addPhotoToGoal,
    deletePhotoFromGoal,
    deleteGoal,
    toggleObjectiveTask,
    addObjectiveCheckin,
    addObjective,
    deleteObjective,
    addPhoto,
    deletePhoto,
    addJournalEntry,
    openLetter,
  };
}

export function useTimeCounter(startDate: Date) {
  const [time, setTime] = useState(() => calculateTime(startDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(calculateTime(startDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  return time;
}

function calculateTime(start: Date) {
  const now = new Date();
  const diff = now.getTime() - start.getTime();

  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
  const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { years, months, days, hours, minutes, seconds };
}

