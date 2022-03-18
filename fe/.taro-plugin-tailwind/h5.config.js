module.exports = {
    prefixer: false,
    compile: false,
    globalUtility: false,
    darkMode: 'media',
    corePlugins: {
        preflight: false,
        divideColor: false,
        divideOpacity: false,
        divideStyle: false,
        divideWidth: false,
        space: false,
        placeholderColor: false,
        placeholderOpacity: false,
    },
    theme: {
        spacing: {
            0: 0,
            1: '2px',
            2: '4px',
            4: '8px',
            8: '16px',
            12: '24px',
            16: '32px',
            20: '40px',
            24: '48px',
            32: '64px',
            40: '80px',
            48: '96px',
            56: '112px',
            64: '128px',
            72: '144px',
            80: '160px',
        },
        extend: {
            colors: {
                'primary': {
                    DEFAULT: '#00b26a',
                },
                'danger': {
                    DEFAULT: '#F56C6C',
                },
                'neutral': {
                    1: '#000',
                    2: '#323232',
                    DEFAULT: '#323232',
                    3: '#555',
                    4: '#666',
                    5: '#999',
                    6: '#B2B2B2',
                    7: '#B5B5B5',
                    8: '#CCC',
                    9: '#DDD',
                    10: '#EBEBEB',
                    11: '#EEE',
                    12: '#F2F2F2',
                    13: '#F5F5F5',
                    14: '#FAFAFA',
                    15: '#FCFCFC',
                },
            },
        },
    },
};
