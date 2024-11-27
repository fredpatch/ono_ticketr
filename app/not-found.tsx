// pages/404.tsx

import Link from "next/link";

import {
  error,
  error_dark,
  error_light,
  full_logo,
  full_logo_dark,
  full_logo_light,
  logo_dark,
  logo_light,
} from "@/public/imgs";
import Image from "next/image";

export default function NotFound() {
  return (
    <section className="h-cover relative p-10 flex flex-col items-center gap-20 text-center">
      <Image
        src={error}
        alt="error"
        className="select-none border-2 border-gray-300 w-72 aspect-square object-cover rounded-md"
      />
      <h1 className="text-4xl font-gelasio capitalize leading-7">
        page not found
      </h1>
      <p className="text-xl text-gray-500">
        It seems that the page you are looking for does not exist. Go back to
        the{" "}
        <Link className="underline text-black text-xl" href="/">
          home page
        </Link>
        .
      </p>
      <div className="mt-auto">
        <Image
          src={full_logo}
          alt="logo"
          className="h-72 object-contain block mx-auto select-none"
        />
        <p className="text-sm text-dark-grey">ASDevelopment &copy; 2024</p>
      </div>
    </section>
  );
}
