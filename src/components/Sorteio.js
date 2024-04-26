import { useEffect, useState } from 'react';
import { apiGetPostType } from '../services/apiService';
import style from '../components/sorteio-style.module.css';
import logoExpovar from '../assets/logo-expovar.png';
import logoEstrela from '../assets/estrela.png';
import logoSuprema from '../assets/suprema.png';
import logoNewbasca from '../assets/logo-branco.png';
import Loading from '../components/Loading';

const Sorteio = () => {
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [sorteioContent, setSorteioContent] = useState([]);
  const [sorteado, setSorteado] = useState(null);
  const [cuponsSorteados, setCuponsSorteados] = useState([]);

  useEffect(() => {
    // Carregar cupons sorteados do local storage ao inicializar
    const cuponsSalvos =
      JSON.parse(localStorage.getItem('cuponsSorteados')) || [];
    setCuponsSorteados(cuponsSalvos);
  }, []);

  const getSorteio = async () => {
    setLoading(true);
    setShow(true); // Mostra o componente de carregamento
    try {
      const postTypeBackEndContent = await apiGetPostType('sorteio');
      let novoSorteado = null;
      do {
        if (postTypeBackEndContent.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * postTypeBackEndContent.length
          ); // Índice aleatório
          novoSorteado = postTypeBackEndContent[randomIndex]; // Sorteia um cupom
        } else {
          console.log('Nenhum conteúdo disponível para sorteio');
        }
      } while (
        novoSorteado &&
        cuponsSorteados.includes(novoSorteado.acf.cupom)
      ); // Re-sorteia se o cupom já foi sorteado

      setSorteioContent(postTypeBackEndContent); // Atualiza o conteúdo do sorteio
      setSorteado(novoSorteado); // Atualiza o sorteado

      // Adiciona o cupom sorteado à lista de cupons sorteados e salva no local storage
      if (novoSorteado && !cuponsSorteados.includes(novoSorteado.acf.cupom)) {
        setCuponsSorteados([...cuponsSorteados, novoSorteado.acf.cupom]);
        localStorage.setItem(
          'cuponsSorteados',
          JSON.stringify([...cuponsSorteados, novoSorteado.acf.cupom])
        );
      }
    } catch (error) {
      console.error('Erro ao obter sorteio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSorteio = async () => {
    await getSorteio(); // Chama getSorteio para atualizar e sortear
  };

  return (
    <div
      className={`${style.bgImg} w-full h-auto min-h-[100vh] flex flex-col justify-between bg-no-repeat pt-[35px]`}
    >
      <div className={`flex self-center justify-center`}>
        <img
          src={logoExpovar}
          alt="Logo Expovar"
          className="w-auto max-w-[300px] h-auto"
        />
      </div>
      <div className="flex flex-row w-full justify-between py-10">
        <div className="pl-[140px] w-1/2 pr-10">
          <h2 className="text-white text-[6vw] font-bold">SORTEIO</h2>
          <div className="bg-white h-[4px] w-auto rounded-xl	mt-[19px] mb-[22px]"></div>
          <h2 className="text-[#F18319] text-[30px] font-bold mb-[55px]">
            CLIQUE NO BOTÃO ABAIXO PARA SORTEAR O NÚMERO VENCEDOR!
          </h2>
          <button
            onClick={handleSorteio}
            className="bg-[#F18319] text-white py-[22px] px-[78px] rounded-[50px] text-[30px] font-bold hover:scale-110 transition-transform duration-300"
          >
            SORTEAR
          </button>
        </div>

        <div className="bg-[#F18319] pt-[20px] w-1/2 h-auto rounded-t-3xl rounded-bl-3xl flex flex-col justify-center items-center p-10">
          {!loading ? (
            <>
              <h2 className="text-white text-[4vw] font-bold w-full text-center">
                SORTEADO:
              </h2>
              <h2 className="text-white font-bold flex items-center flex-col mb-5 pb-5 border-b w-full">
                <span className="text-[2vw] font-normal leading-none">
                  Cupom:
                </span>
                <span className="text-[6vw] leading-none mt-[10px] text-[#071942]">
                  {sorteado.acf.nome && sorteado.acf.cupom}
                </span>
              </h2>
              <h2 className="text-white flex items-center flex-col">
                <span className="text-[2vw] font-normal leading-none">
                  Nome:
                </span>
                <span className="text-[3vw] font-normal mt-[10px] leading-tight text-[#071942] text-center">
                  {sorteado.acf.nome && sorteado.acf.nome}
                </span>
              </h2>
            </>
          ) : (
            <Loading loading={show} />
          )}
        </div>
      </div>

      <div className="bg-[#071942] flex flex-row justify-center items-center py-[20px]">
        <h3 className="text-white text-[20px] font-medium pr-[20px]">
          REALIZAÇÃO:
        </h3>
        <div className={`mr-[30px]`}>
          <img
            src={logoEstrela}
            alt="Logo Estrela"
            className="w-[80px] h-auto"
          />
        </div>
        <div className={`mr-[50px]`}>
          <img
            src={logoSuprema}
            alt="Logo Suprema"
            className="w-[80px] h-auto"
          />
        </div>
        <h3 className="text-white text-[20px] font-medium pr-[20px]">APOIO:</h3>
        <div>
          <img
            src={logoNewbasca}
            alt="Logo Newbasca"
            className="w-[120px] h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Sorteio;
