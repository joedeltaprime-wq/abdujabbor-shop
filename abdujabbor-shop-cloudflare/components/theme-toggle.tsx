'use client';
import {useTheme} from 'next-themes';
import {useEffect,useState} from 'react';
import {Moon,Sun} from 'lucide-react';
import {Switch} from '@/components/ui/switch';
import type {Lang} from '@/lib/catalog';
export function ThemeToggle({lang='uz'}:{lang?:Lang}){const {resolvedTheme,setTheme}=useTheme();const [ready,setReady]=useState(false);useEffect(()=>setReady(true),[]);const label={uz:'Tungi rejim',ru:'Ночной режим',en:'Dark mode'}[lang];return <label className="theme-control" title={label}><Sun size={17}/><Switch className="theme-switch" aria-label={label} disabled={!ready} checked={ready&&resolvedTheme==='dark'} onCheckedChange={checked=>setTheme(checked?'dark':'light')}/><Moon size={17}/></label>}
