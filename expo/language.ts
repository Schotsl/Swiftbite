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
    },
    meal: {
      single: "Maaltijd",
      plural: "Maaltijden",
      loading: "We zijn je maaltijd aan het laden uit onze database",
      explanation: `Een maaltijd is een combinatie van producten die je opslaat om later in één keer toe te voegen.`,
      inputTitle: "Titel",
      inputTitlePlaceholder: "Spicy volkorennoedels",
    },
    repeat: {
      single: "Herhaling",
      plural: "Herhalen",
      loading: "We zijn je maaltijd aan het laden uit onze database",
      explanation: `Een herhaling is een product dat automatisch toevoegt wordt op de dagen en tijden die jij kiest`,
      inputRepeatTime: "Herhalen om",
      inputRepeatDate: "Herhalen op",
    },
    basic: {
      single: "Basisitem",
      plural: "Basisitems",
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
        return `Je hebt ${count} entries geregistreerd`;
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
    weight: "Je hebt nog geen gewicht aan je account toegevoegd",

    getAdded: (type: string) => {
      return `Je hebt nog geen ${type} toegevoegd`;
    },
    getSelected: (type: string) => {
      return `Je hebt nog geen ${type} geselecteerd`;
    },
  },
  search: {
    results: {
      overloaded: "😲 Je hebt je dagelijkse zoek limiet overschreden",

      getDefault: (type: string) => {
        return `🥳 Start met zoeken naar ${type} door minimaal 4 letters te typen en druk op enter`;
      },
      getEmpty: (type: string) => {
        return `😔 We hebben geen ${type} gevonden met deze naam`;
      },
      getError: (type: string) => {
        return `😔 Er is iets mis gegaan tijdens het zoeken naar ${type}`;
      },
      getLoading: (type: string) => {
        return `🕵️ We zijn het hele internet aan het zoeken naar ${type}`;
      },
    },
    favorite: {
      getTitle: (type: string) => {
        return `Mijn favoriete ${type}`;
      },
      getEmpty: (type: string) => {
        return `Je hebt nog geen ${type} als favoriet toegevoegd`;
      },
    },
    manual: {
      getTitle: (type: string) => {
        return `Zelf toegevoegde ${type}`;
      },
      getEmpty: (type: string) => {
        return `Je hebt nog geen ${type} zelf toegevoegd`;
      },
    },
    often: {
      getTitle: (type: string) => {
        return `Vaak gebruikte ${type}`;
      },
      getEmpty: (type: string) => {
        return `Je hebt nog geen ${type} zelf toegevoegd`;
      },
    },
    recent: {
      getTitle: (type: string) => {
        return `Recent gebruikte ${type}`;
      },
      getEmpty: (type: string) => {
        return `Je hebt nog geen ${type} gebruikt`;
      },
    },
  },
};
