import React, {useEffect, useState} from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

const TEST_GIFS = [
  'https://media.giphy.com/media/J7rKvGwnRgDTPOi43G/giphy.gif',
  'https://media.giphy.com/media/qb1eHxhUHLdsc/giphy-downsized-large.gif',
  'https://media.giphy.com/media/3o7bujtrSVR0UYYGwU/giphy.gif',

]

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');

  /*
   * This function holds the logic for deciding if a Phantom Wallet is
   * connected or not
   */
  const checkIfWalletIsConnected = async () => {
    // We're using optional chaining (question mark) to check if the object is null
      if (window?.solana?.isPhantom) {
        console.log('Phantom wallet found!');
        /*
        * The solana object gives us a function that will allow us to connect
        * directly with the user's wallet
        */
        const response = await window.solana.connect({ onlyIfTrusted: true });
        console.log(
          'Connected with Public Key:',
          response.publicKey.toString()
        );
        /*
        * Set the user's publicKey in state to be used later!
        */
        setWalletAddress(response.publicKey.toString());
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    };

    /*
    * Let's define this method so our code doesn't break.
    * We will write the logic for this next!
    */
    const connectWallet = async () => {
      const { solana } = window;
  
        if (solana) {
          const response = await solana.connect();
          console.log('Connected with Public Key:', response.publicKey.toString());
          setWalletAddress(response.publicKey.toString());
        }
    };

    const sendGif = async () => {
      if (inputValue.length > 0) {
        console.log('Gif link:', inputValue);
      } else {
        console.log('Empty input. Try again.');
      }
    };

    const onInputChange = (event) => {
      const { value } = event.target;
      setInputValue(value);
    };

    /*
    * We want to render this UI when the user hasn't connected
    * their wallet to our app yet.
    */
    const renderNotConnectedContainer = () => (
      <button
        className="cta-button connect-wallet-button"
        onClick={connectWallet}
      >
        Connect to Wallet
      </button>
    );

    const renderConnectedContainer = () => (
      <div className="connected-container">
        <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <input
        type="text"
        placeholder="Enter gif link!"
        value={inputValue}
        onChange={onInputChange}
      />
      <button type="submit" className="cta-button submit-gif-button">Submit</button>
    </form>
        <div className="gif-grid">
          {TEST_GIFS.map(gif => (
            <div className="gif-item" key={gif}>
              <img src={gif} alt={gif} />
            </div>
          ))}
        </div>
      </div>
    );
  
    /*
     * When our component first mounts, let's check to see if we have a connected
     * Phantom Wallet
     */
    useEffect(() => {
      const onLoad = async () => {
        await checkIfWalletIsConnected();
      };
      window.addEventListener('load', onLoad);
      return () => window.removeEventListener('load', onLoad);
    }, []);

  return (
    <div className="App">
      {/* This was solely added for some styling fanciness */}
			<div className={walletAddress ? 'authed-container' : 'container'}></div>
      <div className="container">
        <div className="header-container">
          <p className="header">🖼 Anime GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the animeverse ✨
          </p>
          {/* Render your connect to wallet button right here */}
          {/* Add the condition to show this only if we don't have a wallet address */}
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
