import { useState, useEffect } from 'preact/hooks';
import i18n from '../i18n';

function useTranslation() {
  const [loaded, setLoaded] = useState(i18n.isLoaded);

  useEffect(() => {
    if (!i18n.isLoaded) {
      const onLoad = () => setLoaded(true);
      i18n.subscribe(onLoad);
      return () => i18n.unsubscribe(onLoad);
    }
  }, []);

  return i18n.get.bind(i18n);
}

export default useTranslation;
