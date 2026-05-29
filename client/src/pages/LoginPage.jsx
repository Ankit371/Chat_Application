import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {
  const [mode, setMode] = useState('signup')
  const [isBioStep, setIsBioStep] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [bio, setBio] = useState('')
  const [agreed, setAgreed] = useState(false)

  const navigate = useNavigate()
  const { login, signUp } = useContext(AuthContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    if (mode === 'signup' && !isBioStep) {
      setIsBioStep(true)
      return
    }

    if (mode === 'signup') {
      if (!agreed) {
        toast.error('Please agree to terms and conditions before continuing.')
        return
      }

      const data = await signUp({ fullName, email, password, bio })

      if (data.success) {
        setMode('login')
        setIsBioStep(false)
        setAgreed(false)
        setFullName('')
        setEmail('')
        setPassword('')
        setBio('')
        navigate('/login')
      }

      return
    }

    login('login', { email, password })
  }

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setIsBioStep(false)
    setAgreed(false)
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center
    gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      <img src={assets.logo_big} alt='' className='w-[min(30vw,250px)]' />

      <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex
       flex-col gap-6 rounded-lg shadow-lg'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {mode === 'signup' ? 'Sign up' : 'Login'}
          {isBioStep && (
            <img
              onClick={() => setIsBioStep(false)}
              src={assets.arrow_icon}
              alt='Back'
              className='w-5 cursor-pointer'
            />
          )}
        </h2>

        {mode === 'signup' && !isBioStep && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type='text'
            className='p-2 border border-gray-500 rounded-md focus:outline-none'
            placeholder='Full Name'
            required
          />
        )}

        {!isBioStep && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type='email'
              placeholder='Email Address'
              required
              className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type='password'
              placeholder='Enter your password'
              required
              className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />
          </>
        )}

        {mode === 'signup' && isBioStep && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-50'
            placeholder='Provide a short bio...'
            required
          ></textarea>
        )}

        <button
          type='submit'
          className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'
        >
          {mode === 'signup'
            ? isBioStep
              ? 'Complete Registration'
              : 'Continue'
            : 'Login Now'}
        </button>

        {mode === 'signup' && (
          <div className='flex items-center gap-2 text-sm text-gray-500'>
            <input
              type='checkbox'
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className='h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500'
            />
            <label className='cursor-pointer'>Agree To Terms And Condition</label>
          </div>
        )}

        <div className='flex flex-col gap-2'>
          {mode === 'signup' ? (
            <p className='text-sm text-gray-600'>
              Already have an Account{' '}
              <span
                className='font-medium text-violet-500 cursor-pointer'
                onClick={() => switchMode('login')}
              >
                Login Here
              </span>
            </p>
          ) : (
            <p className='text-sm text-gray-600'>
              Create an Account{' '}
              <span
                className='font-medium text-violet-500 cursor-pointer'
                onClick={() => switchMode('signup')}
              >
                Click Here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default LoginPage