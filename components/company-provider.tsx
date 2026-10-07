'use client';
import { createContext, useContext } from 'react';
import { company as defaults } from '@/lib/catalog';
export type Company = typeof defaults;
const Context = createContext<Company>(defaults);
export function CompanyProvider({ value, children }: {
    value: Company;
    children: React.ReactNode;
}) { return <Context.Provider value={value}>{children}</Context.Provider>; }
export function useContact() { const company = useContext(Context); const wa = (message = 'Hello Multi Equipment Trade and Services, I would like to make an inquiry.') => `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`; return { company, wa, productWa: (name: string) => wa(`Hello Multi Equipment Trade and Services, I am interested in ${name}. Please provide price and availability.`) }; }
