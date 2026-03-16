import { Type } from "@google/genai";

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  promptId?: string;
  mood?: string;
  tags?: string[];
}

export interface RegulationCard {
  id: string;
  title: string;
  situation: string;
  exercise: string;
  effect: string;
  category: 'reset' | 'sensory' | 'breath' | 'release' | 'focus' | 'creative';
  duration: string;
  contraindications?: string;
}

export interface SomaticExercise {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  duration: string;
  state: 'fight' | 'flight' | 'freeze' | 'fawn' | 'all';
  benefit: string;
  icon: string;
}

export const SOMATIC_EXERCISES: SomaticExercise[] = [
  {
    id: 's1',
    title: 'Vagus Nerve Reset (Salamander)',
    description: 'Een snelle manier om je zenuwstelsel van "vecht/vlucht" naar "rust" te schakelen via je oogspieren.',
    instructions: [
      'Houd je hoofd recht vooruit gericht.',
      'Zonder je hoofd te bewegen, kijk je met je ogen zo ver mogelijk naar rechts.',
      'Houd deze positie vast (30-60 sec) tot je een reflexmatige gaap, zucht of slik voelt.',
      'Breng je ogen terug naar het midden en herhaal naar links.'
    ],
    duration: '2 min',
    state: 'fight',
    benefit: 'Activeert de ventrale vagus tak voor directe kalmte.',
    icon: '👁️'
  },
  {
    id: 's2',
    title: 'Physiological Sigh',
    description: 'De meest effectieve manier om je hartslag en stressniveau binnen 60 seconden te verlagen.',
    instructions: [
      'Adem diep in door je neus.',
      'Aan het einde van die inademing, neem je nog een extra korte "snuf" lucht erbij.',
      'Adem nu heel langzaam en volledig uit door je mond met getuite lippen.',
      'Herhaal dit 3 tot 5 keer.'
    ],
    duration: '1 min',
    state: 'flight',
    benefit: 'Zorgt voor een snelle afvoer van CO2 en verlaagt de hartslag.',
    icon: '🌬️'
  },
  {
    id: 's3',
    title: 'Somatic Shaking',
    description: 'Laat opgebouwde adrenaline en stress-energie fysiek uit je lichaam trillen.',
    instructions: [
      'Ga stevig staan met je knieën licht gebogen.',
      'Begin met het schudden van je handen en polsen.',
      'Laat de beweging uitbreiden naar je armen, schouders en uiteindelijk je hele lijf.',
      'Stel je voor dat je de stress letterlijk van je af schudt.',
      'Stop na 1-2 minuten en voel de tinteling en stilte in je lichaam.'
    ],
    duration: '2 min',
    state: 'fight',
    benefit: 'Ontlaadt de "vecht/vlucht" energie die anders in je spieren blijft zitten.',
    icon: '🫨'
  },
  {
    id: 's4',
    title: 'Self-Soothe Havening',
    description: 'Gebruik zachte aanraking om delta-golven in je brein te stimuleren voor veiligheid.',
    instructions: [
      'Plaats je handen op je schouders.',
      'Strijk langzaam en met lichte druk naar beneden richting je ellebogen.',
      'Herhaal deze beweging ritmisch.',
      'Je kunt ook zachtjes over je wangen strijken of je handpalmen over elkaar wrijven.',
      'Focus op de sensatie van de aanraking en adem rustig door.'
    ],
    duration: '3 min',
    state: 'freeze',
    benefit: 'Verhoogt oxytocine en creëert een chemisch signaal van veiligheid.',
    icon: '👐'
  },
  {
    id: 's5',
    title: 'Orienting (Omgeving Scannen)',
    description: 'Herinner je brein eraan dat je hier en nu veilig bent door je omgeving bewust waar te nemen.',
    instructions: [
      'Laat je ogen langzaam door de ruimte dwalen.',
      'Zoek naar 3 objecten met de kleur blauw (of een andere kleur).',
      'Merk de contouren, schaduwen en texturen op.',
      'Draai je hoofd langzaam om ook achter je te kijken (veiligheidscheck).',
      'Voel hoe je lichaam zich ontspant als het bevestigt dat er geen direct gevaar is.'
    ],
    duration: '2 min',
    state: 'all',
    benefit: 'Haalt je uit een interne angst-loop en brengt je terug in de realiteit.',
    icon: '🧭'
  },
  {
    id: 's6',
    title: 'Body Tapping (Bekloppen)',
    description: 'Een snelle manier om je hele lichaam weer te voelen en uit je hoofd te komen.',
    instructions: [
      'Maak zachte vuisten of gebruik je vingertoppen.',
      'Begin bovenaan je hoofd en klop zachtjes.',
      'Werk naar beneden: je gezicht, nek, borstkas, armen, buik en benen.',
      'Klop steviger op grote spiergroepen zoals je bovenbenen.',
      'Eindig bij je voeten en voel de tinteling over je hele lichaam.'
    ],
    duration: '2 min',
    state: 'freeze',
    benefit: 'Verhoogt de proprioceptie (lichaamsbewustzijn) en doorbloeding.',
    icon: '🖐️'
  },
  {
    id: 's7',
    title: 'De "Voo" Klank',
    description: 'Gebruik de kracht van trilling om je zenuwstelsel van binnenuit te masseren.',
    instructions: [
      'Adem diep in naar je buik.',
      'Maak bij de uitademing een laag, diep "Voo" geluid, als een misthoorn.',
      'Focus op de trilling in je buik, borst en keel.',
      'Laat de klank helemaal uitsterven.',
      'Neem een moment stilte en herhaal 3 keer.'
    ],
    duration: '2 min',
    state: 'all',
    benefit: 'Trilt de nervus vagus en kalmeert de organen in de buikholte.',
    icon: '🔊'
  },
  {
    id: 's8',
    title: 'Jaw Release (Kaak Ontspannen)',
    description: 'De kaak houdt vaak de meeste onbewuste spanning vast, vooral bij frustratie.',
    instructions: [
      'Plaats je vingertoppen op de spieren net voor je oren (waar je kaak scharniert).',
      'Open je mond een klein beetje en masseer met cirkelvormige bewegingen.',
      'Laat je onderkaak nu volledig zwaar worden en "hangen".',
      'Maak een zachte zucht terwijl je de spanning loslaat.',
      'Beweeg je kaak zachtjes van links naar rechts.'
    ],
    duration: '1 min',
    state: 'fight',
    benefit: 'Ontspant de craniale zenuwen en vermindert de "vecht" spanning in het gezicht.',
    icon: '👄'
  },
  {
    id: 's9',
    title: 'Deep Pressure (Zelf-Knuffel)',
    description: 'Geef je systeem de begrenzing en geborgenheid die het nodig heeft om te kalmeren.',
    instructions: [
      'Sla je armen om jezelf heen, met je handen op je bovenarmen of zij.',
      'Geef jezelf een stevige, constante druk (niet knijpen, maar begrenzen).',
      'Wieg eventueel heel zachtjes van links naar rechts.',
      'Zeg in jezelf: "Ik heb je, je bent hier, je bent veilig bij mij."',
      'Houd dit vast tot je een diepe zucht of ontspanning voelt.'
    ],
    duration: '2 min',
    state: 'fawn',
    benefit: 'Activeert het proprioceptieve systeem en geeft een gevoel van "containment".',
    icon: '🫂'
  },
  {
    id: 's10',
    title: 'Foot Press (Gronden)',
    description: 'Veranker jezelf in de aarde wanneer je je zweverig of angstig voelt.',
    instructions: [
      'Ga zitten of staan met je voeten plat op de grond.',
      'Druk je hielen heel bewust in de vloer.',
      'Spreid je tenen en druk ze één voor één in de grond.',
      'Voel de stevigheid van de vloer die jou draagt.',
      'Stel je voor dat je alle overtollige energie via je voeten de aarde in laat stromen.'
    ],
    duration: '1 min',
    state: 'flight',
    benefit: 'Versterkt de verbinding met de fysieke realiteit en verlaagt angst.',
    icon: '👣'
  }
];

