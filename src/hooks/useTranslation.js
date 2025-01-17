import { useState, useEffect, useMemo } from 'preact/hooks';
import i18n from '../i18n';

function useTranslation() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const onLoad = () => forceUpdate((n) => n + 1);
    i18n.subscribe(onLoad);
    return () => i18n.unsubscribe(onLoad);
  }, []);

  return useMemo(() => i18n.get.bind(i18n), [i18n.translations]);
}

export default useTranslation;
