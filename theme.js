import { extendTheme } from '@chakra-ui/react';

// Extend the theme to set the default colorScheme for all components
const defaultColour = 'orange';
const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false
  },
  components: {
    // Apply the default colorScheme to all components that support it
    Button: {
      defaultProps: {
        colorScheme: defaultColour
      }
    },
    IconButton: {
      defaultProps: {
        colorScheme: defaultColour
      }
    },
    Tabs: {
        defaultProps: {
          colorScheme: defaultColour
        }
      }
    // Add more components as needed (e.g., Switch, Radio, etc.)
  }
});

export default theme;
