import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="h-screen-16 w-full">
      <main className="flex items-center justify-center bg-white">
        <div className='w-full text-center'>
          <Image src="/assets/landingpage.png" alt='landingpage' width={596} height={500} />
        </div>
        <div className="text-center w-full">
          <h1 className="text-4xl text-black font-bold mb-6">
            Connect with Farmers Worldwide
          </h1>
          <p className="text-xl text-black mb-8">
            KisanSphere is the premier social platform for farmers to share
            knowledge, resources, and grow together.
          </p>
          <div className="flex flex-col gap-4 items-center">
            <GoogleSignInButton width={70}/>
            <Link href="/sign-up" className="w-[70%]">
              <Button className="text-black h-12 w-full rounded-full flex justify-center items-center font-medium gap-2.5 border-2 border-black bg-white cursor-pointer transition-all duration-200 ease-in-out hover:border-[#2d79f3]" size="lg">Get Started</Button>
            </Link>
          </div>

          <div className="space-x-4 mt-10 text-center flex flex-col items-center">
            <p className='text-[11px] text-gray-500 w-[60%]'>
              By clicking Continue to join or sign in, you agree to SoilSocial <span className='text-blue-500 font-semibold'>User Agreement, Privacy Policy</span>, and <span className='text-blue-500 font-semibold'> Cookie Policy.</span>.
            </p>
            <p className='mt-3 text-black'>
              New to LinkedIn? <span className='text-blue-500 font-semibold hover:border-b-1 border-blue-500'>
                <Link href="/sign-in">
                  Sign In
                </Link></span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
