"use client";
import { Toast } from "@/component/Toast";
import { menuDashboard } from "@/utils/menu";
import { CircularProgress, LinearProgress } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [auth, setAuth] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setAuth(JSON.parse(sessionStorage.getItem("auth")));
    setIsLoading(false);
  }, [sessionStorage.getItem("auth")]);

  const onLogout = () => {
    sessionStorage.clear();
    setAuth({});
    Toast.fire({
      icon: "success",
      title: "Berhasil Logout",
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {auth && (
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
          <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-400 dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            {auth?.email}
            <code className="font-mono font-bold">, {auth?.role}</code>
          </p>
        </div>
      )}

      <div className="">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70]"
          src="/car.png"
          width={250}
          height={250}
          priority
        />
      </div>
      <div className="">
        <h1 className="text-4xl md:-mt-16 font-bold">RENT CAR APP</h1>
      </div>
      {isLoading && <CircularProgress />}

      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
        {menuDashboard?.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              setIsLoading(true);
              router.push(item.href);
            }}
            className="group mx-5 rounded-lg border border-transparent bg-blue-400 text-white dark:bg-gray-950 px-10 py-10 my-5 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:text-[gray] hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            <h2 className={`mb-3 text-2xl font-normal`}>
              {item.title.toUpperCase()}{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                {/* -&gt; */}
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50 font-thin`}>
              {item.desc}
            </p>
          </button>
        ))}

        {auth && (
          <button
            onClick={() => onLogout()}
            className="group mx-5 rounded-lg border border-transparent bg-blue-400 text-white dark:bg-gray-950 px-10 py-10 my-5 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:text-[gray] hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            <h2 className={`mb-3 text-2xl font-normal`}>
              Logout{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                {/* -&gt; */}
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50 font-thin`}>
              Logout user / admin
            </p>
          </button>
        )}
      </div>
    </main>
  );
}
