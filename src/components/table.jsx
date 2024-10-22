import {useEffect, useState} from 'preact/hooks';

const API_URL = 'http://127.0.0.1:8081/website/categories/';

function Table({Category, Title}) {
  const [entries, setEntries] = useState({});
  useEffect(() => {
    fetch(`${API_URL}${Category}.json`).
      then(res => res.json()).
      then(data => setEntries(data || {})).
      catch(err => console.error('Error fetching categories:', err));  // Add error handling
  }, []);

  return (
    <div
      id={Category}
      className="table collapse show"
      role="region"
      aria-selected="true"
      style="grid-area: 2 / 1 / 3 / 7;" // First in is table y position
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
      {Object.entries(entries).sort().map(([name, data]) => (
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
        {/* TODO: Add icons */}
        <a className="name" href={data.domain} title={name}>{name}</a>
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
        {methods && methods.map(([method]) => <li>{method}</li>)}
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
  return (<div className="contact"></div>);
}

export default Table;
