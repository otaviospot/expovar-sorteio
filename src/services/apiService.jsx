import { read } from "./httpService";

export async function apiGetPostType(slug, perPage = 100) {
  let currentPage = 1;
  let allPosts = [];
  let hasMorePosts = true;

  while (hasMorePosts) {
    try {
      const postTypeContent = await read(
        `/${slug}?per_page=${perPage}&page=${currentPage}`
      );
      if (postTypeContent.length > 0) {
        allPosts = allPosts.concat(postTypeContent); // Adiciona os posts obtidos ao array
        currentPage++; // Avança para a próxima página
      } else {
        hasMorePosts = false; // Se a página estiver vazia, interrompe o loop
      }
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
      hasMorePosts = false; // Em caso de erro, interrompe o loop
    }
  }

  return allPosts; // Retorna todos os posts coletados
}

export async function apiGetPage(id) {
  const pageContent = await read(`/pages/${id}`);
  return pageContent;
}

export async function apiGetPostBySlug(slug) {
  const postTypeContent = await read(`/methodology?slug=${slug}`);
  return postTypeContent;
}