export const SOMATIC_WISDOMS: Record<string, { title: string, text: string }> = {
  fight: {
    title: "De Kracht van Ontlading",
    text: "Je lichaam is momenteel een vat vol opgeslagen energie. Vechten tegen deze energie maakt het alleen maar sterker. Geef het een veilige uitweg door beweging of druk. Je bent niet boos, je bent geactiveerd."
  },
  flight: {
    title: "Landen in het Nu",
    text: "Je systeem probeert je te beschermen door vooruit te rennen. De veiligheid die je zoekt ligt echter niet 'daar', maar hier in je voeten op de grond. Vertraag je uitademing om je brein te vertellen dat de achtervolging voorbij is."
  },
  freeze: {
    title: "Zachtjes Ontdooien",
    text: "Bevriezen is een intelligente bescherming tegen overweldiging. Forceer jezelf niet om te bewegen. Begin met kleine sensaties: de warmte van je handen, de kleur van een object. Zachtheid is de sleutel tot ontdooien."
  },
  fawn: {
    title: "Je Eigen Ruimte Claimen",
    text: "Je hebt geleerd dat veiligheid ligt in de ander. Vandaag oefenen we om de veiligheid in jezelf te vinden. Voel de grenzen van je eigen huid. Jouw behoeften en jouw ruimte zijn heilig."
  },
  all: {
    title: "Luisteren naar het Lichaam",
    text: "Je lichaam spreekt geen Nederlands, het spreekt sensaties. Elke tinteling, spanning of zwaarte is een boodschap. Door simpelweg aanwezig te zijn bij deze sensaties, begin je het proces van heling."
  }
};

