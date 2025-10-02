import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue): [T, (value: T | ((val: T) => T)) => void] {
  // Estado para armazenar nosso valor
  // Passar valor inicial para useState para que a função seja executada apenas uma vez
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      // Obter do localStorage local pela chave
      const item = window.localStorage.getItem(key);
      // Parse JSON armazenado ou se nenhum retorna valor inicial
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Se erro também retorna valor inicial
      console.log(error);
      return initialValue;
    }
  });

  // Retorna uma versão wrapped da função setter do useState que...
  // ... persiste o novo valor no localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permite que value seja uma função, então temos a mesma API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Salva no estado
      setStoredValue(valueToStore);
      // Salva no localStorage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // Uma implementação mais avançada lidaria com o caso de erro
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;