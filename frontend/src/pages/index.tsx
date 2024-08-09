import CreateTokenButton from '@/components/CreateTokenButton';
import { BASE_API_URL } from '@/constants';
import axios from 'axios';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>Collection Table</title>
        <meta name="description" content="Collection table created with Next.js, TypeScript, and Tailwind CSS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <VolumeChain />
        <div className="flex justify-between gap-12">
          <Gainers />
          <Losers />
        </div>
        <div className="flex justify-between gap-12">
          <Tokenize />
          <RealEstate />
        </div>
        <div className="flex justify-between gap-12">
          <MarketCapWiseTable />
          <Volume />
        </div>
      </main>
    </div>
  );
}

const Tokenize = () => {
  const [commodities, setCommodities] = useState<string[]>([])
  useEffect(() => {
    try {
      const fetchCommodities = async () => {
        const response = await axios.post(`${BASE_API_URL}/query`, { query: "Top 10 commodities to tokenize" });
        setCommodities(response.data.response.commodities);
      }
      fetchCommodities();
    } catch (err) {
      console.log(err);
    }

  }, [])
  return (
    <div className="flex-1 mt-[70px] overflow-x-auto">
      <h1 className="text-2xl font-bold text-center text-white mb-12">Top 10 commodities to tokenize</h1>
      <table className="min-w-full divide-y divide-slate-500">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">#</th>
            <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Commodity</th>
            <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Tokenize</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-500">
          {commodities.map((item, idx) => (
            <tr key={idx}>
              <td className="w-[60px] px-6 py-4 whitespace-nowrap">
                <div className="text-white">{idx + 1}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-white truncate w-[340px]">{item}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap w-[40px]">
                <div className={`flex text-white`}>
                  <CreateTokenButton label='Tokenize' className="bg-[#1d1d1d] rounded-lg" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  );
};

const VolumeChain = () => {
  const [volume, setVolume] = useState<{ name: string, "24hVolume": number, chain_count: number }[]>([])
  useEffect(() => {
    try {
      const fetchVolume = async () => {
        const response = await axios.post(`${BASE_API_URL}/query`, { query: "Top 10 by considering Volume and Less availability across multiple chains, opportunity to bridge and create liquidity in other chains" });
        setVolume(response.data.response);
      }
      fetchVolume();
    } catch (err) {
      console.log(err);
    }
  }, [])
  return (
    <div className="flex-1 mt-[20px] mb-[60px] overflow-x-auto">
      <h1 className="text-2xl font-bold text-center text-white mb-12">Top 10 By Opportunity To Create Crosschain Liquidity</h1>
      <table className="min-w-full divide-y divide-slate-500">
        <thead className="">
          <tr>
            <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">#</th>
            <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">24hr Vol</th>
            <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Count</th>
            <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Mint</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-500">
          {volume.map((item, idx) => (
            <tr className="" key={idx}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-white ">{idx + 1}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap w-[450px]">
                <div className="text-white truncate w-[400px]">{item.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-white ">${item['24hVolume'].toLocaleString()}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-white ">{item.chain_count}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap w-[40px]">
                <div className={`flex text-white`}>
                  <CreateTokenButton label='Mint wAsset' className="bg-[#1d1d1d] rounded-lg" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Volume = () => {
  const [volume, setVolume] = useState<{ name: string, "24hVolume": number }[]>([])
  useEffect(() => {
    try {
      const fetchVolume = async () => {
        const response = await axios.post(`${BASE_API_URL}/query`, { query: "Top 10 Volume" });
        setVolume(response.data.response);
      }
      fetchVolume();
    } catch (err) {
      console.log(err);
    }
  }, [])
  return (
    <div className="flex-1 mt-[70px] overflow-x-auto">
      <h1 className="text-2xl font-bold text-center text-white mb-12">Top 10 Volume</h1>
      <table className="min-w-full divide-y divide-slate-500">
        <thead className="">
          <tr>
            <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">#</th>
            <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Change</th>
            <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Mint</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-500">
          {volume.map((item, idx) => (
            <tr className="" key={idx}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-white ">{idx + 1}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-white w-[200px] truncate">{item.name}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-white ">${item['24hVolume'].toLocaleString()}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap w-[40px]">
                <div className={`flex text-white`}>
                  <CreateTokenButton label='Mint wAsset' className="bg-[#1d1d1d] rounded-lg" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Gainers = () => {
  const [gainers, setGainers] = useState<{ name: string, change: number }[]>([])
  useEffect(() => {
    try {
      const fetchGainers = async () => {
        const response = await axios.post(`${BASE_API_URL}/query`, { query: "Top 10 Gainers" });
        setGainers(response.data.response);
      }
      fetchGainers();
    } catch (err) {
      console.log(err);
    }
  }, [])
  return (
    <div className="flex-1 mt-[20px] overflow-x-auto">
      <h1 className="text-2xl font-bold text-center text-white mb-12">Top 10 Gainers</h1>
      <table className="min-w-full divide-y divide-slate-500">
        <thead className="">
          <tr>
            <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">#</th>
            <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Change</th>
            <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Mint</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-500">
          {gainers.map((item, idx) => (
            <tr className="" key={idx}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-white ">{idx + 1}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-white ">{item.name}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`flex gap-2 ${item.change < 0 ? 'text-red-500' : 'text-green-500'}`}>{item.change < 0 ? <DecreaseIcon /> : <GrowthIcon />}{item.change}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap w-[40px]">
                <div className={`flex text-white`}>
                  <CreateTokenButton label='Mint wAsset' className="bg-[#1d1d1d] rounded-lg" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Losers = () => {
  const [losers, setLosers] = useState<{ name: string, change: number }[]>([])
  useEffect(() => {
    try {
      const fetchLosers = async () => {
        const response = await axios.post(`${BASE_API_URL}/query`, { query: "Top 10 Losers" });
        setLosers(response.data.response);
      }
      fetchLosers();
    } catch (err) {
      console.log(err);
    }
  }, [])
  return (
    <div className="flex-1 mt-[20px] overflow-x-auto">
      <h1 className="text-2xl font-bold text-center text-white mb-12">Top 10 Losers</h1>
      <table className="min-w-full divide-y divide-slate-500">
        <thead className="">
          <tr>
            <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">#</th>
            <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Change</th>
            <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Mint</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-500">
          {losers.map((item, idx) => (
            <tr className="" key={idx}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-white ">{idx + 1}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-white ">{item.name}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`flex gap-2 ${item.change < 0 ? 'text-red-500' : 'text-green-500'}`}>{item.change < 0 ? <DecreaseIcon /> : <GrowthIcon />}{item.change}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap w-[40px]">
                <div className={`flex text-white`}>
                  <CreateTokenButton label='Mint wAsset' className="bg-[#1d1d1d] rounded-lg" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const RealEstate = () => {
  const data = [
    { city: "Amritsar", office: false, residential: true, warehousing: false, retail: false },
    { city: "Ayodhya", office: false, residential: true, warehousing: false, retail: false },
    { city: "Coimbatore", office: true, residential: false, warehousing: false, retail: true },
    { city: "Dwarka", office: false, residential: true, warehousing: false, retail: false },
    { city: "Indore", office: true, residential: false, warehousing: false, retail: true },
    { city: "Jaipur", office: false, residential: true, warehousing: false, retail: true },
    { city: "Kanpur", office: false, residential: true, warehousing: false, retail: true },
    { city: "Kochi", office: false, residential: true, warehousing: true, retail: false },
    { city: "Lucknow", office: false, residential: true, warehousing: false, retail: false },
    { city: "Nagpur", office: false, residential: false, warehousing: false, retail: false },
    { city: "Patna", office: false, residential: false, warehousing: false, retail: false },
    { city: "Puri", office: false, residential: true, warehousing: false, retail: false },
    { city: "Shirdi", office: false, residential: true, warehousing: false, retail: false },
    { city: "Surat", office: true, residential: false, warehousing: true, retail: true },
    { city: "Tirupati", office: false, residential: true, warehousing: false, retail: false },
    { city: "Varanasi", office: false, residential: true, warehousing: false, retail: false },
    { city: "Visakhapatnam", office: false, residential: true, warehousing: false, retail: false },
  ];
  return (
    <div className="flex-1 mt-[70px] overflow-x-auto">
      <h1 className="text-2xl truncate font-bold text-center text-white mb-12">Top 10 Real Estate Tokenization Opportunities</h1>
      <table className="min-w-full divide-y divide-slate-500">
        <thead className="">
          <tr>
            <th className="pl-2 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">City</th>
            <th className="px-1 py-3 text-center font-bold text-gray-500 uppercase tracking-wider">Office</th>
            <th className="px-1 py-3 text-center font-bold text-gray-500 uppercase tracking-wider">Residential</th>
            <th className="px-1 py-3 text-center font-bold text-gray-500 uppercase tracking-wider">Warehousing</th>
            <th className="px-1 py-3 text-center font-bold text-gray-500 uppercase tracking-wider">Retail</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-500">
          {data.map((item, idx) => (
            <tr key={idx}>
              <td className="px-1 py-4 w-[150px] whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-white w-[150px] truncate">{item.city}</div>
                </div>
              </td>
              <td className="px-1 py-4 whitespace-nowrap">
                <div className="flex items-center justify-center">
                  <div className="text-white ">{item.office ? '✓' : ''}</div>
                </div>
              </td>
              <td className="px-1 py-4 whitespace-nowrap">
                <div className="flex items-center justify-center">
                  <div className="text-white ">{item.residential ? '✓' : ''}</div>
                </div>
              </td>
              <td className="px-1 py-4 whitespace-nowrap">
                <div className="flex items-center justify-center">
                  <div className="text-white ">{item.warehousing ? '✓' : ''}</div>
                </div>
              </td>
              <td className="px-1 py-4 whitespace-nowrap">
                <div className="flex items-center justify-center">
                  <div className="text-white ">{item.retail ? '✓' : ''}</div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const MarketCapWiseTable = () => {
  const [marketCapWise, setMarketCapWise] = useState<{ name: string, marketCap: number }[]>([])
  useEffect(() => {
    try {
      const fetchMarketCapWise = async () => {
        const response = await axios.post(`${BASE_API_URL}/query`, { query: "Top 10 token Market Cap Wise" });
        setMarketCapWise(response.data.response);
      }
      fetchMarketCapWise();
    } catch (err) {
      console.log(err);
    }
  }, [])
  return (
    <div className="flex-1 mt-[70px] mb-[100px] overflow-x-auto">
      <h1 className="text-2xl font-bold text-center text-white mb-12">Top 10 token Market Cap Wise</h1>
      <table className="min-w-full divide-y divide-slate-500">
        <thead className="">
          <tr>
            <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">#</th>
            <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">MarketCap</th>
            <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Mint</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-500">
          {marketCapWise.map((item, idx) => (
            <tr className="" key={idx}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-white ">{idx + 1}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-white w-[180px] truncate">{item.name}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-white ">${item.marketCap.toLocaleString()}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap w-[40px]">
                <div className={`flex text-white`}>
                  <CreateTokenButton label='Mint wAsset' className="bg-[#1d1d1d] rounded-lg" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

function GrowthIcon() {
  return <>
    <svg stroke="currentColor"
      fill="currentColor"
      stroke-width="0"
      viewBox="0 0 512 512"
      height="20px"
      width="20px"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M253.8 15.56l-79.9 84.11 2.3 58.83 50.6 36.2 31.9 182 10.8-26.9 11.8-235.4 18.7 1-9.1 181 28.3-70.8 8.2-108 .9-17.93zm139 50.57l-46.6 50.77-3.9 51.1 10.6-26.2 30.4-13.7c3.2-20.6 6.3-41.3 9.5-61.97zm60.3 51.17l-85.7 38.4-102.6 255.9 14.6 83.3h7.8l147.6-293.1 16.7 8.4-143.4 284.7h24.4l146.6-291.8zm-340.2 18.9l-54.11 99.1 69.11 259.6h93.6l-51.1-274.8 18.3-3.4 51.8 278.2h19.9l-50.7-289.4zm358.3 260.4l-65.8-5.2-49.8 99.2 69.8-36.7zm-435.96-28l42.47 126.7h30.99L80.6 389.9z"></path>
    </svg>
  </>
}

function DecreaseIcon() {
  return <>
    <svg stroke="currentColor"
      fill="currentColor"
      stroke-width="0"
      viewBox="0 0 320 512"
      height="20px"
      width="20px"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M143 256.3L7 120.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0L313 86.3c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.4 9.5-24.6 9.5-34 .1zm34 192l136-136c9.4-9.4 9.4-24.6 0-33.9l-22.6-22.6c-9.4-9.4-24.6-9.4-33.9 0L160 352.1l-96.4-96.4c-9.4-9.4-24.6-9.4-33.9 0L7 278.3c-9.4 9.4-9.4 24.6 0 33.9l136 136c9.4 9.5 24.6 9.5 34 .1z"></path>
    </svg>
  </>
}
