export default {
  days: {
    today: "Vandaag",
    tomorrow: "Morgen",
    tomorrowAfter: "Overmorgen",
    yesterday: "Gisteren",
    yesterdayBefore: "Eergisteren",

    getFuture: (days: number) => {
      return `Over ${days} dagen`;
    },
    getPast: (days: number) => {
      return `${days} dagen geleden`;
    },
  },
  weekdays: {
    monday: "Maandag",
    tuesday: "Dinsdag",
    wednesday: "Woensdag",
    thursday: "Donderdag",
    friday: "Vrijdag",
    saturday: "Zaterdag",
    sunday: "Zondag",
  },
  burned: "Verbrand",
  consumed: "Verbruikt",
  remaining: "Resterend",
  macros: {
    calories: {
      long: "Calorieën",
      short: "kcal",
    },
    fats: {
      long: "Vetten",
      short: "Vetten",
      explanation:
        "Langzame energiebron die hormonen en vitamine­opname ondersteunt. Komt uit onder andere avocado, noten en olijfolie",
    },
    carbs: {
      long: "Carbs",
      short: "Carbs",
      explanation:
        "Snelle brandstof voor spieren en hersenen. Handig vóór of tijdens inspanning, te vinden in brood, fruit en rijst",
    },
    protein: {
      long: "Eiwitten",
      short: "Eiwitten",
      explanation:
        "Bouwstenen voor spierherstel en -groei en houden je langer verzadigd. Komt uit yoghurt, peulvruchten, vlees en vis",
    },
    button: "Macro's wijzigen",
  },
  navigation: {
    tabs: {
      dairy: "Dagboek",
      personal: "Instellingen",
      statistics: "Statistieken",
      automations: "Automaties",
    },
    add: {
      camera: "Camera",
      search: "Zoeken",
      estimation: "Inschatting",
    },
  },
  time: {
    night: "Nacht",
    evening: "Avond",
    morning: "Ochtend",
    afternoon: "Middag",
  },
  types: {
    ingredient: {
      single: "Ingrediënt",
      plural: "Ingrediënten",
      getCount: (count: number) => {
        const suffix = count === 1 ? "ingrediënt" : "ingrediënten";

        return `${count} ${suffix}`;
      },
    },
    product: {
      single: "Product",
      plural: "Producten",
      loading: "We zijn het product in onze database aan het zoeken",
    },
    meal: {
      single: "Maaltijd",
      plural: "Maaltijden",
      loading: "We zijn je maaltijd aan het laden uit onze database",
      loadingPlural: "We zijn je maaltijden aan het laden uit onze database",
      explanation: `Een maaltijd is een combinatie van producten die je opslaat om later in één keer toe te voegen.`,
      inputTitle: "Titel",
      inputTitlePlaceholder: "Spicy volkorennoedels",
    },
    repeat: {
      single: "Herhaling",
      plural: "Herhalingen",
      loading: "We zijn je herhaling aan het laden uit onze database",
      explanation: `Een herhaling is een product dat automatisch toevoegt wordt op de dagen en tijden die jij kiest`,
      inputRepeatTime: "Herhalen om",
      inputRepeatDate: "Herhalen op",
    },
    basic: {
      single: "Basisitem",
      plural: "Basisitems",
    },
    estimation: {
      single: "Inschatting",
      plural: "Inschattingen",
      loading: "We zijn je inschatting aan het laden uit onze database",
    },
  },
  measurement: {
    metric: {
      weight: "kg",
      distance: "cm",
    },
    imperial: {
      weight: "lbs",
      distance: "in",
    },
  },
  input: {
    optional: "optioneel",
    weight: {
      add: "Gewicht toevoegen",
      empty: "Je hebt nog geen gewicht aan je account toegevoegd",
      button: "Gewicht opslaan",
    },
  },
  page: {
    camera: {
      options: {
        label: "Voedingslabel",
        barcode: "Barcode",
        estimation: "Inschatting",
      },
    },
    stats: {
      empty:
        "Deze pagina is nog in ontwikkeling, we zien je later graag terug!",
    },
    personal: {
      getSubtitle: (count: number) => {
        return count === 0
          ? "Je hebt nog geen logs toegevoegd"
          : `Je hebt ${count} logs geregistreerd`;
      },
      details: {
        title: "Mijn gegevens",
        short: "Wijzig gegevens zoals voornaam, achternaam, etc.",
        input: {
          email: "E-mail",
          emailPlaceholder: "johndoe@example.com",
          emailContent: `Je kunt je e-mail niet wijzigen via dit formulier. Stuur een bericht naar swiftbite@sjorsvanholst.nl voor wijziging.`,
          firstName: "Voornaam",
          firstNamePlaceholder: "John",
          lastName: "Achternaam",
          lastNamePlaceholder: "Doe",
          birth: "Geboortedatum",
        },
        button: "Gegevens wijzigen",
        loading: "We zijn je gegevens aan het laden uit onze database",
      },
      health: {
        title: "Mijn gezondheid",
        short: "Lichaamsmetingen en -geschiedenis, zoals gewicht en lengte.",
        input: {
          weight: "Gewicht",
          height: "Lengte",
        },
        button: "Gegevens wijzigen",
        loading: "We zijn je gezondheid aan het laden uit onze database",
      },
      preferences: {
        title: "Mijn voorkeur",
        short: "Verander taal, meetsysteem en andere instellingen.",
        input: {
          language: "Taal",
          languagePlaceholder: "Nederlands",
          system: "Meetsysteem",
          systemMetric: "Metrisch systeem",
          systemImperial: "Imperial systeem",
          systemPlaceholder: "Metric",
        },
        loading: "We zijn je voorkeuren aan het laden uit onze database",
        button: "Voorkeuren wijzigen",
      },
      password: {
        title: "Verander je wachtwoord",
        short: "Verander je accountwachtwoord.",
        input: {
          password: "Wachtwoord",
          passwordPlaceholder: "********",
          newPassword: "Nieuw wachtwoord",
          newPasswordPlaceholder: "********",
          confirmPassword: "Bevestig wachtwoord",
          confirmPasswordIncorrect: "Je wachtwoord is incorrect",
          confirmPasswordPlaceholder: "********",
        },
        button: "Wachtwoord wijzigen",
      },
      goals: {
        title: "Verander je doel",
        short: "Verander je calorieën of macrodoelen.",
        input: {
          calories: "Calorieën",
          caloriesPlaceholder: "2000",
          macros: "Je macronutriënten",
        },
        button: "Doelen wijzigen",
        loading: "We zijn je doelen aan het laden uit onze database",
      },
      export: {
        title: "Exporteer gegevens",
        short: "Exporteer je dieetdata om te delen met een voedingscoach.",
        button: "Exporteer gegevens",
        content: `Klik op 'Exporteer gegevens' en ontvang binnen enkele minuten een e-mail met een CSV-bestand van al je voedingsdata.`,
        alert: {
          title: "Dit is helaas nog niet mogelijk",
          content: `De exporteer functie is onderweg, maar nog niet klaar. We werken hard aan deze en andere functionaliteiten.`,
        },
      },
      delete: {
        title: "Verwijder je account",
        short: "Verwijder je account definitief.",
        input: {
          password: "Wachtwoord",
          passwordContent: `Vul hieronder je wachtwoord in om je account te definitief verwijderen.`,
          passwordIncorrect: "Je wachtwoord is incorrect",
          passwordPlaceholder: "********",
        },
        alert: {
          title: "Weet je zeker dat je je account wilt verwijderen?",
          content: `Dit kan niet worden teruggedraaid.`,
        },
        button: "Account verwijderen",
        content: `Je account verwijderen wist al je gegevens voorgoed. Dit kan niet worden teruggedraaid. Vul je wachtwoord in om te bevestigen.`,
      },
      signout: {
        title: "Afmelden",
        short: "Afmelden van je account.",
      },
    },
  },
  modifications: {
    pick: "kiezen",
    save: "opslaan",
    edit: "bewerken",
    cancel: "annuleren",
    insert: "toevoegen",
    delete: "verwijderen",

    uppercase: {
      pick: "Kiezen",
      save: "Opslaan",
      edit: "Bewerken",
      cancel: "Annuleren",
      insert: "Toevoegen",
      delete: "Verwijderen",
    },

    getPick: (type: string) => {
      return `${type} kiezen`;
    },
    getSave: (type: string) => {
      return `${type} opslaan`;
    },
    getEdit: (type: string) => {
      return `${type} wijzigen`;
    },
    getInsert: (type: string) => {
      return `${type} toevoegen`;
    },
    getDelete: (type: string) => {
      return `${type} verwijderen`;
    },
  },
  empty: {
    meal: "Je hebt nog geen maaltijden aan je account toegevoegd",
    weight: "Je hebt nog geen gewicht aan je account toegevoegd",

    getAdded: (type: string) => {
      return `Je hebt nog geen ${type.toLowerCase()} toegevoegd`;
    },
    getSelected: (type: string) => {
      return `Je hebt nog geen ${type.toLowerCase()} geselecteerd`;
    },
  },
  search: {
    explanation: {
      meal: `Maaltijden zijn samengestelde combinaties van producten of basisitems, zoals een “Caesarsalade”`,
      basic: `Basisitems zijn merkloze, algemene items zoals “Banaan” of “Broodje pulled chicken met coleslaw”`,
      product: `Producten zijn merkartikelen, zoals “Coca-Cola Zero”, die altijd naar een exact merk en smaak verwijzen`,
    },
    results: {
      overloaded: "Je hebt je dagelijkse zoek limiet overschreden",

      getDefault: (type: string) => {
        return `Start met zoeken naar ${type.toLowerCase()} door minimaal 4 letters te typen en druk op enter`;
      },
      getEmpty: (type: string) => {
        return `We hebben geen helaas ${type.toLowerCase()} gevonden met deze naam`;
      },
      getAdvice: (type: string) => {
        return `Onze AI zoekt de ${type.toLowerCase()} voor je, hoe specifieker je zoekt, hoe beter de resultaten`;
      },
      getError: (type: string) => {
        return `Er is iets mis gegaan tijdens het zoeken naar ${type.toLowerCase()}`;
      },
      getLoading: (type: string) => {
        return `We zijn het hele internet aan het zoeken naar ${type.toLowerCase()}`;
      },
    },
    favorite: {
      getTitle: (type: string) => {
        return `Mijn favoriete ${type.toLowerCase()}`;
      },
      getEmpty: (type: string) => {
        return `Je hebt nog geen ${type.toLowerCase()} als favoriet toegevoegd`;
      },
    },
    manual: {
      getTitle: (type: string) => {
        return `Zelf toegevoegde ${type.toLowerCase()}`;
      },
      getEmpty: (type: string) => {
        return `Je hebt nog geen ${type.toLowerCase()} zelf toegevoegd`;
      },
    },
    often: {
      getTitle: (type: string) => {
        return `Vaak gebruikte ${type.toLowerCase()}`;
      },
      getEmpty: (type: string) => {
        return `Je hebt nog geen ${type.toLowerCase()} zelf toegevoegd`;
      },
    },
    recent: {
      getTitle: (type: string) => {
        return `Recent gebruikte ${type.toLowerCase()}`;
      },
      getEmpty: (type: string) => {
        return `Je hebt nog geen ${type.toLowerCase()} gebruikt`;
      },
    },
  },
  functions: {
    getJoin: (parts: string[]) => {
      const partsLowered = parts.map((part) => part.toLowerCase());
      const partsJoined = partsLowered.join(", ");
      const partsAnd = partsJoined.replace(/,([^,]*)$/, " en$1");

      return partsAnd;
    },
  },
};