export const REGULATION_CARDS: RegulationCard[] = [
  // Snel resetten (60–120 sec)
  { id: '1', title: 'Koud Water Reset', situation: 'Bij acute paniek of dissociatie', exercise: '1. Ga naar een wastafel.\n2. Laat koud water over je polsen lopen gedurende 30 seconden.\n3. Spat daarna voorzichtig wat koud water in je gezicht.\n4. Focus op de sensatie van de kou op je huid.', effect: 'Triggert de "duikreflex", wat je hartslag direct verlaagt.', category: 'reset', duration: '30 sec' },
  { id: '2', title: 'De 5-4-3-2-1 Methode', situation: 'Als je overprikkeld bent of in je hoofd zit', exercise: '1. Benoem 5 dingen die je op dit moment ziet.\n2. Benoem 4 dingen die je fysiek kunt voelen (bijv. je kleding).\n3. Benoem 3 geluiden die je hoort.\n4. Benoem 2 dingen die je kunt ruiken.\n5. Benoem 1 ding dat je kunt proeven.', effect: 'Brengt je aandacht terug naar het huidige moment en je zintuigen.', category: 'sensory', duration: '2-3 min' },
  { id: '3', title: 'Muur Duwen', situation: 'Bij frustratie of opgekropte vecht-energie', exercise: '1. Ga voor een stevige muur staan.\n2. Zet je handen plat tegen de muur op schouderhoogte.\n3. Duw zo hard als je kunt, alsof je de muur wilt verplaatsen.\n4. Houd dit 10 seconden vol.\n5. BELANGRIJK: Laat de spanning heel langzaam en gecontroleerd los. Haal je handen niet plotseling weg om te voorkomen dat je uit balans raakt.\n6. Voel de ontspanning in je armen en schouders.', effect: 'Geeft een fysieke uitlaatklep voor opgebouwde spanning.', category: 'reset', duration: '1 min' },
  { id: '4', title: 'Zuchten met Geluid', situation: 'Om direct spanning los te laten', exercise: '1. Adem diep in door je neus.\n2. Laat je adem ontsnappen met een hoorbare "aaaaah" of "pffff".\n3. Laat je schouders zakken bij elke uitademing.\n4. Herhaal dit 3 tot 5 keer.', effect: 'Ontspant de kaak en het middenrif.', category: 'reset', duration: '1 min' },
  { id: '5', title: 'Vlinderknuffel', situation: 'Voor zelf-kalmering en troost', exercise: '1. Kruis je armen over je borst.\n2. Haak je duimen in elkaar (als de romp van een vlinder).\n3. Tik om en om zachtjes met je vingers op je bovenarmen.\n4. Adem rustig door terwijl je dit ritme aanhoudt.', effect: 'Bilaterale stimulatie kalmeert de amygdala.', category: 'reset', duration: '2 min' },
  { id: '6', title: 'Oor Massage', situation: 'Snel kalmeren van het zenuwstelsel', exercise: '1. Pak je oorschelpen vast tussen duim en wijsvinger.\n2. Masseer zachtjes van boven naar beneden.\n3. Trek je oorlellen heel lichtjes naar beneden.\n4. Focus op de warmte die ontstaat in je oren.', effect: 'Stimuleert de nervus vagus takken in het oor.', category: 'reset', duration: '1 min' },

  // Sensorisch gronden
  { id: '7', title: 'Voeten op de Grond', situation: 'Als je je zweverig of angstig voelt', exercise: '1. Ga stevig staan of zitten met je rug recht.\n2. Druk je hielen en tenen bewust in de vloer.\n3. Voel de textuur van de vloer onder je voeten.\n4. Zeg in jezelf: "Ik ben hier, ik ben veilig, de grond draagt mij."', effect: 'Versterkt het gevoel van veiligheid door fysieke verbinding.', category: 'sensory', duration: '1 min' },
  { id: '8', title: 'Gewicht op Schoot', situation: 'Voor een gevoel van geborgenheid', exercise: '1. Pak een zwaar kussen of een verzwaringsdeken.\n2. Leg dit op je schoot terwijl je zit.\n3. Laat je schouders zakken en voel de druk.\n4. Adem diep naar je buik, onder het gewicht.', effect: 'Diepe druk verlaagt het cortisolniveau.', category: 'sensory', duration: '5 min' },
  { id: '9', title: 'Textuur Voelen', situation: 'Om uit je hoofd te komen', exercise: '1. Zoek een voorwerp in je directe omgeving met een duidelijke textuur (bijv. een ruwe steen, een zachte sjaal, of een houten tafel).\n2. Sluit je ogen als dat veilig voelt.\n3. Beweeg je vingertoppen langzaam over het oppervlak.\n4. Focus volledig op de details: is het koud, warm, ruw, glad, hard of zacht?\n5. Probeer de sensatie te beschrijven in je hoofd zonder oordeel.', effect: 'Verlegt de focus van interne angst naar externe realiteit.', category: 'sensory', duration: '2 min' },
  { id: '10', title: 'Geur Anker', situation: 'Directe invloed op je emoties', exercise: '1. Pak een etherische olie of een ander voorwerp met een sterke, prettige geur (bijv. verse koffie of een citroen).\n2. Breng het voorwerp naar je neus.\n3. Adem diep en langzaam in door je neus.\n4. Focus op hoe de geur je neusgaten binnenkomt en wat het oproept.\n5. Adem rustig uit en herhaal dit 3 keer.', effect: 'Het reukorgaan staat in directe verbinding met het limbisch systeem.', category: 'sensory', duration: '1 min' },
  { id: '11', title: 'Zachte Blik', situation: 'Bij visuele overprikkeling', exercise: '1. Kijk recht voor je uit naar een vast punt.\n2. Ontspan langzaam je oogspieren.\n3. Laat je blik wazig worden, alsof je door het object heen kijkt.\n4. Probeer je bewust te worden van wat je aan de zijkanten (periferie) van je gezichtsveld ziet, zonder je ogen te bewegen.\n5. Voel hoe de spanning in je gezicht afneemt.', effect: 'Schakelt het brein van tunnelvisie naar veiligheidsmodus.', category: 'sensory', duration: '1 min' },

  // Adem & ritme
  { id: '12', title: 'Verlengde Uitademing', situation: 'Bij angst of een opgejaagd gevoel', exercise: '1. Ga comfortabel zitten of staan.\n2. Adem 4 tellen in door je neus.\n3. Tuit je lippen alsof je door een rietje blaast.\n4. Adem 8 tellen langzaam uit.\n5. Herhaal dit gedurende 2 minuten.', effect: 'Activeert direct het parasympathische zenuwstelsel.', category: 'breath', duration: '2 min' },
  { id: '13', title: 'Box Breathing', situation: 'Voor focus en emotionele controle', exercise: '1. Adem 4 tellen in.\n2. Houd je adem 4 tellen vast.\n3. Adem 4 tellen uit.\n4. Wacht 4 tellen voordat je weer inademt.\n5. Herhaal deze "vierkant" ademhaling.', effect: 'Brengt balans in het autonome zenuwstelsel.', category: 'breath', duration: '3 min' },
  { id: '14', title: 'Bijen Adem (Brahmari)', situation: 'Om interne ruis en piekeren te stoppen', exercise: '1. Ga comfortabel zitten.\n2. Adem diep in door je neus.\n3. Sluit je mond en maak bij de uitademing een zoemend geluid (als een bij).\n4. Voel de trilling in je hoofd en borstkas.\n5. Herhaal dit 5 keer.', effect: 'De trilling kalmeert de hersenen en het zenuwstelsel.', category: 'breath', duration: '2 min' },
  { id: '15', title: 'Hand op Buik', situation: 'Om weer laag te gaan ademen', exercise: '1. Leg één hand op je buik en de andere op je borst.\n2. Adem in door je neus en probeer alleen de hand op je buik te laten bewegen.\n3. Adem langzaam uit door je mond.\n4. Voel hoe je buik weer zakt.\n5. Herhaal dit rustig.', effect: 'Verlaagt de hartslag door middenrifademhaling.', category: 'breath', duration: '2 min' },
  { id: '16', title: 'Ritmisch Tikken', situation: 'Om je systeem te reguleren', exercise: '1. Ga zitten met je voeten plat op de grond.\n2. Leg je handen op je knieën.\n3. Tik met je vingers een rustig, constant ritme (bijv. links-rechts-links-rechts).\n4. Probeer je ademhaling te synchroniseren met het tikken.\n5. Blijf dit doen totdat je merkt dat je hartslag rustiger wordt.', effect: 'Ritme geeft een gevoel van voorspelbaarheid en veiligheid.', category: 'breath', duration: '2 min' },

  // Ontlading & spanning loslaten
  { id: '17', title: 'Shake it Out', situation: 'Na een stressvolle call of conflict', exercise: '1. Ga staan en begin met het schudden van je handen.\n2. Laat het schudden overgaan naar je armen en schouders.\n3. Schud nu ook je benen, één voor één.\n4. Schud tenslotte je hele lichaam gedurende een minuut.\n5. Stop en voel de tinteling in je lijf.', effect: 'Helpt opgebouwde adrenaline fysiek te ontladen.', category: 'release', duration: '1 min' },
  { id: '18', title: 'Kaak Ontspannen', situation: 'Bij ingehouden woede of stress', exercise: '1. Open je mond zo wijd als je kunt.\n2. Beweeg je onderkaak langzaam van links naar rechts.\n3. Laat je kaak nu volledig "hangen".\n4. Laat een zachte zucht los terwijl je de spanning voelt wegvloeien.', effect: 'De kaak houdt vaak veel onbewuste spanning vast.', category: 'release', duration: '1 min' },
  { id: '19', title: 'Progressieve Ontspanning', situation: 'Voor totale lichaamsrust', exercise: '1. Ga liggen of zitten.\n2. Span je vuisten zo hard mogelijk aan gedurende 5 seconden.\n3. Laat in één keer volledig los.\n4. Doe hetzelfde met je schouders, dan je buik, en tenslotte je voeten.\n5. Voel het verschil tussen de extreme spanning en de diepe ontspanning.', effect: 'Leert het lichaam het verschil tussen spanning en ontspanning.', category: 'release', duration: '5 min' },
  { id: '20', title: 'Kussen Slaan', situation: 'Veilige uiting van frustratie', exercise: '1. Pak een stevig kussen.\n2. Ga stevig staan.\n3. Sla met beide handen krachtig op het kussen.\n4. Maak eventueel een geluid bij de slag.\n5. Herhaal dit totdat de scherpe rand van je frustratie af is.', effect: 'Ontlaadt agressieve energie zonder schade aan te richten.', category: 'release', duration: '1 min' },
  { id: '21', title: 'Gapen op Commando', situation: 'Om je systeem te "resetten"', exercise: '1. Open je mond wijd en doe alsof je heel diep gaapt.\n2. Rek je armen daarbij uit.\n3. Blijf dit herhalen totdat er een echte, diepe gaap volgt.\n4. Laat de gaap helemaal afmaken, inclusief het geluid.', effect: 'Reguleert de temperatuur van de hersenen en ontspant de keel.', category: 'release', duration: '1 min' },

  // Focus & activeren
  { id: '22', title: 'De Horizon Scan', situation: 'Voor focus en helderheid', exercise: '1. Kijk naar buiten of in de verte.\n2. Laat je ogen langzaam langs de horizon glijden van links naar rechts.\n3. Merk op wat je ziet zonder erop te focussen.\n4. Laat je ogen weer rustig terugkeren naar het midden.\n5. Herhaal dit 3 keer.', effect: 'Geeft een signaal van veiligheid aan je brein door omgevingsscan.', category: 'focus', duration: '1 min' },
  { id: '23', title: 'Kruisloop', situation: 'Om linker- en rechterhersenhelft te verbinden', exercise: '1. Ga staan en begin op de plaats te marcheren.\n2. Tik met je linkerhand je rechterknie aan als deze omhoog komt.\n3. Tik met je rechterhand je linkerknie aan.\n4. Ga zo door in een rustig ritme.\n5. Voel hoe de samenwerking tussen je beide hersenhelften verbetert.', effect: 'Verbetert de cognitieve functie en focus.', category: 'focus', duration: '2 min' },
  { id: '24', title: 'Rechtstaan als een Boom', situation: 'Voor zelfvertrouwen en stabiliteit', exercise: '1. Ga staan met je voeten op schouderbreedte.\n2. Houd je knieën licht gebogen (niet op het slot).\n3. Stel je voor dat er wortels uit je voeten de grond in groeien.\n4. Maak je rug recht en stel je voor dat een draadje je kruin naar de hemel trekt.\n5. Blijf 2 minuten zo staan en voel je eigen kracht.', effect: 'Verbetert de houding en geeft een gevoel van "grounded power".', category: 'focus', duration: '2 min' },
  { id: '25', title: 'Korte Koude Prikkel', situation: 'Om wakker en alert te worden', exercise: '1. Ga naar de kraan.\n2. Zet de koude kraan aan.\n3. Was je handen en polsen gedurende 30 seconden.\n4. Dep je gezicht eventueel droog met een frisse handdoek.', effect: 'Verhoogt de alertheid door milde stress-respons.', category: 'focus', duration: '30 sec' },
  { id: '26', title: 'Power Pose', situation: 'Voor een belangrijke presentatie of call', exercise: '1. Ga staan met je benen iets uit elkaar.\n2. Zet je handen stevig in je zij.\n3. Duw je borst vooruit en kin iets omhoog.\n4. Adem diep en krachtig in en uit.\n5. Houd deze houding 2 minuten vast.', effect: 'Verhoogt testosteron en verlaagt cortisol.', category: 'focus', duration: '2 min' },

  // Creatieve doorbraak
  { id: '27', title: 'Vrij Schrijven', situation: 'Bij een creatieve blokkade', exercise: '1. Pak pen en papier.\n2. Zet een timer voor 5 minuten.\n3. Schrijf alles op wat in je opkomt, zonder te stoppen.\n4. Maak je niet druk om spelling of logica.\n5. Blijf schrijven tot de timer gaat.', effect: 'Omzeilt de interne criticus.', category: 'creative', duration: '5 min' },
  { id: '28', title: 'Andere Hand Tekenen', situation: 'Om uit je vaste patronen te stappen', exercise: '1. Pak een vel papier en een pen.\n2. Neem de pen in je niet-dominante hand.\n3. Teken een simpel object (bijv. een huis of een boom).\n4. Focus op de ongemakkelijke maar bewuste beweging.', effect: 'Activeert nieuwe neurale paden.', category: 'creative', duration: '3 min' },
  { id: '29', title: 'Muziek Wissel', situation: 'Om je emotionele staat te veranderen', exercise: '1. Kies een nummer dat totaal anders is dan je huidige stemming.\n2. Luister met volledige aandacht.\n3. Probeer mee te bewegen of te neuriën.\n4. Merk op hoe je stemming verschuift.', effect: 'Triggert een snelle verschuiving in stemming.', category: 'creative', duration: '4 min' },
  { id: '30', title: 'Natuur Wandeling (Micro)', situation: 'Voor nieuwe inspiratie', exercise: '1. Ga bij een raam staan of loop naar een plant.\n2. Kijk 2 minuten lang met volledige aandacht naar de natuurlijke details.\n3. Observeer de kleuren, vormen en patronen.\n4. Adem de rust van de natuur in.', effect: 'Natuurlijke fractals kalmeren het brein.', category: 'creative', duration: '2 min' },
  { id: '31', title: 'Doodle Pauze', situation: 'Om je gedachten te laten dwalen', exercise: '1. Pak een stuk papier.\n2. Begin willekeurige lijnen en vormen te tekenen.\n3. Laat je hand vrij bewegen zonder plan.\n4. Adem diep in en uit terwijl je tekent.', effect: 'Bevordert "incubation" - het onbewust oplossen van problemen.', category: 'creative', duration: '5 min' },

  // Extra / Gemengd
  { id: '32', title: 'Zachte Aanraking', situation: 'Bij eenzaamheid of hardheid naar jezelf', exercise: '1. Ga rustig zitten.\n2. Begin met het zachtjes strijken over je ene onderarm met de handpalm van je andere hand.\n3. Doe dit heel langzaam en met volle aandacht.\n4. Wissel van arm.\n5. Je kunt ook zachtjes over je eigen wangen strijken.', effect: 'Vrijgave van oxytocine.', category: 'reset', duration: '1 min' },
  { id: '33', title: 'Humming', situation: 'Voor interne massage van de organen', exercise: '1. Adem diep in door je neus.\n2. Maak bij de uitademing een laag neuriënd geluid ("hmmmm").\n3. Focus op de trilling in je borstkas en keel.\n4. Probeer de uitademing zo lang mogelijk te maken.\n5. Herhaal dit 5 keer.', effect: 'Trilt de nervus vagus in de borstkas.', category: 'breath', duration: '2 min' },
  { id: '34', title: 'Object Focus', situation: 'Bij dissociatie', exercise: '1. Kies een willekeurig object in de kamer.\n2. Bekijk het object heel nauwkeurig.\n3. Benoem hardop 10 details (kleur, vorm, schaduw, textuur, etc.).\n4. Probeer het object te beschrijven alsof je het aan iemand uitlegt die het niet kan zien.', effect: 'Verankert je in de fysieke realiteit.', category: 'sensory', duration: '2 min' },
  { id: '35', title: 'Lachen zonder Reden', situation: 'Om endorfines aan te maken', exercise: '1. Begin met een glimlach, ook al voelt het nep.\n2. Maak een zacht lachgeluid ("ha-ha").\n3. Blijf dit doen en probeer het groter te maken.\n4. Vaak volgt er na een minuut een echte, spontane lach.\n5. Geniet van de ontspanning die daarna volgt.', effect: 'Fopt het brein om gelukshormonen aan te maken.', category: 'reset', duration: '1 min' },
];

