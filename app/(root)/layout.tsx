import NavBar from "@/components/shared/NavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {/* <NavBar /> */}
      <div>{children}</div>
    </div>
  );
}
