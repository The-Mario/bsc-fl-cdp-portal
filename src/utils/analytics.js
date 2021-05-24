import mixpanel from 'mixpanel-browser';
import ReactGA from 'react-ga';
import debug from 'debug';
const log = debug('maker:analytics');

const env = process.env.NODE_ENV === 'production' ? 'freeliquid' : 'test';
const config = {
  test: {
    userSnap: {
      token: '1b98e02e-20b2-43c7-bcc1-ae991d6f439c',
      config: {
        fields: {
          email: "anton.evolution2020@gmail.com"
        }
      }
    },
    mixpanel: {
      token: 'eceaa3f91c3c3100e8febc827cb732ea',
      config: {
        debug: true,
        ip: false
      }
    },
    gaTrackingId: 'UA-178496588-1',
    fathom: {
      pageView: 'EXRQHVYJ'
    }
  },
  freeliquid: {
    mixpanel: {
      token: 'eceaa3f91c3c3100e8febc827cb732ea',
      config: { debug: true, ip: false }
    },
    gaTrackingId: 'UA-178496588-1',
    userSnap: {
      token: '1b98e02e-20b2-43c7-bcc1-ae991d6f439c',
      config: {
        fields: {
          email: "anton.evolution2020@gmail.com"
        }
      }
    },
    fathom: {
      pageView: 'EXRQHVYJ'
    }
  }
}[env];

export const mixpanelInit = () => {
  log(
    `[Mixpanel] Tracking initialized for ${env} env using ${config.mixpanel.token}`
  );
  mixpanel.init(config.mixpanel.token, config.mixpanel.config);
  mixpanel.track('Pageview');
  return mixpanel;
};

export const mixpanelIdentify = (id, walletType) => {
  if (typeof mixpanel.config === 'undefined') return;
  //mixpanel.people.set({ "walletType": walletType });
  mixpanel.track('account-change', { walletType: walletType });
  mixpanel.identify(id);
};

export const userSnapInit = () => {
  // already injected
  if (document.getElementById('usersnap-script')) return;

  window.onUsersnapLoad = function(api) {
    api.init(config.userSnap.config);
    window.Usersnap = api;
  };

  const scriptUrl = `//api.usersnap.com/load/${config.userSnap.token}.js?onload=onUsersnapLoad`;
  const script = document.createElement('script');
  script.id = 'usersnap-script';
  script.src = scriptUrl;
  script.async = true;

  document.getElementsByTagName('head')[0].appendChild(script);
};

export const gaInit = () => {
  log(`[GA] Tracking initialized for ${env} env using ${config.gaTrackingId}`);
  ReactGA.initialize(config.gaTrackingId);
  return ReactGA;
};

export const fathomInit = () => {
  window['fathom'] =
    window['fathom'] ||
    function() {
      (window['fathom'].q = window['fathom'].q || []).push(arguments);
    };
  const scriptUrl = 'https://cdn.usefathom.com/tracker.js';
  const script = document.createElement('script');
  script.async = 1;
  script.src = scriptUrl;
  script.id = 'fathom-script';

  const elements = document.getElementsByTagName('script')[0];
  elements.parentNode.insertBefore(script, elements);

  window.fathom('set', 'siteId', config.fathom.pageView);
};
