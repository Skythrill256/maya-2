import { NavBar } from "./_components/Navbar";


const layout = ({ children }: { children: React.ReactNode }) => {
  return <>
    <NavBar />
    {children}</>;
};

export default layout;
