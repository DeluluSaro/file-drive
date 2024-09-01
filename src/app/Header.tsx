import { OrganizationSwitcher, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import React from 'react'

function Header() {
  return (
    <div className='border-b py-4 bg-gray-50'>
        <div className='container mx-auto flex justify-between items-center'>
EMPC
<div className='flex items-center gap-2'>
 <SignedOut>
  <SignInButton></SignInButton></SignedOut> 
<OrganizationSwitcher></OrganizationSwitcher>
<UserButton></UserButton>



</div>
        </div>
    </div>
  )
}

export default Header