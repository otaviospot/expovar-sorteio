import { useEffect, useState } from "react";
import { apiGetPostType } from "../services/apiService";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { MdOutlineMenu } from "react-icons/md";
import style from "../components/sorteio-style.module.css";
import logoExpovar from "../assets/logo-expovar.png";
import logoEstrela from "../assets/estrela.png";
import logoSuprema from "../assets/suprema.png";
import logoNewbasca from "../assets/logo-branco.png";
import Loading from "../components/Loading";
import Sorteados from "./Sorteados";

const Sorteio = () => {
  const [loading, setLoading] = useState(true);
  const [loadingSorteado, setLoadingSorteado] = useState(true);
  const [show, setShow] = useState(false);
  const [sorteado, setSorteado] = useState(null);
  const [showList, setShowList] = useState(false);
  const [sorteados, setSorteados] = useState([]);

  const firebaseConfig = {
    apiKey: "AIzaSyB0Z_YklOLteH8Q08GwhqzRrvckzcro0o4",
    authDomain: "expovar-sorteio.firebaseapp.com",
    projectId: "expovar-sorteio",
    storageBucket: "expovar-sorteio.appspot.com",
    messagingSenderId: "1001169184543",
    appId: "1:1001169184543:web:2bb6d75b1701f11a0e722a",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Para Firestore
  const db = getFirestore(app);

  const checkIfCupomSorteado = async (cupom) => {
    const sorteadosRef = collection(db, "sorteados");
    const q = query(sorteadosRef, where("cupom", "==", cupom));
    const querySnapshot = await getDocs(q);

    // Retorna verdadeiro se houver um documento com o cupom
    return querySnapshot.docs.length > 0;
  };

  const getSorteio = async () => {
    setLoading(true);
    setShow(true); // Mostra o componente de carregamento
    let novoSorteado = null;

    try {
      const postTypeBackEndContent = await apiGetPostType("sorteio");

      do {
        if (postTypeBackEndContent.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * postTypeBackEndContent.length
          ); // Índice aleatório
          novoSorteado = postTypeBackEndContent[randomIndex]; // Sorteia um cupom

          const isCupomSorteado = await checkIfCupomSorteado(
            novoSorteado.acf.cupom
          );

          if (!isCupomSorteado) {
            break; // Se o cupom não foi sorteado, sai do loop
          }
          novoSorteado = null;
        } else {
          console.log("Nenhum conteúdo disponível para sorteio");
        }
      } while (novoSorteado === null); // Re-sorteia se o cupom já foi sorteado

      setSorteado(novoSorteado); // Atualiza o sorteado
    } catch (error) {
      console.error("Erro ao obter sorteio:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSorteio = async () => {
    await getSorteio(); // Chama getSorteio para atualizar e sortear
  };

  useEffect(() => {
    // Carregar cupons sorteados do local storage ao inicializar
    const writeData = async () => {
      console.log("sortea");
      if (sorteado) {
        console.log("if sorteado");
        try {
          // Adiciona um documento ao Firestore
          const docRef = await addDoc(collection(db, "sorteados"), {
            nome: sorteado.acf.nome,
            cupom: sorteado.acf.cupom,
            telefone: sorteado.acf.telefone,
            email: sorteado.acf.email,
            empresa: sorteado.acf.empresa,
            cnpj: sorteado.acf.cnpj,
            sorteadoEm: new Date().toISOString(), // Data e hora do sorteio
          });
          console.log("Documento adicionado com ID:", docRef.id);
        } catch (error) {
          console.error("Erro ao adicionar documento ao Firestore:", error);
        }
      }
    };
    writeData();
  }, [sorteado]);

  const listaSorteados = async () => {
    setLoadingSorteado(true);
    try {
      const querySnapshot = await getDocs(collection(db, "sorteados")); // Obtem todos os documentos da coleção
      const sorteadosData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(), // Obtem dados do documento
      }));
      setSorteados(sorteadosData); // Atualiza o estado com a lista de sorteados
      console.log("Sorteados:", sorteadosData);
      setLoadingSorteado(false);
    } catch (error) {
      console.error("Erro ao obter dados do Firestore:", error);
    }
  };

  useEffect(() => {
    listaSorteados();
  }, []);

  const handleOpenCloseList = () => {
    setShowList(!showList);
    if (!showList) {
      listaSorteados();
    }
  };

  return (
    <div
      className={`${style.bgImg} w-full h-auto min-h-[100vh] flex flex-col justify-between bg-no-repeat pt-[35px]`}
    >
      <Sorteados
        sorteados={sorteados}
        showList={showList}
        handleOpenCloseList={handleOpenCloseList}
        loadingSorteado={loadingSorteado}
      />

      <div className={`flex w-full items-center justify-center`}>
        <img
          src={logoExpovar}
          alt="Logo Expovar"
          className="w-auto max-w-[300px] h-auto"
        />
        <span
          className="absolute right-[20px] text-white text-[30px] cursor-pointer"
          onClick={handleOpenCloseList}
        >
          <MdOutlineMenu />
        </span>
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