export const STATE_OPTIONS = [
  { id: 'overwhelmed', label: 'Overprikkeld / Overweldigd', categories: ['reset', 'sensory'] },
  { id: 'anxious', label: 'Angstig / Onrustig', categories: ['breath', 'sensory'] },
  { id: 'frozen', label: 'Verdoofd / "Freeze"', categories: ['reset', 'focus'] },
  { id: 'angry', label: 'Gefrustreerd / Boos', categories: ['release', 'reset'] },
  { id: 'blocked', label: 'Geblokkeerd / Geen focus', categories: ['focus', 'creative'] },
  { id: 'tired', label: 'Moe / Futloos', categories: ['focus', 'breath'] }
];

export const ASSESSMENT_QUESTIONS = [
  {
    id: 'style',
    question: 'Hoe reageer je meestal op plotselinge stress of overweldiging?',
    options: [
      { label: 'Ik word kritisch, boos of wil de controle grijpen', state: 'fight' },
      { label: 'Ik wil wegvluchten, ga piekeren of word heel druk', state: 'flight' },
      { label: 'Ik klap dicht, voel me verdoofd of trek me terug', state: 'freeze' },
      { label: 'Ik ga pleasen, pas me aan en negeer mijn eigen grenzen', state: 'fawn' }
    ]
  },
  {
    id: 'stress',
    question: 'Hoe hoog is je basis-stressniveau de afgelopen week? (0 = zen, 10 = burn-out nabij)',
    options: [
      { label: '0 - 3: Rustig en beheersbaar', state: 'low' },
      { label: '4 - 7: Constant "aan", maar ik ga door', state: 'medium' },
      { label: '8 - 10: Overweldigd en uitgeput', state: 'high' }
    ]
  },
  {
    id: 'sensitivity',
    question: 'Hoe gevoelig ben je voor prikkels (geluid, licht, drukte)?',
    options: [
      { label: 'Niet echt, ik kan veel hebben', state: 'low' },
      { label: 'Gemiddeld, soms moet ik even opladen', state: 'medium' },
      { label: 'Heel gevoelig, ik raak snel overprikkeld', state: 'high' }
    ]
  },
  {
    id: 'recovery',
    question: 'Wat helpt jou het beste om weer tot rust te komen?',
    options: [
      { label: 'Fysieke beweging of sporten', state: 'active' },
      { label: 'Stilte, slapen of alleen zijn', state: 'passive' },
      { label: 'Praten met iemand of co-regulatie', state: 'social' }
    ]
  }
];

