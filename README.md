# Bitcoin Info

This project is a Vue 3 application that uses the CoinGecko API to fetch and display historical data for various cryptocurrencies. It uses D3 for data visualization, VueForm Slider for interactive elements, and Tailwind CSS for styling. The project is built with Vite.

## External Libraries

- [Vue 3](https://v3.vuejs.org/)
- [CoinGecko API](https://coingecko.com/en/api)
- [D3](https://d3js.org/)
- [VueForm Slider](https://vueform.com/slider)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

## Architecture Decisions

- **Vue 3**: Chosen for its performance improvements over Vue 2, composition API, and improved TypeScript support.
- **CoinGecko API**: Provides comprehensive and free cryptocurrency data.
- **D3**: Powerful library for creating complex data visualizations.
- **VueForm Slider**: Provides a Vue-compatible slider component.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Vite**: Build tool that provides a faster and leaner development experience for modern web projects.

## Limitations

One significant limitation of this project stems from the use of the free tier of the CoinGecko API. The free tier only allows fetching historical data up to 365 days in the past. This means that the application can only display cryptocurrency data from the last year, and not from any time before that. 

If you need to display data from more than a year ago, is necessary to upgrade to a paid tier of the CoinGecko API, or find an alternative API that provides the necessary data.

Please keep this limitation in mind when using the application and interpreting the data it provides.

## How to Use

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Start the development server with `npm run dev`.
4. Build the application for production with `npm run build`.
5. Preview the production build with `npm run preview`.

## Installation

1. Ensure you have [Node.js](https://nodejs.org/) installed.
2. Clone this repository.
3. Navigate to the project directory and run `npm install` to install dependencies.
4. Run `npm run dev` to start the development server.

## Building

To build the application for production, run `npm run build`. The built files will be in the `dist` directory.

## Questions

If you have any questions or run into any issues, please open an issue in this repository.