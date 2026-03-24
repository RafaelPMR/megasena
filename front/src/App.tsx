import React, { useState } from 'react';
import styled from 'styled-components';
import { MegaSenaProvider, useMegaSena } from './context/MegaSenaContext';

// ============================================================
// STYLED COMPONENTS — CSS escrito dentro do JavaScript
// Cada const aqui é um componente HTML com estilo aplicado
// ============================================================

const Container = styled.div`
  padding: 24px;
  font-family: Arial, sans-serif;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  width: 200px;
  
  &:focus {
    outline: none;
    border-color: #769ed3ff;
  }
`;

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  max-width: 450px;
  margin-top: 32px;
`;

const Titulo = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const BolasContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 16px 0;
`;

const Bola = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #000000ff;
  color: white;
  font-weight: bold;
  font-size: 16px;
`;

const Data = styled.p`
  color: #555;
  font-size: 14px;
  margin-top: 8px;
`;

const Mensagem = styled.h3`
  color: #333;
  font-weight: 500;
`;

const Loading = styled.p`
  color: #888;
  margin-top: 16px;
`;


function Conteudo() {
  // useMegaSena() acessa tudo que está no contexto
  const { concurso, loading, buscarConcurso } = useMegaSena();
  const [numero, setNumero] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setNumero(valor);

    if (valor === '') {
      // Campo vazio → busca o concurso mais recente
      buscarConcurso();
    } else {
      // Tem número → busca esse concurso específico
      buscarConcurso(Number(valor));
    }
  };

  // Formata a data para exibir em português
  // Ex: "2025-04-05" → "Sábado, 5 de abril de 2025"
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    // Adiciona 1 dia para corrigir o fuso horário UTC
    data.setDate(data.getDate() + 1);
    return data.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Container>
      <Input
        type="number"
        placeholder="Número do concurso"
        value={numero}
        onChange={handleChange}
      />

      {loading && <Loading>Carregando...</Loading>}

      {!loading && concurso && (
        <Card>
          {/* Se veio message, o concurso não existe */}
          {concurso.message ? (
            <Mensagem>{concurso.message}</Mensagem>
          ) : (
            <>
              <Titulo>MEGA-SENA - Concurso {concurso.concurso}</Titulo>
              <BolasContainer>
                {[
                  concurso.bola1,
                  concurso.bola2,
                  concurso.bola3,
                  concurso.bola4,
                  concurso.bola5,
                  concurso.bola6
                ].map((bola, index) => (
                  <Bola key={index}>{bola}</Bola>
                ))}
              </BolasContainer>
              <Data>{formatarData(concurso.data)}</Data>
            </>
          )}
        </Card>
      )}
    </Container>
  );
}

// App envolve tudo com o Provider
// Qualquer componente dentro de MegaSenaProvider
// consegue acessar os dados do contexto
export default function App() {
  return (
    <MegaSenaProvider>
      <Conteudo />
    </MegaSenaProvider>
  );
}