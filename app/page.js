"use client";

import axios from "axios";
import { useState } from "react";

import Image from "next/image";

export default function Home() {
  const [url, setUrl] = useState("");
  const [downloadflag, setDownloadflag] = useState(false);
  const [HDdownloadurl, setHDdownloadurl] = useState("");
  const [SDdownloadurl, setSDdownloadurl] = useState("");
  const [audioDownloadUrl, setAudioDownloadUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("https://assets.nflxext.com/ffe/siteui/vlv3/ff5587c5-1052-47cf-974b-a97e3b4f0656/c2e7edb5-54a9-4f1b-896c-d9edcfcc2420/BD-en-20240506-popsignuptwoweeks-perspective_alpha_website_large.jpg");

  const options = {
    method: "POST",
    url: "https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": "10ce9c4267msha639dae37dabea5p10164ejsn4ddf4732589b",
      "X-RapidAPI-Host": "social-download-all-in-one.p.rapidapi.com",
    },
    data: {
      url: url,
    },
  };

  const handleDownload = async () => {
    try {
      const response = await axios.request(options);

      if (response) {
        setDownloadflag(true);
        console.log(response.data);
        setHDdownloadurl(response.data.medias[0].url);
        setSDdownloadurl(response.data.medias[1].url);
        setAudioDownloadUrl(response.data.medias[2].url);
        setThumbnail(response.data.thumbnail);
      } else {
        alert("Invalid URL");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-5xl font-bold">Free Online Video Downloader - Download Video from anywhere..</h1>
      <p className="text-lg mt-4">Download videos from Facebook, Instagram, Twitter, and more than 80+ Platforms in High Quality Media.</p>
      <input
        type="text"
        placeholder="Search"
        className="w-1/2 mt-5 p-2 border border-gray-300 rounded-lg text-black"
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={handleDownload} className="bg-white text-black p-2 rounded-lg mt-4"> Download </button>
      {downloadflag && (
        <>
        <div className="flex flex-row items-center mt-4">
          <a href={HDdownloadurl} target="_blank" download className="bg-red-600 mr-5 text-white p-2 rounded-lg mt-4">Download in HD</a>
          <a href={SDdownloadurl} target="_blank" download className="bg-red-600 mr-5 text-white p-2 rounded-lg mt-4">Download in SD</a>
          <a href={audioDownloadUrl} target="_blank" download className="bg-red-600 text-white p-2 rounded-lg mt-4">Download Audio</a>
        </div>

        <img src={thumbnail} alt="thumbnail" className="mt-4 rounded-lg"style={{ width: "40%", height: "auto", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }} />
        </>
      )}
    </main>
  );
}