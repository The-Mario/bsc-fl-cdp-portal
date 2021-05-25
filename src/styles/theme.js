import { themeDark } from '@makerdao/ui-components-core';
import { SAFETY_LEVELS } from 'utils/constants';
const { colors, typography, space, fontSizes } = themeDark;

const theme = {
  ...themeDark,
  breakpoints: {
    ...themeDark.breakpoints,
    xl: '1150px'
  },
  colors: {
    logo: '#fff',
    cayn: '#F0B90B',
    blue: '#4E26FF',
    greyText: '#A3B2CF',
    subText: '#4D566E',
    whiteText: '#F3F3F5',
    linkColor: '#F0B90B',
    headerNav: '#F3F3F5',
    LinkNotActive: '#DEDFE7',
    input: '#323B4F',
    bodyBg: '#0B0E15',
    cardBg: '#131824',
    bgInputCalc: '#191E2B',
    border: '#323B4F',
    dashBorder: '#222B3F',
    buttonBg: '#323B4F',
    buttonText: '#DEDFE7',
    tableTh: '#4D566E',
    footercopy: '#6F7A96',
    spinner: '#9FAFB9',
    blackLight: '#222',
    blackLighter: '#383838',
    blueGray: '#1E2C37',
    blueGrayDarker: '#131824',
    blueGrayLighter: '#31424E',
    red: '#F75524',
    ...colors
  },
  typography: {
    p6: {
      fontSize: '1.2rem',
      lineHeight: '17px'
    },
    large: {
      fontSize: '1.8rem',
      lineHeight: '1',
      fontWeight: '500',
      fontFamily:
        "-apple-system, system-ui, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Helvetica, Arial, sans-serif;"
    },
    smallCaps: {
      fontSize: '1.1rem',
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
      lineHeight: '22px'
    },

    ...typography
  },
  measurement: {
    sidebarWidth: 318,
    navbarWidth: 150,
    mobileNavbarWidth: 95,
    mobileNavHeight: 80,
    navbarItemWidth: 140,
    navbarItemHeight: 55
  },
  space: {
    ...space,
    s2: 10,
    sm: 16
  },
  fontSizes: {
    ...fontSizes,
    s2: 13
  }
};

export default theme;

export const marketingTheme = (() => {
  const mColors = {
    purpleGray: '#A3B2CF',
    violetGray: '#F3F3F5'
  };
  const mFont = "'PT Root', Arial, Helvetica, sans-serif";
  const mHeading = {
    display: 'block',
    fontFamily: mFont,
    fontWeight: 'bold',
    color: '#F3F3F5'
  };

  return {
    ...theme,
    colors: {
      ...theme.colors,
      ...mColors
    },
    typography: {
      ...theme.typography,
      h1: {
        ...mHeading,
        fontSize: '3.4rem',
        lineHeight: '58px',
        color: '#F3F3F5'
      },
      h2: {
        ...mHeading,
        fontSize: '48px',
        lineHeight: '58px',
        color: '#F3F3F5'
      },
      h3: {
        ...mHeading,
        fontSize: '28px',
        lineHeight: '38px',
        color: '#F3F3F5',
        padding: '25px 0px'
      },
      h4: {
        ...mHeading,
        fontSize: '24px',
        lineHeight: '38px',
        color: '#F3F3F5',
        fontWeight: 'bold',
        marginBottom: '25px'
      },
      h5: {
        ...mHeading,
        color: '#A3B2CF',
        fontSize: '17px',
        fontWeight: 'regular',
        lineHeight: '32px'
      },
      span: {
        ...mHeading,
        color: '#A3B2CF',
        fontSize: '17px',
        fontWeight: 'regular'
      },
      body: {
        fontFamily: mFont,
        fontSize: '1.8rem',
        lineHeight: '28px',
        letterSpacing: '0.5px'
      }
    },
    fontSizes: {
      ...theme.fontSizes,
      s: '1.6rem'
    },
    mobilePaddingX: '12px' // used for making some components full width on mobile
  };
})();

// the following two functions are taken directly from styled-system
// for a more flexible theme getter
const is = n => n !== undefined && n !== null;

function get(obj, ...paths) {
  const value = paths.reduce((acc, path) => {
    if (is(acc)) return acc;
    const keys = typeof path === 'string' ? path.split('.') : [path];
    return keys.reduce((a, key) => (a && is(a[key]) ? a[key] : null), obj);
  }, null);
  return is(value) ? value : paths[paths.length - 1];
}

export function getMeasurement(key) {
  return get(theme.measurement, key);
}

export function getSpace(key) {
  return get(theme.space, key);
}

export function getColor(key) {
  return get(theme.colors, key);
}

export function getSafetyLevels({ level, overrides = {} }) {
  const levels = {
    textColor: '700',
    backgroundColor: '100',
    borderColor: '200'
  };
  const { DANGER, WARNING, NEUTRAL, SAFE } = SAFETY_LEVELS;
  const colorPairings = {
    [DANGER]: 'aqua',
    [WARNING]: 'aqua',
    [NEUTRAL]: 'slate',
    [SAFE]: ''
  };

  return Object.entries(levels).reduce(
    (acc, [k, v]) => ({
      ...acc,
      [k]: overrides[k] ? overrides[k] : `${colorPairings[level]}.${v}`
    }),
    {}
  );
}
