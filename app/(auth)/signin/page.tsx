"use client";

import InputBox from "@/components/shared/InputBox";
import { BlockInTextCard } from "@/components/shared/TypeWriterAnimation";
import { useAuthV3 } from "@/app/api/AuthProviderV3";
import { googleIcon } from "@/public/imgs";
import useAuthStore, { getAuthStore } from "@/store/store";
import { IconAt, IconLock } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const SignInPage = () => {
  const { login } = useAuthV3();
  // const { login, user } = contextValue;
  const { access_token } = useAuthStore();
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  // const access_token = userAuth?.access_token;
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // await signin(formData);
      await login(formData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!access_token) {
      return router.push("/signin");
    }
    return router.push("/");
  }, [access_token]);

  return (
    <>
      <section className="flex items-center justify-center h-cover bg-white dark:bg-zinc-800">
        {/* Toaster  with a timeout of 3000ms wait the taost to finish then redirect*/}
        <form id="formElement" className="w-full max-w-[600px]">
          <div className="mb-24 text-center capitalize font-gelasio">
            <BlockInTextCard
              examples={[
                "Welcome Back",
                "Sign in to your account",
                "Connectez vous à votre compte",
                "Already have an account ?",
              ]}
            />
          </div>

          <InputBox
            name="email"
            type="email"
            icon={<IconAt className="dark:text-zinc-700" />}
            placeholder="Email"
            onChange={handleChange}
          />

          <InputBox
            name="password"
            type="password"
            icon={<IconLock className="dark:text-zinc-700" />}
            placeholder="Password"
            onChange={handleChange}
          />

          <button
            type="submit"
            onClick={handleSubmit}
            className="btn-dark center mt-14"
          >
            Sign In
          </button>

          <div className="relative flex items-center w-full gap-2 my-10 font-bold text-black uppercase opacity-10">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button
            className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
            // onClick={handleAuthWithGoogle}
          >
            <Image src={googleIcon} alt="google icon" className="w-5" />
            Continue with Google
          </button>

          <p className="mt-6 text-xl text-center text-dark-grey">
            Vous n'avez pas de compte ?
            <Link
              href="/signup"
              className="ml-1 text-xl text-black dark:text-zinc-300 underline"
            >
              Creer un compte
            </Link>
          </p>
        </form>
      </section>
    </>
  );
};

export default SignInPage;
