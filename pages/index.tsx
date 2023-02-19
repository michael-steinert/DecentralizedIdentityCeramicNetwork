'use client';
import { useViewerConnection, useViewerRecord } from '@self.id/react';
import { EthereumAuthProvider } from '@self.id/web';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Page() {
  const [name, setName] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  // Initial State of the the `window` Object to avoid React Hydration Error
  const [isWindow, setIsWindow] = useState<Window | null>(null);
  // `useViewerConnection` Hook is used to set up a State Variable for the User's Connection Status, Connect and Disconnect
  const [connection, connect, disconnect] = useViewerConnection();
  // `useViewerRecord` Hook is used to retrieve the User's Profile Data
  const record = useViewerRecord('basicProfile');
  // TypeScript is unable to determine the Type of the `record` Object
  // and therefore is not able to determine whether the `merge` Method is defined on it
  const recordWithMerge = record as typeof record & {
    merge: (data: any) => Promise<void>;
  };
  async function createAuthProvider() {
    // The following assumes there is an injected `window.ethereum` provider
    const addresses = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    return new EthereumAuthProvider(window.ethereum, addresses[0]);
  }

  async function connectAccount() {
    const authProvider = await createAuthProvider();
    connect(authProvider);
  }

  async function updateProfile() {
    if (!name || !bio || !username) {
      return;
    }
    // Merging the current State of the Variables into a Record
    await recordWithMerge?.merge({ name, bio, username });
  }

  useEffect(() => {
    // On the Server (on a Server-side Rendering Framework), the `window` Object is not defined
    // Therefore guard against Accessing it until the Client has loaded
    if (typeof window !== 'undefined') {
      setIsWindow(window);
    }
  }, [record]);

  return (
    <>
      <Head>
        <title>
          Decentralized Identity: Build a Profile with Ethereum & Ceramic
          Network
        </title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='min-h-screen bg-gray-200'>
        <div className='bg-gray-600 py-4 px-4 sm:px-6 lg:px-8 lg:py-6 shadow-lg text-white'>
          <div className='container mx-auto px-6 md:px-0'>
            <h1 className='text-2xl font-bold text-white text-center'>
              Decentralized Identity: Build a Profile with NextJs, Ethereum &
              Ceramic Network
            </h1>
          </div>
        </div>
        <div className='flex items-center justify-center pt-20 font-sans overflow-hidden'>
          <div className='max-w-md w-full mx-auto'>
            <div className='bg-white p-10 rounded-lg shadow-lg'>
              <form>
                <div className='mb-6'>
                  <label
                    className='block text-gray-700 font-bold mb-2'
                    htmlFor='name'
                  >
                    Name
                  </label>
                  <input
                    className='border border-gray-300 p-2 w-full rounded-lg'
                    type='text'
                    name='name'
                    id='name'
                    placeholder='Your name'
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>
                <div className='mb-6'>
                  <label
                    className='block text-gray-700 font-bold mb-2'
                    htmlFor='bio'
                  >
                    Bio
                  </label>
                  <textarea
                    className='border border-gray-300 p-2 w-full rounded-lg'
                    name='bio'
                    id='bio'
                    rows={5}
                    placeholder='Write something about yourself'
                    onChange={(e) => {
                      setBio(e.target.value);
                    }}
                  ></textarea>
                </div>
                <div className='mb-6'>
                  <label
                    className='block text-gray-700 font-bold mb-2'
                    htmlFor='username'
                  >
                    Username
                  </label>
                  <input
                    className='border border-gray-300 p-2 w-full rounded-lg'
                    type='text'
                    name='username'
                    id='username'
                    placeholder='Your username'
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />
                </div>
                <div className='flex items-center justify-between'>
                  <button
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                    type='submit'
                    disabled={!record.isMutable || record.isMutating}
                    onClick={() => updateProfile()}
                  >
                    {record.isMutating ? 'Updating...' : 'Update Profile'}
                  </button>

                  {connection.status === 'connected' ? (
                    <button
                      className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                      type='button'
                      onClick={() => disconnect()}
                    >
                      Disconnect
                    </button>
                  ) : isWindow && 'ethereum' in window ? (
                    <button
                      className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
                      type='button'
                      disabled={connection.status === 'connecting'}
                      onClick={() => {
                        connectAccount();
                      }}
                    >
                      Connect Wallet
                    </button>
                  ) : (
                    <p className='text-red-500 text-sm italic mt-2 text-center w-full'>
                      An injected Ethereum Provider such as{' '}
                      <a href='https://metamask.io/'>MetaMask</a> is needed to
                      authenticate.
                    </p>
                  )}
                </div>
              </form>
            </div>
            {connection.status === 'connected' && record && record.content ? (
              <div className='flex flex-col items-center mt-8'>
                <h2 className='text-3xl font-bold mb-6 text-gray-900'>
                  Profile Information
                </h2>
                <div className='w-full max-w-md bg-white p-8 rounded-lg shadow-lg'>
                  <p className='mb-4'>
                    <span className='font-bold text-gray-700 mr-2 text-lg'>
                      Name:
                    </span>{' '}
                    <span id='nameOutput' className='text-lg'>
                      {record.content.name || 'No Name set'}
                    </span>
                  </p>

                  <p className='mb-4'>
                    <span className='font-bold text-gray-700 mr-2 text-lg'>
                      Bio:
                    </span>{' '}
                    <span id='bioOutput' className='text-lg'>
                      {record.content.bio || 'No Bio set'}
                    </span>
                  </p>
                  <p>
                    <span className='font-bold text-gray-700 mr-2 text-lg'>
                      Username:
                    </span>{' '}
                    <span id='usernameOutput' className='text-lg'>
                      {record.content.username || 'No Username set'}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div className='mt-8'>
                <div className='bg-white p-8 rounded-lg shadow-lg'>
                  <p>No Profile found</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
