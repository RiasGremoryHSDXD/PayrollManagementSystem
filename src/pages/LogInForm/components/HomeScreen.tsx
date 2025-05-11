import { useState } from 'react';
import '../css/HSheader.css'
import '../css/HSmain.css'
import '../css/HSaside.css'

export default function HomeScreen (){

    const [showAside, setShowAside] = useState(false); //For responsive purpose (Aside will become a drop down once reaches a certain px size) sheesh

    return (

        <div className="flex w-full flex-col gap-3 h-full">
            <header className='flex border-2 border-red-500 h-[15%] items-center justify-center'>
                <p >This is the header</p>
            </header>

            <main className='flex flex-row md:flex-row gap-1 min-h-0 flex-1 overflow-auto'>
                <button 
                    className="md:hidden p-2 bg-gray-200 text-center"
                    onClick={() => setShowAside(!showAside)}
                    >
                    {showAside ? 'Hide Menu' : 'Show Menu'}
                </button>

                <div className={" ${showAside ? 'block' : 'hidden' } md:flex items-center justify-center border-amber-300 border-2 md:w-[30%] h-full"}>
                    <p>This area is Aside</p>
                </div>  
                <div className='flex items-center justify-center border-2 border-blue-700 w-full'>
                    <p>This is the Main</p>
                </div>
            </main>

            <footer className='border-2 flex items-center justify-center h-[10%]'>
                <p>The Footer Area</p>
            </footer>
        </div>
        
    );



}