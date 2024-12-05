import NavBar from "@/components/shared/NavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-white dark:bg-zinc-800">
      <NavBar />
      <div>{children}</div>
    </div>
  );
}
