import '../src/styles/globals.css';

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          '00-Foundations',
          '01-DS',
          '02-App',
          '03-Custom',
        ],
      },
    },
  },
};

export default preview;
