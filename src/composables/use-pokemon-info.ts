import { computed, watchEffect, ref } from "vue";
import { useFetch } from "@vueuse/core";

export function usePokemonInfo() {
  interface Pokemon {
    name: string;
  }

  const pokemonPath = ref("");
  const pokemonInfo = ref<Pokemon[]>();

  useFetch<Pokemon>(pokemonPath, {
    refetch: true,
    afterFetch(response) {
      console.log(pokemonPath.value);
      console.log(response.data);
      response.data = JSON.parse(response.data);
      pokemonInfo.value = response.data || "";
      return response;
    },
  });

  return { pokemonInfo, pokemonPath };
}
