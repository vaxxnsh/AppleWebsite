import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useState } from "react";
import { heroVideo, smallHeroVideo } from "../utils";
import { useEffect } from "react";

const Hero = () => {

    const [videoSrc,setVideoSrc] = useState(window.innerWidth < 760 ? smallHeroVideo : heroVideo)

    

    useEffect(()=>{

        const handleVideoSrcSet = () => {
            console.log(window.innerWidth);
            if (window.innerWidth < 760 && videoSrc !== smallHeroVideo) {
                setVideoSrc(smallHeroVideo);
            } else if (window.innerWidth >= 760 && videoSrc !== heroVideo) {
                setVideoSrc(heroVideo);
            }
        };

        window.addEventListener('resize',handleVideoSrcSet)

        return () => {
            window.removeEventListener('resize',handleVideoSrcSet)
        }
    },[videoSrc])

    useGSAP(()=>{
        gsap.to('#hero',{
            opacity : 1,
            delay : 2
        })
        gsap.to('#cta',{
            opacity : 1,
            y: -50,
            delay : 2
        })
    },[])
  return (
    <section className="w-full nav-height bg-black relative">
        <div className="h-5/6 w-full flex-center flex-col">
            <p id='hero' className="hero-title">iPhone 15 Pro</p>
            <div className="md:w-10/12 w-8/12">
                <video autoPlay muted playsInline={true} key={videoSrc} className="pointer-events-none" loop>
                    <source src={videoSrc} type="video/mp4"/>
                </video>
            </div>
        </div>

        <div id='cta' className="flex flex-col items-center opacity-0 translate-y-20">
            <a href="#highlights" className="btn">Buy</a>
            <p className="text-xl font-normal">From $199/month or $999</p>
        </div>
    </section>
  )
}

export default Hero