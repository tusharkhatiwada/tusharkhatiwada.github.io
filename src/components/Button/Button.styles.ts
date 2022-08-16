export const themeButton = {
  variants: {
    solid: ({ colorScheme }: { colorScheme: string }) => {
      return {
        _light: {
          bg: `${colorScheme}.900`,
          _text: {
            color: `white`,
          },
          _icon: {
            color: `white`,
          },
          _spinner: {
            color: `white`,
          },
          _pressed: {
            bg: `${colorScheme}.800`,
          },
          _disabled: {
            bg: `${colorScheme}.700`,
          },
        },
        _dark: {
          bg: `${colorScheme}.100`,
          _text: {
            color: `black`,
          },
          _icon: {
            color: `black`,
          },
          _spinner: {
            color: `black`,
          },
          _pressed: {
            bg: `${colorScheme}.200`,
          },
          _disabled: {
            bg: `${colorScheme}.100`,
          },
        },
      }
    },
  },
}