export const RESET_QUESTIONS = [
  {
    id: 'feeling',
    question: 'Hoe voelt je lichaam op dit moment?',
    options: [
      { label: 'Gespannen of gejaagd', state: 'tense', icon: '⚡' },
      { label: 'Moe of futloos', state: 'tired', icon: '☁️' },
      { label: 'Verdoofd of afwezig', state: 'numb', icon: '❄️' },
      { label: 'Onrustig in mijn hoofd', state: 'restless', icon: '🌀' }
    ]
  },
  {
    id: 'time',
    question: 'Hoeveel tijd heb je voor deze reset?',
    options: [
      { label: 'Slechts 1 minuut', state: '1min', icon: '⏱️' },
      { label: 'Ongeveer 5 minuten', state: '5min', icon: '🧘' },
      { label: '15 minuten of meer', state: '15min', icon: '🌿' }
    ]
  },
  {
    id: 'location',
    question: 'Waar bevind je je?',
    options: [
      { label: 'Thuis', state: 'home', icon: '🏠' },
      { label: 'Op het werk / Openbaar', state: 'public', icon: '🏢' },
      { label: 'Onderweg', state: 'transit', icon: '🚶' }
    ]
  }
];

export const MOOD_OPTIONS = [
  { id: 'calm', label: 'Rustig', icon: '🍃' },
  { id: 'anxious', label: 'Onrustig', icon: '🌀' },
  { id: 'energetic', label: 'Energiek', icon: '⚡' },
  { id: 'sad', label: 'Verdrietig', icon: '💧' },
  { id: 'frustrated', label: 'Gefrustreerd', icon: '🔥' },
  { id: 'tired', label: 'Moe', icon: '☁️' }
];

