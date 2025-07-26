import { useEffect, useRef, useState } from "react"
import { hightlightsSlides } from "../constants/index.js"
import gsap from "gsap";
import { pauseImg, playImg, replayImg } from "../utils/index.js";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VideoCaraousel = () => {

    const videoRef = useRef([]);
    const videoSpanRef = useRef([]);
    const videoDivRef = useRef([]);
    const [loadedData,setLoadedData] = useState([]);

    const [video,setVideo] = useState({
        isEnd  : false,
        startPlay : false,
        videoId : 0,
        isLastVideo : false,
        isPlaying : false
    });

    const {isEnd,startPlay,videoId,isLastVideo,isPlaying} = video;

    const handleLoadedMetaData = (i,e) => setLoadedData((pre) => [...pre,e])

    useEffect(() => {
        if(loadedData.length > 3) {
            if(!isPlaying) {
                videoRef.current[videoId].pause();
            }
            else{
                startPlay && videoRef.current[videoId].play();
            }
        }
    },[startPlay,videoId,isPlaying,loadedData])

    useEffect(()=>{

        let currentProgress = 0;
        let span = videoSpanRef.current;

        if(span[videoId]) {
            let anim = gsap.to(span[videoId],{
                onUpdate : () => {
                    const progress = Math.ceil(anim.progress() * 100)

                    if (currentProgress != progress) {
                        currentProgress = progress;

                        gsap.to(videoDivRef.current[videoId],{
                            width : window.innerWidth < 760 ?
                            '10vw' : window.innerWidth < 1200 ? '10vw' : '4vw'
                        })

                        gsap.to(span[videoId],{
                            width : `${currentProgress}%`,
                            backgroundColor : 'white'
                        })
                    }
                },
                onComplete : () => {
                    if(isPlaying) {
                        gsap.to(videoDivRef.current[videoId],{
                            width : '12px'
                        })

                        gsap.to(span[videoId],{
                            backgroundColor : '#afafaf'
                        }) 
                    }
                }
            })

            if(videoId === 0) {
                anim.restart()
            }

            const animUpdate = () => {
                anim.progress(videoRef.current[videoId].currentTime / hightlightsSlides[videoId].videoDuration)
            }
    
            if(isPlaying) {
                gsap.ticker.add(animUpdate)
            }
            else{
                gsap.ticker.remove(animUpdate)
            }
        }

    },[videoId,startPlay,isPlaying])

    const handleProcess = (type,i) => {
        switch(type) {
            case 'video-end' : 
                setVideo((pre) => ({...pre,isEnd : true,videoId : i + 1}))
                break;
            case 'video-last' : setVideo((pre) => ({...pre,isLastVideo : true}))
                break;
            case 'video-reset' : setVideo((pre) => ({...pre,isLastVideo : false,videoId : 0}))
                break;
            case 'play' : setVideo((pre) => ({...pre,isPlaying : !pre.isPlaying}))
                break;
            case 'pause' : setVideo((pre) => ({...pre,isPlaying : !pre.isPlaying}))
                break;
            
            default : 
                return video;
        }
    }

    useGSAP(() => {

        gsap.to('#slider',{
            transform: `translateX(${-100*videoId}%)`,
            duration : 2,
            ease : 'power2.inOut'
        })
        gsap.to('#video',{
            scrollTrigger : {
                trigger : '#video',
                toggleActions : 'restart none none none'
            },
            onComplete : () => {
                setVideo((pre) => ({...pre,startPlay : true,isPlaying : true}))
            }
        })
    },[isEnd,videoId])
  return (
    <>
        <div className="flex items-center overflow-hidden">
            {hightlightsSlides.map((list,i)=>(
                <div key={list.id} id='slider' className="sm:pr-20 pr-10">
                    <div className="video-carousel_container">
                        <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                            <video 
                                id="video"
                                playsInline={true}
                                preload="auto"
                                muted
                                ref={(e) => {
                                    videoRef.current[i] = e
                                }}
                                className={`${list.id == 2 && "translate-x-44"} pointer-events-none`}
                                onPlay={() => {
                                    setVideo((prevVideo) => ({
                                        ...prevVideo, isPlaying : true
                                    }))
                                }}
                                onLoadedMetadata={(e) => handleLoadedMetaData(i,e)}
                                onEnded={() => i !== 3 ? handleProcess('video-end',i) : handleProcess('video-last')}
                            >
                                <source src={list.video} type="video/mp4"/>
                            </video>
                        </div>
                        <div className="absolute top-12 left-[5%] z-10">
                            {list.textLists.map((text) => (
                                <p key={text} className="text-xl md:text-2xl font-medium">{text}</p>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <div className="relative flex-center mt-10">
            <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
                {videoRef.current.map((_,i) => (
                    <span 
                        key={i} 
                        ref={(e) => 
                            (videoDivRef.current[i] = e)
                        }
                        className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
                    >
                    <span className="absolute h-full w-full rounded-full"
                        ref={(e) => 
                            (videoSpanRef.current[i] = e)
                        }
                    ></span>
                    </span>))}
            </div>

            <button className="control-btn">
                <img 
                    src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg} 
                    alt={isLastVideo ? 'replay' : !isPlaying ? 'play' : 'pause'}
                    onClick={()=>{
                        isLastVideo ? handleProcess('video-reset') : !isPlaying ? handleProcess('play') : handleProcess('pause')
                    }}
                />
            </button>
        </div>
    </>
  )
}

export default VideoCaraousel