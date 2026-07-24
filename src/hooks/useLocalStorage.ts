import { useState, useCallback, useEffect } from 'react';
import type { AppData, Goal, GalleryPhoto, JournalEntry } from '@/types';

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
      description: 'fue nuestra primera vez juntos y la verdad fue wow, amanecimos y encima tuvimos ma;anero, fue una locura, intente volver a los saltitos a mi casa pero no pude.',
    },
  ],
  photos: [
    { id: '1', src: '/images/gallery-1.jpg', date: '15 Ago 2022', note: 'Atardecer en la playa', aspectRatio: '3/4' as const },
    { id: '2', src: '/images/gallery-2.jpg', date: '20 Sep 2022', note: 'Café y croissants', aspectRatio: '4/3' as const },
    { id: '3', src: '/images/gallery-3.jpg', date: '5 Nov 2022', note: 'Bailando bajo la lluvia', aspectRatio: '1/1' as const },
    { id: '4', src: '/images/gallery-4.jpg', date: '14 Feb 2023', note: 'Nuestras manos, nuestro pacto', aspectRatio: '16/9' as const },
    { id: '5', src: '/images/gallery-5.jpg', date: '3 Jun 2023', note: 'Domingo de pelis', aspectRatio: '3/4' as const },
    { id: '6', src: '/images/gallery-6.jpg', date: '12 Ago 2023', note: 'Aventura en la montaña', aspectRatio: '4/3' as const },
  ],
  goals: [
    {
      id: '7',
      title: 'Hacer mantecol casero',
      description: 'Preparar nuestro propio mantecol desde cero y compartirlo mientras nos reímos de los errores de la receta.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '7-1', title: 'Buscar una receta', done: false },
        { id: '7-2', title: 'Comprar los ingredientes', done: false },
        { id: '7-3', title: 'Elegir un día para cocinar', done: false },
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
        { id: '8-1', title: 'Elegir diseño', done: false },
        { id: '8-2', title: 'Pintarlos', done: false },
        { id: '8-3', title: 'Terminarlos', done: false },
        { id: '8-4', title: 'Sacar una foto del resultado', done: false },
      ],
      createdAt: '2026-06-13T10:10:00',
    },
    {
      id: '9',
      title: 'Ir al club juntos',
      description: 'Pasar un día relajados disfrutando del agua, el sol y nuestra compañía.',
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
      description: 'Aprender una canción especial para nosotros.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '11-1', title: 'Elegir canción', done: false },
        { id: '11-2', title: 'Aprender acordes básicos', done: false },
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
      description: 'Pasar una noche construyendo proyectos, estudiando o simplemente acompañándonos.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '13-1', title: 'Elegir proyecto', done: false },
        { id: '13-2', title: 'Preparar café o mate', done: false },
        { id: '13-3', title: 'Hacer una playlist', done: false },
        { id: '13-4', title: 'Ver quién aguanta más despierto', done: false },
      ],
      createdAt: '2026-06-13T11:00:00',
    },
    {
      id: '14',
      title: 'Ver una saga completa',
      description: 'Maratón de películas con manta, comida y cero interrupciones.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '14-1', title: 'Elegir saga', done: false },
        { id: '14-2', title: 'Preparar snacks', done: false },
        { id: '14-3', title: 'Organizar fechas', done: false },
        { id: '14-4', title: 'Puntuar cada película', done: false },
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
      description: 'Disfrutar juntos de un día lluvioso sin hacer nada más.',
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
      description: 'Convertir los viernes en una tradición deliciosa.',
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
        { id: '18-2', title: 'Llevar registro de capítulos', done: false },
        { id: '18-3', title: 'Elegir personaje favorito', done: false },
        { id: '18-4', title: 'Terminar todas las temporadas', done: false },
      ],
      createdAt: '2026-06-13T11:50:00',
    },
    {
      id: '19',
      title: 'Noche de juegos',
      description: 'Competir, reírnos y pasar una noche diferente.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '19-1', title: 'Elegir juegos', done: false },
        { id: '19-2', title: 'Preparar snacks', done: false },
        { id: '19-3', title: 'Llevar marcador', done: false },
        { id: '19-4', title: 'Coronar al campeón', done: false },
      ],
      createdAt: '2026-06-13T12:00:00',
    },
    {
      id: '20',
      title: 'Saltar en paracaídas',
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
      title: 'Mates de limón',
      description: 'Compartir una tarde diferente probando algo que nos identifica.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '21-1', title: 'Conseguir limones', done: false },
        { id: '21-2', title: 'Preparar mate', done: false },
        { id: '21-3', title: 'Encontrar la combinación perfecta', done: false },
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
        { id: '22-5', title: 'Crear álbum', done: false },
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
        { id: '23-3', title: 'Comentar capítulos', done: false },
        { id: '23-4', title: 'Terminarlo juntos', done: false },
      ],
      createdAt: '2026-06-13T12:40:00',
    },
    {
      id: '24',
      title: 'Crear hábitos sanos juntos',
      description: 'Ayudarnos a ser mejores cada día.',
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
      title: 'Regular horarios de sueño',
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
      title: 'Tener momentos de paz y reflexión',
      description: 'Detenernos para valorar lo que tenemos y hacia dónde vamos.',
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
      description: 'Buscar a Dios juntos y fortalecer nuestra relación a través de la fe.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '27-1', title: 'Leer un pasaje bíblico', done: false },
        { id: '27-2', title: 'Compartir reflexión', done: false },
        { id: '27-3', title: 'Orar juntos', done: false },
        { id: '27-4', title: 'Mantener una racha de 30 días', done: false },
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
        { id: '28-1', title: 'Hablar sobre nuestros sueños', done: false },
        { id: '28-2', title: 'Construir estabilidad emocional', done: false },
        { id: '28-3', title: 'Construir estabilidad económica', done: false },
        { id: '28-4', title: 'Conocer más profundamente nuestras diferencias', done: false },
        { id: '28-5', title: 'Planear el futuro juntos', done: false },
        { id: '28-6', title: 'Dar el paso cuando llegue el momento correcto', done: false },
      ],
      createdAt: '2026-06-13T13:30:00',
    },
  ],
      description: 'Preparar nuestro propio mantecol desde cero y compartirlo mientras nos reímos de los errores de la receta.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '7-1', title: 'Buscar una receta', done: false },
        { id: '7-2', title: 'Comprar los ingredientes', done: false },
        { id: '7-3', title: 'Elegir un día para cocinar', done: false },
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
        { id: '8-1', title: 'Elegir diseño', done: false },
        { id: '8-2', title: 'Pintarlos', done: false },
        { id: '8-3', title: 'Terminarlos', done: false },
        { id: '8-4', title: 'Sacar una foto del resultado', done: false },
      ],
      createdAt: '2026-06-13T10:10:00',
    },
    {
      id: '9',
      title: 'Ir al club juntos',
      description: 'Pasar un día relajados disfrutando del agua, el sol y nuestra compañía.',
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
      description: 'Aprender una canción especial para nosotros.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '11-1', title: 'Elegir canción', done: false },
        { id: '11-2', title: 'Aprender acordes básicos', done: false },
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
      description: 'Pasar una noche construyendo proyectos, estudiando o simplemente acompañándonos.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '13-1', title: 'Elegir proyecto', done: false },
        { id: '13-2', title: 'Preparar café o mate', done: false },
        { id: '13-3', title: 'Hacer una playlist', done: false },
        { id: '13-4', title: 'Ver quién aguanta más despierto', done: false },
      ],
      createdAt: '2026-06-13T11:00:00',
    },
    {
      id: '14',
      title: 'Ver una saga completa',
      description: 'Maratón de películas con manta, comida y cero interrupciones.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '14-1', title: 'Elegir saga', done: false },
        { id: '14-2', title: 'Preparar snacks', done: false },
        { id: '14-3', title: 'Organizar fechas', done: false },
        { id: '14-4', title: 'Puntuar cada película', done: false },
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
      description: 'Disfrutar juntos de un día lluvioso sin hacer nada más.',
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
      description: 'Convertir los viernes en una tradición deliciosa.',
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
        { id: '18-2', title: 'Llevar registro de capítulos', done: false },
        { id: '18-3', title: 'Elegir personaje favorito', done: false },
        { id: '18-4', title: 'Terminar todas las temporadas', done: false },
      ],
      createdAt: '2026-06-13T11:50:00',
    },
    {
      id: '19',
      title: 'Noche de juegos',
      description: 'Competir, reírnos y pasar una noche diferente.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '19-1', title: 'Elegir juegos', done: false },
        { id: '19-2', title: 'Preparar snacks', done: false },
        { id: '19-3', title: 'Llevar marcador', done: false },
        { id: '19-4', title: 'Coronar al campeón', done: false },
      ],
      createdAt: '2026-06-13T12:00:00',
    },
    {
      id: '20',
      title: 'Saltar en paracaídas',
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
      title: 'Mates de limón',
      description: 'Compartir una tarde diferente probando algo que nos identifica.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '21-1', title: 'Conseguir limones', done: false },
        { id: '21-2', title: 'Preparar mate', done: false },
        { id: '21-3', title: 'Encontrar la combinación perfecta', done: false },
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
        { id: '22-5', title: 'Crear álbum', done: false },
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
        { id: '23-3', title: 'Comentar capítulos', done: false },
        { id: '23-4', title: 'Terminarlo juntos', done: false },
      ],
      createdAt: '2026-06-13T12:40:00',
    },
    {
      id: '24',
      title: 'Crear hábitos sanos juntos',
      description: 'Ayudarnos a ser mejores cada día.',
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
      title: 'Regular horarios de sueño',
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
      title: 'Tener momentos de paz y reflexión',
      description: 'Detenernos para valorar lo que tenemos y hacia dónde vamos.',
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
      description: 'Buscar a Dios juntos y fortalecer nuestra relación a través de la fe.',
      status: 'pending',
      photos: [],
      tasks: [
        { id: '27-1', title: 'Leer un pasaje bíblico', done: false },
        { id: '27-2', title: 'Compartir reflexión', done: false },
        { id: '27-3', title: 'Orar juntos', done: false },
        { id: '27-4', title: 'Mantener una racha de 30 días', done: false },
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
        { id: '28-1', title: 'Hablar sobre nuestros sueños', done: false },
        { id: '28-2', title: 'Construir estabilidad emocional', done: false },
        { id: '28-3', title: 'Construir estabilidad económica', done: false },
        { id: '28-4', title: 'Conocer más profundamente nuestras diferencias', done: false },
        { id: '28-5', title: 'Planear el futuro juntos', done: false },
        { id: '28-6', title: 'Dar el paso cuando llegue el momento correcto', done: false },
      ],
      createdAt: '2026-06-13T13:30:00',
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
