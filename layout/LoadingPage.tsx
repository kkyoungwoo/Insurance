import Logo from '../components/logo/Logo';
import {dsnCN, pageLoad} from "../hooks/helper";
import {useEffect, useMemo, useRef, useState} from "react";
import {gsap} from "gsap";



interface LoadingProps {
    className?: string,
    glitchLogo?: boolean
}

function LoadingPage({className, glitchLogo = true}: LoadingProps) {

    const preloader = useRef<HTMLDivElement>(null);
    const $ = useMemo(() => gsap.utils.selector(preloader), [preloader]);
    const [progressValue, setProgressValue] = useState(0);
    const [remove, setRemove] = useState(false);
    const present = {value: 0};


    if(remove)
        return ;
}


export default LoadingPage;