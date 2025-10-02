import { useEffect, useState } from "react";


export function useTranslation() {
    const [lang, setLang] = useState('pt-BR'); // lang: idioma atual -> pt-br. setLang: atualiza o estado 
    const [dict, setDict] = useState({}); // dict: cache local de traducoes

    // carrgar preferencias e o cache do localstorage
    useEffect(() => {
        const savedLang = localStorage.getItem('idioma') || "pt-BR";
        setLang(savedLang);
        const savedDict = localStorage.getItem(`translations_${savedLang}`);
        if (savedDict) {
            setDict(JSON.parse(savedDict));
        }
    }, [])

    async function translate(text) {
        if (lang === "pt-BR ") return text;

        // se ja tem traducao cacheada
        if (dict[text]) return dict[text];

        // senao, chama o back
        const res = await fetch('http://localhost:8080/translate', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, to: lang }),
        });
        const data = await res.json()
        const translated = data[0].translations[0].text;

        // atualiza cache total
        const newDict = { ...dict, [text]: translated };
        setDict(newDict);
        localStorage.setItem(`translations_${lang}`, JSON.stringify(newDict));

        return translated;
    }

    function changeLang(newLang) {
        setLang(newLang);
        localStorage.setItem('idioma', newLang);
    }

    return { lang, changeLang, translate }
} 