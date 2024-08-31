import React from 'react';
import { useTranslation } from 'react-i18next';

const Main = () => {
    const { t } = useTranslation();

    return(
      <div>
          <p>{t('main.welcomingtext')}</p>
      </div>
  )
};

export default Main;