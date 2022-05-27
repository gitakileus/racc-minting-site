import React, { useState } from 'react' // import state
import Logo from '../../assets/images/logo.png'
import { ReactComponent as IconDiscord } from '../../assets/icons/icon-discord.svg'
import { ReactComponent as IconTwitter } from '../../assets/icons/icon-twitter.svg'
import { ReactComponent as IconTelegram } from '../../assets/icons/icon-telegram.svg'
import './Header.scss'

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false) // initiate isNavOpen state with false

  return (
    <div className='flex items-center justify-between'>
      <nav className='w-full'>
        <div className='max-w-7xl mx-auto py-3 px-12 sm:px-16 lg:px-20'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex justify-between items-center w-full'>
              <div className='hidden md:block flex-shrink-0'>
                <a className='logo' href='/#'>
                  <img
                    src={Logo}
                    alt='logo'
                    className='w-[126px] h-[64px] rounded-full'
                  ></img>
                </a>
              </div>

              <div className=' justify-center items-center DESKTOP-MENU hidden space-x-8 lg:flex'>
                <ul className=' menu flex justify-center items-center gap-y-2 text-white font-bold text-lg gap-x-3'>
                  <li className='px-3'>
                    <a href='#about' className='menuItem'>
                      ABOUT
                    </a>
                  </li>
                  <li className='px-3'>
                    <a href='#roadmap' className='menuItem'>
                      ROADMAP
                    </a>
                  </li>
                  <li className='px-3'>
                    <a href='#team' className='menuItem'>
                      TEAM
                    </a>
                  </li>
                  <li className='px-3'>
                    <a href='#faq' className='menuItem'>
                      FAQs
                    </a>
                  </li>
                </ul>
                <div className='flex gap-x-1'>
                  <a
                    target='_blank'
                    href='#/https://discord.com/invite/RACC'
                    className='overlay-links'
                  >
                    <IconDiscord />
                  </a>
                  <a
                    target='_blank'
                    href='#/https://twitter.com/richapecarclub'
                    className='overlay-links'
                  >
                    <IconTwitter />
                  </a>
                  <a
                    target='_blank'
                    href='#/https://www.instagram.com/richapecarclub/'
                    className='overlay-links'
                  >
                    <IconTelegram />
                  </a>
                </div>
              </div>
            </div>
            {/* Mobile Menu */}
            <div className='MOBILE-MENU lg:hidden '>
              <div
                className='HAMBURGER-ICON space-y-2'
                onClick={() => setIsNavOpen((prev) => !prev)} // toggle isNavOpen state on click
              >
                <span className='block h-1 w-8 animate-pulse bg-white'></span>
                <span className='block h-1 w-8 animate-pulse bg-white'></span>
                <span className='block h-1 w-8 animate-pulse bg-white'></span>
              </div>

              <div
                className={`menuNav ${
                  isNavOpen ? 'showMenuNav' : 'hideMenuNav'
                }`}
              >
                {' '}
                {/* // toggle class based on isNavOpen state */}
                <div
                  className='CROSS-ICON absolute top-14 right-4 sm:right-16'
                  onClick={() => setIsNavOpen(false)} // change isNavOpen state to false to close the menu
                >
                  <svg
                    className='h-10 w-10 text-white'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='3'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <line x1='18' y1='6' x2='6' y2='18' />
                    <line x1='6' y1='6' x2='18' y2='18' />
                  </svg>
                </div>
                <ul className=' MENU-LINK-MOBILE-OPEN  flex flex-col font-normal menu justify-between items-center gap-y-10 text-white font-normal text-[40px] absolute top-[50px]'>
                  <li className='px-3  transition ease-in duration-[800ms]'>
                    <a href='#about' className='menuItem'>
                      ABOUT
                    </a>
                  </li>
                  <li className='px-3   transition duration-[900ms] ease-in'>
                    <a href='#roadmap' className='menuItem'>
                      ROADMAP
                    </a>
                  </li>
                  <li className='px-3   transition duration-[1000ms] ease-in'>
                    <a href='#team' className='menuItem'>
                      TEAM
                    </a>
                  </li>
                  <li className='px-3   transition duration-[1100ms] ease-in' >
                    <a href='#faq' className='menuItem'>
                      FAQs
                    </a>
                  </li>
                  <li className='px-3 flex gap-x-1   transition duration-[1200ms] ease-in'>
                    <a
                      target='_blank'
                      href='#/https://discord.com/invite/RACC'
                      className='overlay-links'
                    >
                      <IconDiscord />
                    </a>
                    <a
                      target='_blank'
                      href='#/https://twitter.com/richapecarclub'
                      className='overlay-links'
                    >
                      <IconTwitter />
                    </a>
                    <a
                      target='_blank'
                      href='#/https://www.instagram.com/richapecarclub/'
                      className='overlay-links'
                    >
                      <IconTelegram />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
