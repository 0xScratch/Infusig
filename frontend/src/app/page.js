import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex items-center justify-center gap-x-32 m-28 ml-32">
      <div className="w-1/2">
        <h2 className="text-lg uppercase text-[#44bcaa] font-bold mb-5">Built on OP. Powered by you.</h2>
        <h1 className="text-6xl text-white font-bold mb-8">The Future of Crypto Portfolios is <span className="text-[#44bcaa]">Here!</span></h1>
        <p className="text-sm text-gray-300 mb-12">A decentralized platform to explore curated portfolios and unlock the power of crypto diversification</p>
        <button className="bg-[#44bcaa] hover:bg-[#3d9c8e] text-black font-bold py-2 px-4 rounded-3xl m-2">
          <Link href="/browse-portfolios">Explore Portfolios</Link>
        </button>
        <button className="bg-[#06071b] text-[#44bcaa] font-bold py-2 px-4 rounded-3xl m-2" style={{ outline: '2px solid #44bcaa' }}>
          <Link href='https://docs.optimism.io/builders/tools/build/faucets'>Get ETH from Faucet</Link>
        </button>
      </div>
      <div className="w-1/2">
        <Image className="" src="/hero.jpg" alt="Animation or Image" width={700} height={500} />
      </div>
    </main>
  );
}