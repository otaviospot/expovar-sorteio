import { IoMdClose } from "react-icons/io";
import Loading from "../components/Loading";

const Sorteados = ({
  sorteados,
  showList,
  handleOpenCloseList,
  loadingSorteado,
}) => {
  const sorteadosOrdenados = sorteados?.sort((a, b) => {
    const dataA = new Date(a.sorteadoEm); // Converte para objeto Date
    const dataB = new Date(b.sorteadoEm); // Converte para objeto Date
    return dataA - dataB; // Ordena do mais antigo para o mais novo
  });

  return (
    <div
      className={`w-full md:w-1/2 fixed flex right-0 top-0 h-[100vh] bg-white z-10 transition-all ${
        loadingSorteado ? "justify-center items-center" : ""
      } ${showList ? "translate-x-[0%]" : "translate-x-[100%]"}`}
    >
      <span
        onClick={handleOpenCloseList}
        className="absolute top-[20px] right-[20px] text-[25px] text-blue cursor-pointer"
      >
        <IoMdClose />
      </span>
      {!loadingSorteado ? (
        <div className="flex flex-col w-full flex-grow px-10 py-10 overflow-auto">
          <div className="p-5 border-b bg-gray-200 flex">
            <span className="flex w-[20%]">Sorteio</span>
            <span className="flex w-[55%]">Nome</span>
            <span className="flex w-[25%]">Cupom</span>
          </div>
          {sorteadosOrdenados &&
            sorteadosOrdenados.map((sorteado, index) => (
              <div
                key={sorteado.id}
                className="p-5 border-b border-gray-200 flex"
              >
                <span className="flex w-[20%]">{index + 1}</span>
                <span className="flex w-[55%]">{sorteado.nome}</span>
                <span className="flex w-[25%]">
                  <strong>{sorteado.cupom}</strong>
                </span>
              </div>
            ))}
        </div>
      ) : (
        <Loading loading={loadingSorteado} />
      )}
    </div>
  );
};

export default Sorteados;
