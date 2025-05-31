import Image from "next/image";

export default function ENPrivacyPolicy() {
  return (
    <main>
      <Image
        src="/images/icon.png"
        alt="Swiftbite Icon"
        width={120}
        height={120}
      />
      <h1>Swiftbite Privacy Statement</h1>
      <i>Last updated May 31, 2025</i>

      <p>
        I, Sjors van Holst, build and manage the Swiftbite app. In this
        statement, you will read which personal data I collect, why I do it, and
        what your rights are.
      </p>

      <h2>1. What data do I collect</h2>
      <p>
        Upon registration, I ask for your first name, last name, email address,
        date of birth, gender, height, and weight.
      </p>
      <p>
        The app reads height and weight from Apple Health and writes your
        consumed calories and macros back to Apple Health.
      </p>
      <p>
        I store your set language and the country where you are located so that
        the app works correctly.
      </p>

      <h2>2. Why do I process this data</h2>
      <ul>
        <li>To track your nutrition and goals</li>
        <li>To display statistics in the app</li>
        <li>To enable the connection with Apple Health</li>
        <li>To detect errors and improve the app</li>
      </ul>

      <h2>3. Where do I store your data</h2>
      <p>
        All data is stored in Supabase in the eu-central-1 datacenter. The
        connection is always secured with HTTPS.
      </p>

      <h2>4. How long do I keep your data</h2>
      <p>If you delete your account, I will delete your data immediately.</p>

      <h2>5. Sharing with third parties</h2>
      <p>
        I do not share personal data with other parties. Only two services
        receive limited access:
      </p>
      <ul>
        <li>Sentry for error messages</li>
        <li>My self-hosted Plausible instance for anonymous statistics</li>
      </ul>
      <p>For signing up, I use Login with Apple.</p>

      <h2>6. User rights</h2>
      <p>
        In the app, you can view your data and export your nutrition history.
        You can delete your account at any time. After that, your data will be
        gone.
      </p>

      <h2>7. Security</h2>
      <p>
        I apply technical and organizational measures such as encrypted
        connections and strict access control.
      </p>

      <h2>8. Contact</h2>
      <p>
        Do you have questions about privacy or want to submit a request? Email
        swiftbite@sjorsvanholst.nl
      </p>
    </main>
  );
}
