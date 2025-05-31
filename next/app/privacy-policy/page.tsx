import Image from "next/image";

export default function PrivacyPolicy() {
  return (
    <main>
      <Image
        src="/images/icon.png"
        alt="Swiftbite Icon"
        width={120}
        height={120}
      />

      <h1>Privacyverklaring Swiftbite</h1>
      <i>Laatste update 31 mei 2025</i>

      <p>
        Ik, Sjors van Holst, bouw en beheer de app Swiftbite. In deze verklaring
        lees je welke persoonsgegevens ik verzamel, waarom ik dat doe en welke
        rechten je hebt.
      </p>

      <h2>1. Welke gegevens verzamel ik</h2>
      <p>
        Bij registratie vraag ik om je voornaam, achternaam, e-mailadres,
        geboortedatum, geslacht, lengte en gewicht.
      </p>
      <p>
        De app leest lengte en gewicht uit Apple Health en schrijft je gegeten
        calorieën en macro&apos;s terug naar Apple Health.
      </p>
      <p>
        Ik sla je ingestelde taal en het land waar je je bevindt op zodat de app
        goed werkt.
      </p>

      <h2>2. Waarom verwerk ik deze gegevens</h2>
      <ul>
        <li>Om je voeding en doelen bij te houden</li>
        <li>Om statistieken in de app te tonen</li>
        <li>Om de koppeling met Apple Health mogelijk te maken</li>
        <li>Om fouten op te sporen en de app te verbeteren</li>
      </ul>

      <h2>3. Waar sla ik je gegevens op</h2>
      <p>
        Alle data staat in Supabase in het datacenter eu-central-1. De
        verbinding is altijd beveiligd met HTTPS.
      </p>

      <h2>4. Hoe lang bewaar ik je gegevens</h2>
      <p>Verwijder je je account dan wis ik je gegevens direct.</p>

      <h2>5. Delen met derden</h2>
      <p>
        Ik deel geen persoonlijke data met andere partijen. Alleen twee diensten
        krijgen beperkte toegang:
      </p>
      <ul>
        <li>Sentry voor foutmeldingen</li>
        <li>
          Mijn zelf gehoste Plausible-instantie voor anonieme statistieken
        </li>
      </ul>
      <p>Voor aanmelden gebruik ik Login with Apple.</p>

      <h2>6. Rechten van gebruikers</h2>
      <p>
        Je kunt in de app je gegevens bekijken en je voedingsgeschiedenis
        exporteren. Je kunt je account op elk moment verwijderen. Daarna is je
        data weg.
      </p>

      <h2>7. Beveiliging</h2>
      <p>
        Ik pas technische en organisatorische maatregelen toe zoals versleutelde
        verbindingen en strikt toegangsbeheer.
      </p>

      <h2>8. Contact</h2>
      <p>
        Heb je vragen over privacy of wil je een verzoek indienen? Mail dan naar
        swiftbite@sjorsvanholst.nl
      </p>
    </main>
  );
}
