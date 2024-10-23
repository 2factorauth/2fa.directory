import {useEffect, useState} from 'preact/hooks';

const API_URL = 'http://127.0.0.1:8081/website/categories/';

function Table({Category, Title, Order}) {
  const [entries, setEntries] = useState([]);
  const [columns, setColumns] = useState(6);

  useEffect(() => {
    fetch(`${API_URL}${Category}.json`, { cache: 'force-cache'}).
      then(res => res.json()).
      then(data => setEntries(Object.entries(data).sort() || [])).
      catch(err => console.error('Error fetching categories:', err));  // Add error handling
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 993) {
        setColumns(1); // For smaller screens, reduce columns
      } else {
        setColumns(6); // Default for larger screens
      }
    };

    // Attach event listener
    window.addEventListener('resize', handleResize);

    // Call once on mount
    handleResize();

    // Cleanup on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const y_pos = Math.floor(Order / 6);
  return (
    <div
      id={Category}
      className="table collapse show"
      role="region"
      aria-selected="true"
      style={`grid-area: ${y_pos + 2} / 1 / ${y_pos + 3} / ${columns +
      1};`} // First in is table y position
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
        <Entry name={name} data={data}/>
      ))}
    </div>
  );
}

function Entry({name, data}) {
  const color = data.methods !== undefined ? 'green':'red';
  return (
    <div className={'entry ' + color} role="article" data-domain={data.domain}>

      <div className="title">
        <a className="name" href={data.domain} title={name}>
          <Icon entry={data}/>
          {name}
        </a>
      </div>

      {color === 'green' ?
        <>
          <div className="docs">
            <a className="website-doc" href={data.documentation}/>
          </div>

          {/* TODO: Check for Custom software/hardware */}
          <Methods methods={data.methods}/>
        </>:
        <Contact contact={data.contact}/>
      }

    </div>
  );
}

function Methods({methods}) {
  return (
    <>
      <ul className="tfa-summary" aria-label="Supported 2FA Methods">
        {methods && methods.map((method) => <li>{method}</li>)}
      </ul>
      <div className={`sms method ${methods?.includes('sms') ?
        'used':
        ''}`}></div>
      <div className={`voice method ${methods?.includes('call') ?
        'used':
        ''}`}></div>
      <div className={`email method ${methods?.includes('email') ?
        'used':
        ''}`}></div>
      <div className={`hardware method ${methods?.includes('u2f') ?
        'used':
        ''}`}></div>
      <div className={`software method ${methods?.includes('totp') ?
        'used':
        ''}`}></div>
    </>
  );
}

function Contact({contact}) {
  return (
    <div className="contact">
      {contact.twitter && (<button className="contact-btn twitter"></button>)}
      {contact.facebook && (<button className="contact-btn facebook"></button>)}
      {contact.email && (<button className="contact-btn email"></button>)}
      {contact.form && (<button className="contact-btn form"></button>)}
    </div>
  );
}

const IMG_PATH = 'http://localhost:8081/icons/';

function Icon({entry}) {
  let src = IMG_PATH;
  if (entry['img']) {
    src += entry['img'][0] + '/' + entry['img'];
  } else {
    src += entry.domain[0] + '/' + entry['domain'] + '.svg';
  }
  return (<img className="logo" loading="lazy" srcset={src} alt=""/>);
}

export default Table;
