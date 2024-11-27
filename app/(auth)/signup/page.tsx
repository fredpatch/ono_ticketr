"use client";

import InputBox from "@/components/shared/InputBox";
import { BlockInTextCard } from "@/components/shared/TypeWriterAnimation";
import { useAuth } from "@/context/AuthContext";
import { googleIcon } from "@/public/imgs";
import { IconAt, IconLock, IconUser } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const SignUpPage = () => {
  const { signup, userAuth } = useAuth();
  const [formData, setFormData] = React.useState({
    fullname: "",
    email: "",
    password: "",
  });
  const access_token = userAuth?.access_token;
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signup(formData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!access_token) {
      return router.push("/signup");
    }
    return router.push("/");
  }, [access_token]);

  return (
    <>
      <section className="flex items-center justify-center h-cover">
        {/* Toaster  with a timeout of 3000ms wait the taost to finish then redirect*/}
        <form id="formElement" className="w-full max-w-[600px]">
          <div className="mb-24 text-center capitalize font-gelasio">
            <BlockInTextCard
              examples={[
                "Sign Up Now",
                "Enregistrer vous gratuitement!",
                "S'inscrire gratuitement!",
                "New here ?",
              ]}
            />
          </div>

          <InputBox
            name={"fullname"}
            type={"text"}
            placeholder={"Full Name"}
            onChange={handleChange}
            icon={<IconUser />}
          />

          <InputBox
            name="email"
            type="email"
            icon={<IconAt />}
            placeholder="Email"
            onChange={handleChange}
          />

          <InputBox
            name="password"
            type="password"
            icon={<IconLock />}
            placeholder="Password"
            onChange={handleChange}
          />

          <button
            type="submit"
            onClick={handleSubmit}
            className="btn-dark center mt-14"
          >
            Sign Up
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
            Vous avez déjà un compte ?
            <Link href="/signin" className="ml-1 text-xl text-black underline">
              Connectez-vous ici.
            </Link>
          </p>
        </form>
      </section>
    </>
  );
};

export default SignUpPage;
