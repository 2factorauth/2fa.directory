import {html} from 'htm/preact';

export default function Head() {
  return html`
    <head>
      <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>

      <meta name="description" content="List of sites with two factor auth support which includes SMS, email, phone calls, hardware, and software."/>
      <meta name="copyright" content="2factorauth"/>

      <meta name="og:description" content="List of sites with two factor auth support which includes SMS, email, phone calls, hardware, and software."/>
      <meta name="og:image" content="/icons/social-card.png"/>
      <meta name="og:title" content="2FA Directory"/>
      <meta name="og:type" content="website"/>
      <meta name="twitter:site" content="@2faorg"/>
      <meta name="twitter:card" content="summary_large_image"/>

      <link rel="me" href="https://infosec.exchange/@2factorauth"/>

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.2/css/bootstrap.min.css" integrity="sha512-CpIKUSyh9QX2+zSdfGP+eWLx23C8Dj9/XmHjZY2uDtfkdLGo0uY12jgcnkX9vXOgYajEKb/jiw67EYm+kBf+6g==" crossorigin="anonymous" referrerpolicy="no-referrer"/>
      <link rel="preload" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400..500,1,0&display=block&icon_names=account_balance,book_4,campaign,captive_portal,chat_bubble,checklist,cloud,code,crowdsource,currency_bitcoin,ecg_heart,electric_bolt,finance,finance_mode,flights_and_hotels,gavel,group,hard_drive,id_card,language,mail,markunread_mailbox,more_horiz,palette,payments,play_circle,restaurant,router,school,shield_lock,shopping_cart,sports_esports,storage,support,sync_desktop,theater_comedy,transportation,trophy,vpn_lock,wallet" as="style" onload="this.onload=null;this.rel='stylesheet'" />
      <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/flag-icons/7.2.3/css/flag-icons.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'" integrity="sha512-bZBu2H0+FGFz/stDN/L0k8J0G8qVsAL0ht1qg5kTwtAheiXwiRKyCq1frwfbSFSJN3jooR5kauE0YjtPzhZtJQ==" crossorigin="anonymous" referrerpolicy="no-referrer"/>
      <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" sizes="any"/>
      <link rel="manifest" href="/manifest.json"/>

      <title>2FA Directory</title>
    </head>`;
}
