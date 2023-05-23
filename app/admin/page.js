"use client";
import { Toast } from "@/component/Toast";
import { env } from "@/next.config";
import axios from "axios";
import { redirect } from "next/dist/server/api-utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const [payload, setPayload] = React.useState({
    email: "",
    password: "",
    role: 'admin'
  });

  useEffect(() => {
    if(sessionStorage.getItem('auth')) {
      Toast.fire({
        icon: 'info',
        title: 'Logout terlebih dahulu'
      })
      router.replace('/')
    }
  }, [])

  const onChange = (e, key) => {
    setPayload({
      ...payload,
      [key]: e?.target?.value,
    });
  };

  const onSubmit = async () => {
    console.log("submit!");
    console.log("payload", payload);
    console.log("payload stringify", JSON.stringify(payload));

    let url = `${env.API_HOST}/admin/login`;

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
        title: `${res.data.Email} sebagai admin`
      })
      router.replace('/')
    })
    .catch(err => {
      console.log('error', err.message)
      Toast.fire({
        icon: 'error',
        title: 'username atau password salah'
      })
    })
  };

  return (
    <section className="h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0">
      <div className="md:w-1/3 max-w-sm">
        <img src="/car.png" alt="Sample image" />
        <div className="">
          <h1 className="text-center dark:text-white text-4xl -mt-14 font-black">
            LOGIN ADMIN
          </h1>
        </div>
      </div>
      <div className="md:w-1/3 max-w-sm">
        <input
          onChange={(e) => onChange(e, "email")}
          className="text-sm text-[gray] w-full px-4 py-2 border border-solid border-gray-300 rounded"
          type="text"
          placeholder="Email Address"
        />
        <input
          onChange={(e) => onChange(e, "password")}
          className="text-sm text-[gray] w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
          type="password"
          placeholder="Password"
        />

        <div className="text-center md:text-left">
          <button
            onClick={() => onSubmit()}
            className="mt-4 bg-blue-400 hover:bg-blue-500 px-4 py-2 text-white uppercase rounded text-xs tracking-wider w-full"
            type="submit"
          >
            Login
          </button>
        </div>
        <div className="mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
          Don't have an account?{" "}
          <Link
            className="text-red-600 hover:underline hover:underline-offset-4"
            href="/admin/register"
          >
            Register
          </Link>
        </div>
      </div>
    </section>
  );
}
