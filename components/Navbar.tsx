import Image from 'next/image'
import Link from 'next/link';
import React from 'react'

const Navbar = () => {
  return (
    <div className="h-16 w-full px-8 py-2 flex justify-between items-center">
      <Link href="/dashboard" className="flex items-center gap-2 group">
        <Image
          src="/logo.svg"
          alt="LetterFox logo"
          width={56}
          height={56}
          className="transition-transform duration-200 group-hover:scale-105"
        />
        <h1 className="text-2xl font-semibold tracking-tight">
          Letter<span className="italic text-gray-800">Fox</span>
        </h1>
      </Link>

      <div className="flex items-center gap-3 hover:bg-gray-200 px-4 py-1 rounded-xl">
        <div className="w-10 h-10 rounded-full bg-green-500" />
        <div>
          <h1 className="text-lg font-semibold leading-tight">Zenitus</h1>
          <p className="text-sm text-gray-600">zenU@gmail.com</p>
        </div>
        
      </div>
    </div>
  );
}

export default Navbar