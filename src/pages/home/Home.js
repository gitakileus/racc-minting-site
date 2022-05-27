// import { useTotalSupply, useName } from '../../hooks/RaccContract'
import React, { useState, useEffect, Fragment, useRef } from 'react'
import AppLayout from '../AppLayout'
import './Home.scss'
import { ChevronDownIcon, PlusIcon, MinusIcon } from '@heroicons/react/solid'
import { useEthers, shortenAddress, Mainnet, Ropsten } from '@usedapp/core'
import { Dialog, Transition } from '@headlessui/react'
import { toast } from 'react-toastify'
import MerkleTree from 'merkletreejs'
import axios from 'axios'
import { utils } from 'ethers'
import { Loading } from '../../components/Loading/Loading'

import WalletConnectProvider from '@walletconnect/web3-provider'
import Web3Modal from 'web3modal'
import 'react-toastify/dist/ReactToastify.css'
import SmallEarth from '../../assets/images/small-earth.png'
import WhiteCircle from '../../assets/images/white-circle.png'
import HeroLeftLines from '../../assets/images/hero-left-lines.png'
import HeroImg from '../../assets/images/hero-img.png'
import { formatEther, formatUnits } from '@ethersproject/units'

import {
  useSetMerkleRoot,
  useSetMintStep,
  useGetTotalSupply,
  useGetSetting,
  useMintFree,
  useMintPresale,
  useMintPublic,
} from '../../hooks/RaccContract'

function classNames(...classes) {
  return classes.filter(Boolean).join('')
}

