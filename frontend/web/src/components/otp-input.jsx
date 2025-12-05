"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Check, Copy } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function Verific({ className, ...props }) {
  const searchParams = useSearchParams();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPasted, setIsPasted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const inputRefs = useRef([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    try {
      const e = searchParams?.get?.('email') || '';
      if (e) setEmail(decodeURIComponent(e));
    } catch (err) {
      try {
        const params = new URLSearchParams(window.location.search);
        const e = params.get('email') || '';
        if (e) setEmail(decodeURIComponent(e));
      } catch (/*ignored*/_) {}
    }
  }, [searchParams]);

  useEffect(() => {
    const allFilled = otp.every(digit => digit !== '');
    setIsComplete(allFilled);
  }, [otp]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setIsPasted(false);

    if (value && index < 5) { inputRefs.current[index + 1]?.focus(); }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {inputRefs.current[index - 1]?.focus();}
    else if (e.key === 'ArrowLeft' && index > 0) { inputRefs.current[index - 1]?.focus(); }
    else if (e.key === 'ArrowRight' && index < 5) { inputRefs.current[index + 1]?.focus(); }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);

    if (pastedData.length > 0) {
      const newOtp = Array(6).fill('');
      for (let i = 0; i < Math.min(pastedData.length, 6); i++) { newOtp[i] = pastedData[i]; }
      setOtp(newOtp);
      setIsPasted(true);

      const nextEmptyIndex = newOtp.findIndex(digit => digit === '');
      const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
      setTimeout(() => inputRefs.current[focusIndex]?.focus(), 0);
    }
  };

  const clearOtp = () => {
    setOtp(['', '', '', '', '', '']);
    setIsPasted(false);
    setIsComplete(false);
    inputRefs.current[0]?.focus();
  };

  const copyOtp = () => {
    const otpString = otp.join('');
    navigator.clipboard.writeText(otpString);
  };

  async function verifyCode() {
    if (!isComplete) return;
    setLoading(true);
    setErrorMsg('');
    const code = otp.join('');
    try {
      const res = await fetch(`${API_URL}/auth/codigo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo_reset: code }),
      });
      const data = await res.json();
      if (res.ok && data.sucesso) {
        toast.success('Código verificado. Redirecionando...');
        router.push(`/redefinicaoSenha?codigo=${encodeURIComponent(code)}${email ? `&email=${encodeURIComponent(email)}` : ''}`);
        return;
      }

      const err = data?.erro || data?.message || 'Código inválido.';
      setErrorMsg(err);
      toast.error(err);
    } catch (err) {
      console.error('Erro ao verificar código:', err);
      setErrorMsg('Erro ao conectar ao servidor.');
      toast.error('Erro ao conectar ao servidor.');
    } finally {setLoading(false);}
  }

  useEffect(() => {
    if (!isComplete) return;
    const timer = setTimeout(() => {if (!loading) verifyCode();}, 350);
    return () => clearTimeout(timer);
  }, [isComplete]);

  const toggleTheme = () => { setIsDarkMode(!isDarkMode); };

  const themeClasses = {
    container: isDarkMode ? 'bg-gray-900 text-white min-h-screen' : 'bg-gray-50 text-gray-900 min-h-screen',
    // card: isDarkMode ? 'bg-black-800 border-none shadow-xl text-white' : 'bg-white border-gray-200 shadow-lg text-black',
    input: isDarkMode ? 'bg-black-700 border-gray-600 text-white focus:border-[#99BF0F] focus:ring-[#99BF0F]' : 'bg-white border-gray-300 text-gray-900 focus:border-[#99BF0F] focus:ring-[#99BF0F]',
    inputPasted: isDarkMode ? 'bg-green-800 border-green-600 text-green-100' : 'bg-green-50 border-green-400 text-green-800',
    inputComplete: isDarkMode ? 'bg-green-800 border-green-600 text-green-100' : 'bg-green-50 border-green-400 text-green-800',
    button: isDarkMode ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white',
    buttonSecondary: isDarkMode ? 'bg-black-600 hover:bg-gray-700 text-white border-gray-500' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300',
    themeButton: isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
  };

  return (
    <div className={`flex items-center justify-center p-4 transition-colors duration-200 `}>
      <div className="w-full ">
        <div className={`w-full h-full rounded-2xl transition-colors duration-200`}>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Verificar código</h1>
            <p className={`text-sm dark:text-gray-300 text-gray-600`}>
              Um código de verificação foi enviado para {email ? <strong>{email}</strong> : 'o email cadastrado'}.
            </p>
          </div>

          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, index) => (
              <input key={index} ref={(el) => inputRefs.current[index] = el} type="text" value={digit} onChange={(e) => handleChange(index, e.target.value)} onKeyDown={(e) => handleKeyDown(index, e)} onPaste={handlePaste} className={`w-12 h-14 text-center text-xl font-semibold rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isPasted ? themeClasses.inputPasted : isComplete ? themeClasses.inputComplete : themeClasses.input} ${isDarkMode ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}`} maxLength="1" autoComplete="off" />
             ))}
          </div>
          {errorMsg && (
              <div className="mb-6 text-sm text-red-600 dark:text-red-400">{errorMsg}</div>
            )}
          {/* Status Indicators */}
          {isPasted && (
            <div className="text-center mb-4">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${isDarkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-700'}`}>
                <Check size={14} />Código colado com sucesso!
              </span>
            </div>
          )}

          {/* {isComplete && (
            <div className="text-center mb-4">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${isDarkMode ? 'bg-black-800 text-white-200' : 'bg-blue-100 text-green-700'}`}>
                <Check size={14} />Code complete: {otp.join('')}
              </span>
            </div>
          )} */}

          {/* Action Buttons */}
          <div className="space-y-3 w-full">
            <div className="flex gap-2">
            <Button onClick={verifyCode} disabled={!isComplete || loading} variant="outline" size="lg" className="flex-1">
              {loading ? 'Verificando...' : 'Verificar Código'}
            </Button>
            </div>

            <div className="flex gap-2">
              <Button onClick={clearOtp} variant="ghost" size="sm" className="flex-1">
                Limpar
              </Button>

              {/* {isComplete && (
                <button onClick={copyOtp} className={`px-4 py-2 rounded-lg transition-colors duration-200 ${themeClasses.buttonSecondary}`} title="Copy OTP">
                  <Copy size={18} />
                </button>
              )} */}
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Não recebeu o código?{' '}
              <button className={`font-medium ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} transition-colors`}>Reenviar</button>
            </p>
            
          </div>
        </div>
      </div>
    </div>
  );
}