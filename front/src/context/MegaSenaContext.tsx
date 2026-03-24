import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Interface define o "formato" dos dados do concurso
// É como um contrato que diz quais campos existem e seus tipos
interface Concurso {
  concurso: number;
  data: string;
  bola1: number;
  bola2: number;
  bola3: number;
  bola4: number;
  bola5: number;
  bola6: number;
  ganhadores_6_acertos: number;
  rateio_6_acertos: string;
  ganhadores_5_acertos: number;
  rateio_5_acertos: string;
  ganhadores_4_acertos: number;
  rateio_4_acertos: string;
  acumulado_6_acertos: string;
  arrecadacao_total: string;
  estimativa_premio: string;
  cidade_uf: string | null;
  message?: string; // campo extra para quando o concurso não existir
}

// Interface que define quais funções e dados o contexto disponibiliza
interface MegaSenaContextType {
  concurso: Concurso | null;
  loading: boolean;
  buscarConcurso: (numero?: number) => void;
}

// Cria o contexto com um valor padrão vazio
const MegaSenaContext = createContext<MegaSenaContextType>(
  {} as MegaSenaContextType
);

// Provider é o componente que "envolve" a aplicação e fornece os dados
// Tudo que estiver dentro dele tem acesso ao contexto
export function MegaSenaProvider({ children }: { children: ReactNode }) {
  const [concurso, setConcurso] = useState<Concurso | null>(null);
  const [loading, setLoading] = useState(false);

  // import.meta.env lê as variáveis do arquivo .env do Vite
  const API = import.meta.env.VITE_API_URL;

  const buscarConcurso = async (numero?: number) => {
    setLoading(true);
    try {
      // Se passou número, busca esse concurso específico
      // Se não passou, busca o mais recente (rota raiz /)
      const url = numero ? `${API}/${numero}` : `${API}/`;
      const response = await fetch(url);
      const data = await response.json();
      setConcurso(data);
    } catch (err) {
      console.error('Erro ao buscar concurso:', err);
    } finally {
      // finally sempre executa, mesmo se der erro
      setLoading(false);
    }
  };

  // useEffect com array vazio [] roda apenas UMA VEZ
  // quando o componente é montado pela primeira vez
  // É aqui que carregamos o concurso mais recente automaticamente
  useEffect(() => {
    buscarConcurso();
  }, []);

  return (
    <MegaSenaContext.Provider value={{ concurso, loading, buscarConcurso }}>
      {children}
    </MegaSenaContext.Provider>
  );
}

// Hook customizado para usar o contexto de forma mais simples
// Em vez de escrever useContext(MegaSenaContext) toda vez,
// basta escrever useMegaSena()
export const useMegaSena = () => useContext(MegaSenaContext);