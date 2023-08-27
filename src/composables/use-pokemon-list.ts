import { computed, watchEffect, ref } from "vue";
import { useFetch } from "@vueuse/core";

export function usePokemonList() {
  interface Pokemon {
    name: string;
    url: string;
  }

  interface PokeData {
    results: Pokemon[];
  }

  const pokemonById = ref<Pokemon[]>([]); // sorted by ID
  const pokemonByName = ref<Pokemon[]>([]); // sorted by name
  const pokemonVisible = ref<Pokemon[][]>([]); // showing 12 at a time
  const offset = ref(0);
  const orderBy = ref<"id" | "name">("id");
  const total = computed(() => pokemonById.value.length);

  const { isFetching, error, data } = useFetch<PokeData>(
    "https://pokeapi.co/api/v2/pokemon?limit=10000",
    {
      afterFetch(response) {
        response.data = JSON.parse(response.data);

        pokemonById.value = response.data.results || [];
        pokemonByName.value = [...pokemonById.value].sort((a, b) => {
          return a.name.localeCompare(b.name);
        });

        return response;
      },
    }
  );

  watchEffect(() => {
    let pokemonSlice =
      orderBy.value === "id"
        ? pokemonById.value?.slice(offset.value, offset.value + 12)
        : pokemonByName.value?.slice(offset.value, offset.value + 12);
    pokemonVisible.value = convertTo2DArray(pokemonSlice, 4);
  });

  function convertTo2DArray(array: Pokemon[], columns: number) {
    const result = [];
    for (let i = 0; i < array.length; i += columns) {
      result.push(array.slice(i, i + columns));
    }
    return result;
  }

  function loadNext() {
    offset.value += 12;
  }
  function loadPrevious() {
    offset.value -= 12;
  }

  return { pokemonVisible, offset, orderBy, total, loadNext, loadPrevious };
}
