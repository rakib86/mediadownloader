"use client"

import axios from "axios";
import { useState } from "react";
import Image from "next/image";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI('AIzaSyDqjTpZuQfcACEUVIrXNRlZdOBXl9k5PnI');

export default function Home() {
  const [url, setUrl] = useState("");
  const [downloadflag, setDownloadflag] = useState(false);
  const [HDdownloadurl, setHDdownloadurl] = useState("");
  const [SDdownloadurl, setSDdownloadurl] = useState("");
  const [audioDownloadUrl, setAudioDownloadUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("https://cdn.dribbble.com/userupload/5341183/file/original-274014163a821d22ec826f513fd7201b.gif");
  const [answer, setAnswer] = useState(""); // State to hold the answer from Gemini AI

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




  const askqn = async () => {



    if (url.includes("youtube.com/watch?v=")) { // Check if the URL is a YouTube link
      const videoId = url.split("v=")[1].split("&")[0]; // Extract video ID from URL

      const options2 = {
        method: 'GET',
        url: 'https://youtube-transcriptor.p.rapidapi.com/transcript',
        params: {
          video_id: videoId,
          lang: 'en'
        },
        headers: {
          'x-rapidapi-key': 'efae2b562emsh44fbf23a7ef4facp1be0ecjsn5449cfe22770',
          'x-rapidapi-host': 'youtube-transcriptor.p.rapidapi.com'
        }
      };
      
      try {
        const response = await axios.request(options2);
        console.log(response);
        const caption = await response.data[0].transcriptionAsText;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
        const result = await model.generateContent("Summarize the text and give output in 4 line with easy words: " + caption);	
        const text = await result.response.text();
        console.log(text);
        setAnswer(text); // Set the answer to state
      } catch (error) {
        console.error(error);
      }
     
  
    }

    
   

  }

  const handleDownload = async () => {
    if (url.startsWith("Q:")) { // Check if the input is a question
      const question = url.substring(2).trim(); // Remove the "Q:" part
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
        const result = await model.generateContent(question);
        const response = await result.response;
        const text = await response.text();
        console.log(text);
        setAnswer(text); // Set the answer to state
      } catch (error) {
        console.error(error);
      }
    } else {
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
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-5xl text-white font-bold">Free Online Video Downloader - Download Video from anywhere..</h1>
      <p className="text-lg text-white mt-4">Download videos from Facebook, Instagram, Twitter, and more than 80+ Platforms in High Quality Media.</p>
      <input
        type="text"
        placeholder="Search"
        className="w-1/2 mt-5 p-2 border border-gray-300 rounded-full bg-black text-white"
        onChange={(e) => setUrl(e.target.value)}
      />

      <div classname="flex flex-row">
    
      <button onClick={handleDownload} className="relative mt-10 mr-5 inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              Download video 🙂
            </span>
          </button> 
      
      <button onClick={askqn}  className="relative mt-10 inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              Explain video ⚡
            </span>
          </button> 
          </div>

          <p className="text-lg text-white mt-4">{answer}</p>
      
      {downloadflag && (
        <>
          <div className="flex flex-row items-center mt-4">
            <a href={HDdownloadurl} target="_blank" download className="bg-red-600 mr-5 text-white p-2 rounded-lg mt-4">Download in HD</a>
            <a href={SDdownloadurl} target="_blank" download className="bg-red-600 mr-5 text-white p-2 rounded-lg mt-4">Download in SD</a>
            <a href={audioDownloadUrl} target="_blank" download className="bg-red-600 text-white p-2 rounded-lg mt-4">Download Audio</a>
          </div>
          <img src={thumbnail} alt="thumbnail" className="mt-4 rounded-lg" style={{ width: "40%", height: "auto", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }} />
        </>
      )}
      {!downloadflag && (
        <video autoPlay loop muted className="mt-4" style={{ width: "40%", height: "auto", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", borderRadius: "10px" }}>
          <source src="https://cdn.dribbble.com/userupload/12557773/file/original-65a5b0ce8d6f5cf1c65d5749797ff875.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      
      <div className="mt-8">
        <h2 className="text-2xl text-white font-bold mb-4">All resources</h2>
        <div className="grid grid-cols-4 gap-4">
          <a href="https://facebook.com" target="_blank" className="flex flex-col items-center">
            <Image src="/icons8-facebook-48.png" alt="Facebook" width={48} height={48} />
            <span className="text-white mt-2">facebook.com</span>
          </a>
          <a href="https://instagram.com" target="_blank" className="flex flex-col items-center">
            <Image src="/icons8-instagram-48.png" alt="Instagram" width={48} height={48} />
            <span className="text-white mt-2">instagram.com</span>
          </a>
          <a href="https://youtube.com" target="_blank" className="flex flex-col items-center">
            <Image src="/icons8-youtube-48.png" alt="YouTube" width={48} height={48} />
            <span className="text-white mt-2">youtube.com</span>
          </a>
          <a href="https://twitter.com" target="_blank" className="flex flex-col items-center">
            <Image src="/icons8-twitter-48.png" alt="Twitter" width={48} height={48} />
            <span className="text-white mt-2">twitter.com</span>
          </a>
          <a href="https://dailymotion.com" target="_blank" className="flex flex-col items-center">
            <Image src="/icons8-dailymotion-48.png" alt="Dailymotion" width={48} height={48} />
            <span className="text-white mt-2">dailymotion.com</span>
          </a>
          <a href="https://vimeo.com" target="_blank" className="flex flex-col items-center">
            <Image src="/icons8-vimeo-48.png" alt="Vimeo" width={48} height={48} />
            <span className="text-white mt-2">vimeo.com</span>
          </a>
          <a href="https://vk.com" target="_blank" className="flex flex-col items-center">
            <Image src="/icons8-vk-48.png" alt="VK" width={48} height={48} />
            <span className="text-white mt-2">vk.com</span>
          </a>
          <a href="https://soundcloud.com" target="_blank" className="flex flex-col items-center">
            <Image src="/icons8-soundcloud-48.png" alt="SoundCloud" width={48} height={48} />
            <span className="text-white mt-2">soundcloud.com</span>
          </a>
          <a href="https://tiktok.com" target="_blank" className="flex flex-col items-center">
            <Image src="/icons8-tik-tok-48.png" alt="TikTok" width={48} height={48} />
            <span className="text-white mt-2">tiktok.com</span>
          </a>
          <a href="https://reddit.com" target="_blank" className="flex flex-col items-center">
            <Image src="/icons8-reddit-48.png" alt="Reddit" width={48} height={48} />
            <span className="text-white mt-2">reddit.com</span>
          </a>
          <a href="https://threads.net" target="_blank" className="flex flex-col items-center">
            <Image src="/icons8-threads-48.png" alt="Threads" width={48} height={48} />
            <span className="text-white mt-2">Threads</span>
          </a>
        </div>
      </div>
    </main>
  );
}