export const SLEEP_OPTIONS = [
  { id: 'great', label: 'Heerlijk geslapen', icon: '🌟' },
  { id: 'good', label: 'Goed geslapen', icon: '🌙' },
  { id: 'okay', label: 'Oké geslapen', icon: '🌗' },
  { id: 'bad', label: 'Slecht geslapen', icon: '🌑' },
  { id: 'restless', label: 'Onrustige nacht', icon: '🌪️' }
];

export const LOADING_MESSAGES = [
  "Adem in… je begeleiding vormt zich.",
  "Even landen — ik ben zo bij je.",
  "Rust aan. Je volgende stap komt eraan.",
  "Neem één zachte ademhaling… laden.",
  "Je zenuwstelsel eerst. Daarna de woorden.",
  "Ik stem af op wat je lijf nodig heeft…",
  "Hold on — we bouwen dit antwoord veilig op.",
  "Kleine pauze. Groot effect.",
  "Je bent niet te laat. Je bent aan het herkalibreren.",
  "Eerst veiligheid, dan strategie."
];

export const GUIDE_MYTHS = [
  {
    myth: "Stress is altijd slecht voor je.",
    fact: "Kortstondige stress (eustress) helpt je groeien en alert te blijven. Het probleem is chronische stress zonder herstel.",
    icon: "⚠️"
  },
  {
    myth: "Je kunt je zenuwstelsel 'fixen'.",
    fact: "Je zenuwstelsel is niet kapot, het is over-beschermend. We leren het niet te 'fixen', maar te reguleren en veerkrachtiger te maken.",
    icon: "🛠️"
  },
  {
    myth: "Meditatie is de enige manier om te kalmeren.",
    fact: "Voor sommigen (vooral in 'Freeze') kan stilzitten juist stressvol zijn. Beweging, neuriën of koud water zijn vaak effectiever.",
    icon: "🧘"
  }
];

