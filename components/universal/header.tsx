import React from 'react';
import SearchBar from './search_bar';
import { logout, useAuthContext } from '@/context/AuthContext';

export default function Header(){
  const {user, loading} = useAuthContext();

  return(
    <>
      <div>
        <nav className="bg-nf_green px-2 sm:px-3 py-8 w-full flex items-center justify-between">
            <div>
              <a href="#" className="flex items-end">
                <img></img>
                <span className="font-inter text-4xl text-nf_yellow font-bold ml-3">Nutrifit</span>
                <span className="text-2xl font-bold font-inter ml-3">Wellness Hub</span>
              </a>
            </div>

            <div>
              <SearchBar/>
            </div>

            <div>
              <ul className="flex">
                <li>
                  <a href="" className="block m-2 text-2xl font-bold font-inter">Products</a>
                </li>
                <li>
                  <a href="" className="block m-2 text-2xl font-bold font-inter">Cart</a>
                </li>
                <li>
                  <button id="profileDropdown" data-dropdown-toggle="dropdown" className="block m-2 text-2xl font-bold font-inter">Profile</button>
                    <div>
                      <ul aria-labelledby="profileDropdown">
                        <li>
                          {
                            user ? (
                              <>
                                <button onClick={logout}> Signout</button>
                              </>
                            ) : null
                          }

                        </li>
                      </ul>
                    </div>
                </li>
              </ul>
            </div>
        </nav>
      </div>
    </>
  )
}