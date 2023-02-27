/** @type {import('tailwindcss').Config} */

const hex2rgba = require('hex2rgba');

module.exports = {
  content: {
    files: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  },
  darkMode: ["class", ":global(.dark)"],
  important: true,
  theme: {
    extend: {
      fontSize: {
        '3xl': '26px',
        '2xl': '20px',
        xl: '18px',
        lg: '16px',
        md: '14px',
        sm: '12px',
      },
      fontFamily: {
        default: 'Inter, Arial'
      },
      borderRadius: {
        lg: '16px',
        md: '8px',
        sm: '4px',
      },
      colors: {
        black: {
          light: '#000',
          dark: '#fff',
          gray: '#d9d9d9'
        },
        gray: {
          light: '#666',
          dark: '#c5c5c5'
        },
        pink: {
          light: '#FB5E93',
        },
        blue: {
          light: '#77B0D0',
        },
        grey: {
          light: '#C5C5C5'
        },
        switch: {
          light: hex2rgba('#a8a8a8', 0.25)
        },
        warning: '#FB5E93',
      },
      borderColor: {
        gray: {
          light: '#E3E3E3',
          dark: '#666'
        },
        modal: {
          light: '#F1F1F1',
          dark: '#666'
        },
        table: {
          light: '#e3e3e3',
          dark: '#666'
        }
      },
      backgroundColor: {
        black: {
          light: '#000',
          dark: '#fff'
        },
        track: {
          light: '#77B0D0'
        },
        pink: {
          light: '#FB5E93',
        },
        blue: {
          light: '#0FA0DC',
        },
        pinkopacity: {
          light: hex2rgba('#ff5e93', 0.1)
        },
        blueopacity: {
          light: hex2rgba('#77B0D0', 0.1),
        },
        opacity: {
          light: hex2rgba('#fff', 0.36),
          dark: hex2rgba('#fff', 0.05)
        },
        bluechart: {
          light: '#ACCBE2'
        },
        purplechart: {
          light: '#9E79B1'
        },
        pinkchart: {
          light: '#F66096'
        },
        main: {
          light: '#fff',
        },
        gray: {
          light: '#F5F5F5',
          dark: '#3d3d3d'
        },
        grey: {
          light: '#C5C5C5',
          dark: '#666'
        },
        mask: {
          light: hex2rgba('#d1d1d1', 0.3),
        },
        layout: {
          light: '#EFEEF3',
          dark: '#323232'
        },
        switch: {
          light: '#D9D9D9',
          dark: '#3d3d3d'
        }
      },
      backgroundImage: {
        'primary-light': 'linear-gradient(90deg, #F792BC 0%, #BA96D3 53.51%, #84C2E6 96.02%)',
        'tab-active-light': `linear-gradient(90deg, ${hex2rgba('#3D94CE', 0.1)} 0%, ${hex2rgba('#0FA0DC', 0.1)} 96.02%)`,
        'tab-switcher-light': `linear-gradient(90deg, ${hex2rgba('#F792BC', 0.1)} 0%, ${hex2rgba('#BA96D3', 0.1)} 53.51%, ${hex2rgba('#84C2E6', 0.1)} 96.02%)`,
        'tab-switcher-active-light': `linear-gradient(90deg, ${hex2rgba('#F792BC', 0.5)} 0%, ${hex2rgba('#BA96D3', 0.5)} 53.51%, ${hex2rgba('#84C2E6', 0.5)} 96.02%)`
      }
    },
    screens: {
      xsmax: {
        max: '600px'
      },
      sm: {
        max: '767px'
      },
      md: {
        min: '768px'
      },
      mdmax: {
        max: '767px'
      },
      lg: {
        min: '1024px'
      },
      lgmax: {
        max: '1023px'
      },
      xl: {
        min: '1280px'
      },
      xlmax: {
        max: '1279px'
      }
    }
  }
}
