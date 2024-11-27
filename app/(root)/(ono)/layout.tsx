import Hero from "@/components/shared/Hero";
import NavBar from "@/components/shared/NavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <NavBar />
      <Hero />
      <div>{children}</div>
    </div>
  );
}