export const GUIDE_TRIGGERS = [
  {
    state: 'safe',
    title: 'Veilig & Verbonden',
    color: 'Groen',
    description: 'Je voelt je rustig, sociaal en nieuwsgierig. Je lichaam is in \'rust en herstel\' modus.',
    triggers: ['Sociale steun', 'Veilige omgeving', 'Diepe ademhaling', 'Lachen'],
    antidote: 'Geniet van dit moment en deel het met anderen.',
    exercise: 'Dankbaarheid: Benoem 3 dingen waar je nu dankbaar voor bent.'
  },
  {
    state: 'fight',
    title: 'Vechten of Vluchten',
    color: 'Oranje',
    description: 'Je voelt onrust, irritatie of angst. Je lichaam bereidt zich voor op actie door adrenaline aan te maken.',
    triggers: ['Onrechtvaardigheid', 'Grensoverschrijding', 'Niet gehoord worden', 'Tijdgebrek'],
    antidote: 'Fysieke ontlading & grenzen stellen',
    exercise: 'Muur Duwen: Duw 10 seconden zo hard mogelijk tegen een muur en laat de spanning dan heel langzaam en gecontroleerd los (niet plotseling loslaten).'
  },
  {
    state: 'freeze',
    title: 'Bevriezen (Freeze)',
    color: 'Blauw',
    description: 'Je voelt je verdoofd, afwezig of zwaar. Je systeem "schakelt uit" omdat de stress te groot is.',
    triggers: ['Extreme overweldiging', 'Trauma-herinneringen', 'Gevoel van machteloosheid'],
    antidote: 'Zachte beweging & warmte',
    exercise: 'Zachte Aanraking: Strijk langzaam over je onderarmen om weer in je lijf te komen.'
  }
];

export const VAGUS_EXERCISES = [
  {
    title: "De Ooroefening",
    description: "Masseer zachtjes de binnenkant van je oorschelp. Hier lopen takken van de Nervus Vagus die direct een kalmeringssignaal naar je hersenen sturen.",
    duration: "1-2 min"
  },
  {
    title: "Koud Water Prikkel",
    description: "Spat koud water in je gezicht of houd je polsen onder de koude kraan. Dit triggert de 'duikreflex' en activeert de Vagus rem.",
    duration: "30 sec"
  },
  {
    title: "Salamander Oefening",
    description: "Houd je hoofd recht en beweeg alleen je ogen zo ver mogelijk naar rechts. Houd vast tot je gaapt of slikt. Herhaal naar links.",
    duration: "1 min"
  }
];

