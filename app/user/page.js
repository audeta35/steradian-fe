"use client"
import { Toast } from "@/component/Toast"
import { env } from "@/next.config"
import { LinearProgress } from "@mui/material"
import axios from "axios"
import Link from "next/link"
import React, { useEffect } from "react"

export default function Page() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [payload, setPayload] = React.useState({
    email: '',
    password: '',
    role: 'user'
  })

  React.useEffect(() => {
    setIsLoading(false)
  }, [])

  const onChange = (e, key) => {
    setPayload({
      ...payload,
      [key]: e?.target?.value
    })
  }

  const onSubmit = async () => {
    console.log("submit!");
    console.log("payload", payload);
    console.log("payload stringify", JSON.stringify(payload));

    let url = `${env.API_HOST}/admin/login`;
    setIsLoading(true)

    axios({
      method: 'POST',
      url: url,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(payload)
    })
      .then(res => {
        console.log('res', res.data)
        sessionStorage.setItem('auth', JSON.stringify(payload))

        Toast.fire({
          icon: 'success',
          title: `${res.data.Email} sebagai user`
        })
        router.replace('/')
        setIsLoading(false)
      })
      .catch(err => {
        console.log('error', err)
        Toast.fire({
          icon: 'error',
          title: 'username atau password salah'
        })
        setIsLoading(false)

      })
  };

  return (
    <section className="h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0">
      <div className="md:w-1/3 max-w-sm">
        {isLoading &&
          <LinearProgress />
        }
        <img
          src="/car.png"
          alt="Sample image" />
        <div className="">
          <h1 className="text-center dark:text-white text-4xl -mt-14 font-black">LOGIN USER</h1>
        </div>
      </div>
      <div className="md:w-1/3 max-w-sm">
        <input onChange={(e) => onChange(e, 'email')} className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded" type="text" placeholder="Email Address" />
        <input onChange={(e) => onChange(e, 'password')} className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4" type="password" placeholder="Password" />

        <div className="text-center md:text-left">
          <button onClick={() => onSubmit()} className="mt-4 bg-blue-400 hover:bg-blue-500 px-4 py-2 text-white uppercase rounded text-xs tracking-wider w-full" type="submit">Login</button>
        </div>
        <div className="mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
          Don't have an account? <Link className="text-red-600 hover:underline hover:underline-offset-4" href="/user/register">Register</Link>
        </div>
      </div>
    </section>
  )
}