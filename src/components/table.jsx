import {useEffect, useRef, useState} from 'preact/hooks';
import {API_URL, IMG_PATH} from '../constants.js';
import useTranslation from '../hooks/useTranslation.js';
import {html} from 'htm/preact';
import {
  FloatingArrow,
  arrow,
  useFloating,
  useInteractions,
  useClick,
  useDismiss,
  autoPlacement,
} from '@floating-ui/react';

function Table({Category, search, grid}) {
  const [entries, setEntries] = useState([]);
  const [region, setRegion] = useState('');

  useEffect(() => {
    if (search) {
      setEntries(search);
    } else {
      setRegion(window.location.pathname.slice(1, -1));
      const region = window.location.pathname.slice(1);
      fetch(`${API_URL}/${region || 'int/'}${Category}.json`,
        {cache: 'force-cache'}).
        then(res => res.json()).
        then(data => setEntries(Object.entries(data) || [])).
        catch(err => console.error('Error fetching categories:', err));  // Add error handling

      // Scroll to category button
      window.location.hash = `#${Category}`;
      document.getElementById(Category)?.
        scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  }, []);

  return (
    <div className="table collapse show"
         role="region"
         style={`grid-area: ${grid};`} // First in is table y position
         aria-selected="true">

      <Head category={Category}></Head>

      {entries.map(([name, data]) => (
        <Entry name={name.replace(` [${region.toUpperCase()}]`, '')}
               data={data}/>
      ))}
    </div>
  );
}

function Entry({name, data}) {
  return (
    <section className="entry">
      <div className="title">
        <a className="name" href={data.url ? data.url:`https://${data.domain}`}
           title={name}>
          <Icon entry={data}/>
          {name}
        </a>

        {data.notes && <Note content={data.notes}/>}
      </div>

      {data?.methods ?
        <>
          <div className="docs">
            {data.documentation &&
              <a aria-label="documentation" className="website-doc"
                 href={data.documentation}/>}
            {data.recovery &&
              <a aria-label="recovery documentation" className="recovery-doc"
                 href={data.recovery}/>}
          </div>

          <Methods methods={data?.methods}
                   customSoftware={data['custom-software']}
                   customHardware={data['custom-hardware']}/>
        </>:
        <Contact contact={data.contact}/>
      }

    </section>
  );
}

function Note({content}) {
  const t = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);

  // Initialize floating UI
  const {refs, context, floatingStyles} = useFloating({
    open: isOpen, onOpenChange: setIsOpen, middleware: [
      autoPlacement(), arrow({element: arrowRef})],
  });

  // Set up interactions
  const click = useClick(context);
  const dismiss = useDismiss(context);

  const {getReferenceProps, getFloatingProps} = useInteractions([click, dismiss]);

  return (<>
    <button
      ref={refs.setReference}
      {...getReferenceProps({className: 'note'})}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
    >
      <span className="material-symbols-outlined">emergency_home</span>
    </button>

    {isOpen && (<div ref={refs.setFloating} style={floatingStyles}
                     {...getFloatingProps({className: 'note-popover'})}>
      <div ref={arrowRef} className="popover-arrow"/>
      <FloatingArrow ref={arrowRef} context={context}/>
      <h5>{t('exception')}</h5>
      <p>{content}</p>
    </div>)}
  </>);
}

let staticTranslations = null; // Translations for table head

function Head({category}) {
  const t = useTranslation();

  // Populate static translations once
  if (!staticTranslations) {
    staticTranslations = {
      docs: t('docs'),
      sms: t('sms'),
      email: t('email'),
      hardware: t('hardware'),
      software: t('software'),
    };
  }

  return html`
    <div aria-hidden="true" class="table-head">
      <div>${t(category)}</div>
      <div>${staticTranslations.docs}</div>
      <div>${staticTranslations.sms}</div>
      <div>${staticTranslations.email}</div>
      <div>${staticTranslations.hardware}</div>
      <div>${staticTranslations.software}</div>
    </div>
  `;
}