export const INNER_WORK_PROMPTS: any = {
  journal: {
    fight: [
      "Waar probeer ik op dit moment controle over te houden, en wat zou er gebeuren als ik die controle loslaat?",
      "Wat is de onderliggende angst die mijn boosheid of kritiek voedt?",
      "Hoe kan ik vandaag zachter zijn voor mezelf in plaats van te vechten?",
      "Welke onvervulde behoefte schreeuwt om aandacht achter mijn frustratie?"
    ],
    flight: [
      "Waar ren ik op dit moment voor weg in mijn gedachten of acties?",
      "Als ik nu 5 minuten stil zou zitten zonder afleiding, wat zou ik dan voelen?",
      "Wat is de kleinste stap die ik kan zetten zonder overweldigd te raken?",
      "Hoe ziet 'veiligheid' eruit voor mij op dit moment, zonder dat ik iets hoef te doen?"
    ],
    freeze: [
      "Wat voelt er op dit moment 'bevroren' in mijn lichaam of leven?",
      "Als mijn verdoving een stem had, wat zou die dan zeggen?",
      "Welke kleine beweging of actie kan ik nu doen om weer contact te maken met de wereld?",
      "Wat heb ik nodig om me veilig genoeg te voelen om weer te 'ontdooien'?"
    ],
    fawn: [
      "Wiens goedkeuring zoek ik op dit moment, en ten koste van welke eigen grens?",
      "Waar heb ik vandaag 'ja' gezegd terwijl mijn hele lijf 'nee' riep?",
      "Wat zou ik zeggen als ik wist dat de ander niet boos zou worden?",
      "Hoe kan ik vandaag een klein beetje meer trouw zijn aan mezelf?"
    ],
    default: [
      "Wat is iets dat ik vandaag over mezelf heb geleerd?",
      "Welke emotie voel ik het sterkst op dit moment en waar komt het vandaan?",
      "Wat zou ik tegen mijn jongere zelf zeggen als ik nu de kans had?",
      "Welke grens heb ik onlangs gesteld (of had ik moeten stellen)?",
      "Waar ben ik op dit moment het meest dankbaar voor in mijn leven?",
      "Wat is een kleine overwinning die ik vandaag heb behaald?",
      "Welke gewoonte dient mij niet langer en wat zou ik daarvoor in de plaats willen?",
      "Hoe kan ik vandaag 1% meer rust in mijn dag bouwen?"
    ]
  },
  shadow: {
    fight: {
      title: "De Spiegel van Projectie",
      exercise: "Denk aan iemand die je onlangs heeft geïrriteerd door hun 'arrogantie' of 'dominantie'. Welke kracht in hen onderdruk jij in jezelf omdat je bang bent om 'te veel' te zijn?",
      insight: "Boosheid is vaak een beschermer van een gekwetst deel."
    },
    flight: {
      title: "De Onrust Ontmaskerd",
      exercise: "Welke ongemakkelijke waarheid probeer je te ontwijken door constant bezig te blijven of vooruit te plannen?",
      insight: "Bezigheid is soms een vorm van verdoving."
    },
    freeze: {
      title: "Stem geven aan de Stilte",
      exercise: "Stel je voor dat de muur om je heen een beschermende functie heeft. Waar beschermt deze muur je op dit moment tegen? Bedank de muur en vraag wat er nodig is voor een kleine kier.",
      insight: "Freeze is een intelligente overlevingsstrategie, geen zwakte."
    },
    fawn: {
      title: "De Pleaser-Schaduw",
      exercise: "Wie ben je als je niemand hoeft te pleasen? Schrijf op welke delen van je persoonlijkheid je 'verstopt' om geaccepteerd te worden.",
      insight: "Aanpassing is een oude manier om veiligheid te kopen."
    },
    default: {
      title: "De Spiegel",
      exercise: "Denk aan iemand die je onlangs heeft geïrriteerd. Welke eigenschap in hen triggerde je? Vraag jezelf af: 'In welke situaties vertoon ik (misschien subtiel) ditzelfde gedrag?'",
      insight: "Shadow work gaat over het integreren van alle delen van wie je bent.",
      variations: [
        "Welke eigenschap bewonder je enorm in anderen, maar durf je zelf niet te claimen?",
        "Wat is een geheim dat je over jezelf bewaart omdat je bang bent voor oordeel?",
        "In welke situaties voel je je 'kleiner' dan anderen, en wat zegt dat over je zelfbeeld?"
      ]
    }
  },
  compassion: {
    fight: {
      title: "Zachtheid voor de Strijder",
      exercise: "Leg je handen op je hart. Zeg tegen jezelf: 'Ik zie hoe hard je werkt om alles veilig te houden. Het is oké om nu even de wapens neer te leggen. Je bent veilig.'",
      icon: "🛡️"
    },
    flight: {
      title: "Landen in Liefde",
      exercise: "Stel je voor dat je een anker uitwerpt in een oceaan van compassie. Je hoeft nergens heen. Alles wat je zoekt is al hier, in dit moment.",
      icon: "⚓"
    },
    freeze: {
      title: "Warmte voor de Kou",
      exercise: "Stel je voor dat je een warme deken om je bevroren delen slaat. Je hoeft niet te veranderen of te bewegen. Alleen de warmte voelen is genoeg.",
      icon: "🔥"
    },
    fawn: {
      title: "Trouw aan de Bron",
      exercise: "Kijk in de spiegel en zeg: 'Ik ben het waard om van te houden, ook als ik niet nuttig ben voor anderen. Mijn behoeften doen er toe.'",
      icon: "💎"
    },
    default: {
      title: "De Liefdevolle Brief",
      exercise: "Schrijf een korte brief aan jezelf vanuit het perspectief van iemand die onvoorwaardelijk van je houdt. Wat zouden zij zeggen over de uitdagingen waar je nu voor staat?",
      icon: "❤️",
      variations: [
        "Adem in en zeg bij de uitademing: 'Ik mag er zijn, precies zoals ik nu ben.'",
        "Bedenk drie dingen die je vandaag goed hebt gedaan, hoe klein ook.",
        "Geef jezelf een zachte knuffel en voel de warmte van je eigen aanraking."
      ]
    }
  }
};
