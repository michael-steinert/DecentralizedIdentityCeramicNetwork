import '../styles/globals.css';
import { Provider } from '@self.id/react';
import { AppProps } from 'next/app';

const App = ({ Component, pageProps }: AppProps) => {
  // Render the Provider Component, which provides Authentication and Authorization Functionality to the application
  // Pass a Client Prop to the Provider Component, which configures the Ceramic Testnet with the `testnet-clay`
  return (
    <Provider client={{ ceramic: 'testnet-clay' }}>
      {/* Render the Component with its Props inside the Provider Component, which allows the Application to access the Authentication and Authorization Context */}
      <Component {...pageProps} />
    </Provider>
  );
};

export default App;
