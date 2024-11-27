import NavBar from "@/components/shared/NavBar";
import SideNav from "@/components/shared/SideNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavBar />
      <SideNav
        children={<div className="max-md:-mt-8 mt-5 w-full">{children}</div>}
      />
    </>
  );
}