function Methods({methods, customSoftware, customHardware}) {
  const t = useTranslation();

  return (
    <>
      <ul className="tfa-summary" aria-label="Supported 2FA Methods">
        {methods && methods.filter((method) => !method.includes('custom')).
          map((method) => (<li>{t(method)}</li>))}
        {methods?.includes('custom-hardware') &&
          <li>{t('custom-hardware')}: {customHardware?.join(', ')}</li>}
        {methods?.includes('custom-software') &&
          <li>{t('custom-software')}: {customSoftware?.join(', ')}</li>}
      </ul>

      <div aria-hidden="true"
           className={`sms method ${methods?.includes('sms') ||
           methods?.includes('call') ? 'used':''}`}></div>

      <div aria-hidden="true" className={`email method ${
        methods?.includes('email') ? 'used':''}`}></div>

      <div aria-hidden="true" className={`hardware method ${
        methods?.includes('u2f') ? 'used':''}`}>
        {methods?.includes('custom-hardware') &&
          <CustomMethods type="hardware" methods={customHardware}/>}
      </div>

      <div aria-hidden="true" className={`software method ${
        methods?.includes('totp') ? 'used':''}`}>
        {methods?.includes('custom-software') &&
          <CustomMethods type="software" methods={customSoftware}/>}
      </div>
    </>
  );
}

/**
 * Show custom methods
 *
 * @param {Object} props - The props for this compoennt
 * @param {('software'|'hardware')} props.type - The type of custom methods
 * @param {string[]} props.methods - The custom methods
 */
function CustomMethods({type, methods}) {
  const t = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);

  // Initialize floating UI
  const {refs, context, floatingStyles} = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      autoPlacement(),
      arrow({element: arrowRef}),
    ],
  });

  // Set up interactions
  const click = useClick(context);
  const dismiss = useDismiss(context);

  const {getReferenceProps, getFloatingProps} = useInteractions(
    [click, dismiss]);

  return (
    <>
      <button
        ref={refs.setReference}
        {...getReferenceProps({
          className: `custom-${type}`,
          'aria-haspopup': 'dialog',
          'aria-expanded': isOpen,
        })}
      >
        <span className="material-symbols-outlined">info</span>
      </button>

      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps({
            className: 'custom-popover',
          })}
        >
          <FloatingArrow ref={arrowRef} context={context}/>
          <h5>{t(`custom-${type}`)}</h5>
          <ul>
            {methods.map((method, index) => (
              <li key={index}>{method}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

/**
 * Alert the user to the privacy implications of posting on social media.
 *
 * @param {('tweet'|'facebook'|'email')} type - The type of social media
 * @param {string} lang - An ISO 639-1 language code
 * @param {string} handle - The social media handle
 */
function socialMediaNotice(type, lang, handle) {
  const uri = `/contact/?type=${type}&lang=${lang}&handle=${handle}`;
  if (window.localStorage.getItem('social-media-notice') === 'hidden') {
    window.open(uri, '_blank');
  } else {
    document.getElementById('social-media-warn').showModal();
    document.getElementById('social-media-accept').
      setAttribute('data-url', uri);
  }
}

function Contact({contact}) {
  const lang = contact.language || 'en';
  return (
    <div aria-label="2FA not supported" className="contact">
      {contact.twitter && (<button className="contact-btn twitter"
                                   onClick={() => socialMediaNotice('tweet',
                                     lang, contact.twitter)}></button>)}
      {contact.facebook && (<button className="contact-btn facebook"
                                    onClick={() => socialMediaNotice('facebook',
                                      lang, contact.facebook)}></button>)}
      {contact.email && (<button className="contact-btn email"
                                 onClick={() => socialMediaNotice('email', lang,
                                   contact.email)}></button>)}
      {contact.form && (<button className="contact-btn form"
                                onClick={() => window.open(contact.form,
                                  '_blank')}></button>)}
    </div>
  );
}

function Icon({entry}) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Defer rendering until after the initial render
    const timeout = setTimeout(() => setShouldRender(true), 0);
    return () => clearTimeout(timeout); // Clean up timeout
  }, []);

  if (!shouldRender) return html`<img class="logo" alt=""/>`; // Placeholder

  let src = IMG_PATH;
  if (entry['img']) {
    src += entry['img'][0] + '/' + entry['img'];
  } else {
    src += entry.domain[0] + '/' + entry['domain'] + '.svg';
  }
  return html`<img class="logo" loading="lazy" srcset=${src} alt=""/>`;
}

export default Table;
