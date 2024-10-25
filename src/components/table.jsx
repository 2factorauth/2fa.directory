import {useEffect, useState} from 'preact/hooks';
import {Modal, Popover} from 'bootstrap';
import {API_URL, IMG_PATH} from '../constants.js';

const method_names = {
  'sms': 'SMS',
  'email': 'Email',
  'call': 'Phone Calls',
  'totp': 'TOTP',
  'u2f': 'Passkeys',
};

function Table({Category, Title, search, grid}) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (!search) {
      const region = window.location.pathname.slice(1);
      fetch(`${API_URL}/${region || 'int/'}${Category}.json`,
        { cache: 'force-cache' }).
        then(res => res.json()).
        then(data => setEntries(Object.entries(data).sort() || [])).
        catch(err => console.error('Error fetching categories:', err));  // Add error handling
    } else setEntries(search);

    // Scroll to category button
    window.location.hash = `#${Category}`;
    document.getElementById(Category)?.
      scrollIntoView({behavior: 'smooth', block: 'start'});
  }, []);

  return (
    <div
      className="table collapse show"
      role="region"
      aria-selected="true"
      style={`grid-area: ${grid};`} // First in is table y position
    >
      <div aria-hidden="true" className="table-head">
        <div>{Title}</div>
        <div>Docs</div>
        <div>SMS</div>
        <div>Phone Calls</div>
        <div>Email</div>
        <div>Hardware</div>
        <div>Software</div>
      </div>
      {entries.map(([name, data]) => (
        <Entry name={name} data={data} />
      ))}
    </div>
  );
}

function Entry({ name, data }) {
  const color = data.methods !== undefined ? 'green' : 'red';
  return (
    <div className={'entry ' + color} role="article" data-domain={data.domain}>
      <div className="title">
        <a className="name" href={data.url ? data.url : `https://${data.domain}`} title={name}>
          <Icon entry={data} />
          {name}
        </a>

        {data.notes && <i class="note bi bi-exclamation-diamond-fill" tabindex={0} data-bs-toggle="popover" data-bs-content={data.notes}></i>}
      </div>

      {color === 'green' ?
        <>
          <div className="docs">
            {data.documentation && <a aria-label="documentation" className="website-doc" href={data.documentation} />}
            {data.recovery && <a aria-label="recovery documentation" className="recovery-doc" href={data.recovery} />}
          </div>

          <Methods methods={data.methods} customSoftware={data["custom-software"]} customHardware={data["custom-hardware"]} />
        </> :
        <Contact contact={data.contact} />
      }

    </div>
  );
}

function Methods({ methods, customSoftware, customHardware }) {
  useEffect(() => {
    [...document.querySelectorAll('.note')].map((el) => new Popover(el, {
      trigger: 'hover focus',
      title: 'Exceptions & Restrictions'
    }));


    [...document.querySelectorAll('.custom-hardware-popover')].map((el) => new Popover(el, {
      ...mfaPopoverConfig,
      title: 'Custom Hardware 2FA'
    }));

    [...document.querySelectorAll('.custom-software-popover')].map((el) => new Popover(el, {
      ...mfaPopoverConfig,
      title: 'Custom Software 2FA'
    }));
  }, []);


  return (
    <>
      <ul className="tfa-summary" aria-label="Supported 2FA Methods">
        {methods && methods.filter((method) => !method.includes('custom')).
          map((method) => <li>{method_names[method]}</li>)}
        {methods?.includes("custom-hardware") && <li>Custom Hardware: {customHardware.join(", ")}</li>}
        {methods?.includes("custom-software") && <li>Custom Software: {customSoftware.join(", ")}</li>}
      </ul>
      <div aria-hidden="true" className={`sms method ${methods?.includes('sms') ?
        'used' :
        ''}`}></div>
      <div aria-hidden="true" className={`voice method ${methods?.includes('call') ?
        'used' :
        ''}`}></div>
      <div aria-hidden="true" className={`email method ${methods?.includes('email') ?
        'used' :
        ''}`}></div>
      <div aria-hidden="true" className={`hardware method ${methods?.includes('u2f') ?
        'used' :
        ''}`}>
        {methods?.includes("custom-hardware") && <CustomMethods type="hardware" methods={customHardware} />}
      </div>
      <div aria-hidden="true" className={`software method ${methods?.includes('totp') ?
        'used' :
        ''}`}>
        {methods?.includes("custom-software") && <CustomMethods type="software" methods={customSoftware} />}
      </div>
    </>
  );
}

/**
 * Show custom methods
 *
 * @param {Object} props - The props for this compoennt
 * @param {("software"|"hardware")} props.type - The type of custom methods
 * @param {string[]} props.methods - The custom methods
 */
function CustomMethods({ type, methods }) {
  return methods.length !== 0 ?
    <i class={`bi bi-info-circle custom-${type}-popover`} data-bs-content={methods.map((method) => `<li>${method}</li>`).join("")} data-bs-toggle="popover"></i>
    : <i class="bi bi-info-circle" title={`Requires proprietary ${type === "hardware" ? "hardware token" : "app/software"}`}></i>;
}

// Intialize popovers
const mfaPopoverConfig = {
  html: true,
  sanitize: false,
  trigger: "hover focus"
};

// Social Media Notices
/**
 * Alert the user to the privacy implications of posting on social media.
 *
 * @param {("tweet"|"facebook"|"email")} type - The type of social media
 * @param {string} lang - An ISO 639-1 language code
 * @param {string} handle - The social media handle
 */
function socialMediaNotice(type, lang, handle) {
  const uri = `/contact/?type=${type}&lang=${lang}&handle=${handle}`;
  if (window.localStorage.getItem('social-media-notice') !== 'hidden') {
    const modal = new Modal('#social-media-warn');
    document.getElementById('social-media-accept').setAttribute('data-url', uri);
    modal.toggle();
  } else {
    window.open(uri, '_blank');
  }
}

document.getElementById("social-media-warn").addEventListener("hide.bs.modal", () => {
  window.localStorage.setItem('social-media-notice', 'hidden');
  window.open(
    document.getElementById('social-media-accept').getAttribute('data-url'), "_blank"
  );
})

function Contact({ contact }) {
  const lang = contact.language || "en";
  return (
    <div aria-label="2FA not supported" className="contact">
      {contact.twitter && (<button className="contact-btn twitter" onClick={() => socialMediaNotice("tweet", lang, contact.twitter)}></button>)}
      {contact.facebook && (<button className="contact-btn facebook" onClick={() => socialMediaNotice("facebook", lang, contact.twitter)}></button>)}
      {contact.email && (<button className="contact-btn email" onClick={() => socialMediaNotice("email", lang, contact.twitter)}></button>)}
      {contact.form && (<button className="contact-btn form" onClick={() => window.open(contact.form, "_blank")}></button>)}
    </div>
  );
}

function Icon({ entry }) {
  let src = IMG_PATH;
  if (entry['img']) {
    src += entry['img'][0] + '/' + entry['img'];
  } else {
    src += entry.domain[0] + '/' + entry['domain'] + '.svg';
  }
  return (<img className="logo" loading="lazy" srcset={src} alt="" />);
}

export default Table;