const Home = () => {
  const { account, activate, chainId, deactivate, library } = useEthers()
  const [total, setTotal] = useState(0)
  var [tokens, setTokens] = useState(1)
  const [mintPrice, setMintPrice] = useState()
  var [mintPriceByUser, setMintPriceByUser] = useState()
  var [mintNumber, setMintNumber] = useState()
  const [limit, setLimit] = useState()
  const [mintStep, setMintStep] = useState()
  const setting = useGetSetting()
  const totalSupply = useGetTotalSupply()
  const { state: mintFreeState, send: mintFree } = useMintFree()
  const { state: mintPresaleState, send: mintPresale } = useMintPresale()
  const { state: mintPublicState, send: mintPublic } = useMintPublic()
  const [open, setOpen] = useState(false)
  const cancelButtonRef = useRef(null)
  const [loadingFlag, setLoadingFlag] = useState(false)
  // console.log("signer", library);

  const plusMint = () => {
    if (tokens < limit) setTokens(++tokens)
    // setMintPriceByUser(tokens * mintPrice)
  }
  const minusMint = () => {
    if (tokens > 1) setTokens(--tokens)
    // setMintPriceByUser(tokens * mintPrice)
  }
  const changeToken = (event) => {
    console.log("event", event.target.value)
    if (event.target.value > limit) {
      setTokens(limit)
    }else if(event.target.value <= 0){
      setTokens(0)
    }
    else{
      setTokens(event.target.value)
    }


  }
  const handleDisconnect = () => {
    deactivate()
    setLimit(0)
    setMintNumber(0)
    setTokens(0)
    setMintPriceByUser(0)
    setTotal(0)
  }
  const handleConnect = async () => {
    const providerOptions = {
      injected: {
        display: {
          name: 'Metamask',
          description: 'Connect with the provider in your Browser',
        },
        package: null,
      },
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.REACT_APP_INFURA_ID,
        },
      },
    }

    if (!account) {
      const web3Modal = new Web3Modal({
        providerOptions,
      })
      const provider = await web3Modal.connect()
      await activate(provider)
    }
  }

  const init = () => {
    //setMerkleRoot
    console.log('init---------->')
    if (setting) {
      const mntStep = parseInt(setting[0][0], 10) //mintStep
      const mntPrice = formatEther(setting[0][1], 18) //mintPrice
      const mntPriceDiscount = formatEther(setting[0][2], 18) //mintPriceDiscount
      const mntTotalLimit = parseInt(setting[0][3], 10) //totalLimit
      const limit4 = parseInt(setting[0][4], 10) //Limit4
      const limit6 = parseInt(setting[0][5], 10) //Limit6
      console.log(
        mntStep,
        mntPrice,
        mntPriceDiscount,
        mntTotalLimit,
        limit4,
        limit6,
      )

      setTotal(100)
      if (mntStep === 0) {
        setMintPrice(0)
        // setMintPriceByUser(0)
        setLimit(limit4)
      } else if (mntStep === 1) {
        setMintPrice(parseFloat(mntPriceDiscount))
        // setMintPriceByUser(parseFloat(mntPriceDiscount))
        setLimit(limit4)
      } else {
        setMintPrice(parseFloat(mntPrice))
        // setMintPriceByUser(parseFloat(mntPrice))
        setLimit(limit6)
      }
      setMintStep(mntStep)
      setMintNumber(mntTotalLimit)
    }
    if (totalSupply) {
      setMintNumber(parseInt(totalSupply, 10))
    }
    console.log(mintPrice, mintPriceByUser, mintNumber, mintNumber)
  }

  useEffect(() => {
    init()
  }, [setting])

  useEffect(() => {
    mintFreeState.status === 'Exception' &&
      toast.error(mintFreeState.errorMessage, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      })
    mintFreeState.status === 'Success' &&
      toast.success('Mint Success', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      })
    mintPresaleState.status === 'Exception' &&
      toast.error(mintPresaleState.errorMessage, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      })
    mintPresaleState.status === 'Success' &&
      toast.success('Mint Success', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      })
    mintPublicState.status === 'Exception' &&
      toast.error(mintPublicState.errorMessage, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      })
    mintPublicState.status === 'Success' &&
      toast.success('Mint Success', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      })
  }, [mintFreeState, mintPresaleState, mintPublicState])

  const mint = async () => {
    try {
      setLoadingFlag(true)
      setOpen(false)
      //get proof
      console.log('account', account)
      const response = await axios.post('http://localhost:5000/merkleTree', {
        account: account,
      })

      console.log(response.data.proof)
      console.log('mintStep', mintStep)
      console.log('tokens', tokens)

      if (mintStep === 0) {
        console.log('00000000')
        account && (await mintFree(tokens, response.data.proof))
      } else if (mintStep === 1) {
        console.log('11111111111')

        try {
          account &&
            (await mintPresale(tokens, response.data.proof, {
              value: utils.parseEther((tokens * mintPrice).toString()),
            }))
        } catch (e) {
          console.log('5555', e)
        }
        console.log('55555555555555555555')
      } else {
        console.log('222222222222222')
        account && (await mintPublic(tokens))
      }

      setLoadingFlag(false)
      init()
    } catch (e) {
      console.log('eeeeee', e)
      setLoadingFlag(false)
      toast.error(e, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      })
    }
  }

  const closeMint = () => {
    setOpen(false)
  }

  if (loadingFlag) {
    return <Loading />
  }
  return (
    <AppLayout>
      <div className=''>
        <img className='hero-left-lines' src={HeroLeftLines} alt='' />
        <img className='hero-left-lines-static' src={HeroLeftLines} alt='' />
        <img className=' earth-1' src={SmallEarth} alt='' />
        <img className=' earth-2' src={SmallEarth} alt='' />
        <img className='  earth-3' src={SmallEarth} alt='' />
        <img className=' star1' src={WhiteCircle} alt='' />
        <img className=' star2' src={WhiteCircle} alt='' />
        <img className=' star3' src={WhiteCircle} alt='' />
        <img className=' star4' src={WhiteCircle} alt='' />
      </div>
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-y-10 pb-96'>
        <ul className='text-center px-10 gap-y-10'>
          <li>
            <span className='text-[40px] md:text-[65px] text-white tracking-wide font-bold lg:leading-loose'>
              MINT YOUR <span className='text-[#ff0000]'>RACC!</span>
            </span>
          </li>
          <li>
            <span className='text-2xl font-normal text-white leading-loose'>
              {mintNumber ? mintNumber : 0} / {total}
            </span>
          </li>
          <li>
            <span className='text-3xl  font-normal text-[#ff0000] leading-loose'>
              Cost:{' '}
              <span className='text-white'>
                {mintPrice ? mintPrice * tokens : 0}
              </span>{' '}
              ETH
            </span>
          </li>
          <li>
            <span className=' text-md sm:text-2xl text-white leading-loose font-normal'>
              You may mint up to <span>{limit ? limit : 0}</span> at a time
            </span>
          </li>
          <li>
            {!account ? (
              <button
                className='text-white mt-8 bg-[#ff0000] rounded-[50px] px-8 py-2 text-md font-bold tracking-[0.1em] hover:shadow-[-4px_4px_0px_-0px_white] focus:shadow-[-4px_4px_0px_-0px_white] transition ease-in-out duration-300'
                onClick={handleConnect}
              >
                CONNECT WALLET
              </button>
            ) : (
              <button
                className='text-white mt-8 bg-[#ff0000] rounded-[50px] px-8 py-2 text-md font-bold tracking-[0.1em] hover:shadow-[-4px_4px_0px_-0px_white] focus:shadow-[-4px_4px_0px_-0px_white] transition ease-in-out duration-300'
                onClick={handleDisconnect}
              >
                {shortenAddress(account)}
              </button>
            )}
          </li>
          <li>
            <div className='flex justify-center items-center gap-x-16 my-10'>
              <button
                className='rounded-full p-2 bg-cyan-500 shadow-lg shadow-cyan-500/50 hover:drop-shadow-5xl drop-shadow-xl hover:bg-[#ff0000]'
                onClick={minusMint}
              >
                <MinusIcon className='h-8 w-8 text-white' />
              </button>
              <input
                className='text-4xl text-white font-bold bg-transparent w-20 text-center 
                              invalid:border-red-500 in-range:border-green-500 out-of-range:border-red-500'
                type='number'
                value={tokens ? tokens : 0}
                onChange={changeToken}
                // max={limit ? limit : 1}
                max={limit ? limit : 1}
                min="1"
                disabled={limit ? '' : 'disabled'}
              />
              <button
                className='rounded-full p-2 bg-cyan-500 shadow-lg shadow-cyan-500/50 drop-shadow-5xl hover:drop-shadow-5xl drop-shadow-xl hover:bg-[#ff0000]'
                onClick={plusMint}
              >
                <PlusIcon className='h-8 w-8 text-white' />
              </button>
            </div>
          </li>
          <li>
            <button
              className='text-white bg-[#ff0000] rounded-[50px] px-24 py-4 text-2xl font-bold tracking-[0.1em] hover:shadow-[-4px_4px_0px_-0px_white] focus:shadow-[-4px_4px_0px_-0px_white] transition ease-in-out delay-300'
              onClick={() => (account && tokens !== 0 ? setOpen(true) : '')}
            >
              Mint
            </button>
          </li>
        </ul>
        <div data-aos='fade-up' data-aos-duration='1500'>
          <img className='w-100' src={HeroImg} alt='' />
        </div>

        <Transition.Root show={open} as={Fragment}>
          <Dialog
            as='div'
            className='fixed z-10 inset-0 overflow-y-auto'
            initialFocus={cancelButtonRef}
            onClose={setOpen}
          >
            <div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0'
                enterTo='opacity-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
              >
                <Dialog.Overlay className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
              </Transition.Child>

              <span
                className='hidden sm:inline-block sm:align-middle sm:h-screen'
                aria-hidden='true'
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              >
                <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
                  <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                    <div className='sm:flex sm:items-start'>
                      <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                        <Dialog.Title
                          as='h3'
                          className='text-lg leading-6 font-medium text-gray-900'
                        >
                          Are you sure to confirm mint?
                        </Dialog.Title>
                      </div>
                    </div>
                  </div>
                  <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
                    <button
                      type='button'
                      className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#ff0000]  text-base font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:ml-3 sm:w-auto sm:text-sm'
                      onClick={mint}
                    >
                      Confirm
                    </button>
                    <button
                      type='button'
                      className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                      onClick={closeMint}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
      </main>
    </AppLayout>
  )
}

export default Home
