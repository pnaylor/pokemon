<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>All The Pokemon!</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row v-for="pokemonRow in pokemonVisible">
          <ion-col v-for="pokemon in pokemonRow">
            <ion-card>
              <ion-avatar>
                <img :src="getSpriteLink(pokemon.url)" />
              </ion-avatar>
              <ion-card-content class="ion-text-capitalize">
                {{ pokemon.name }}
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { computed, watchEffect, ref } from "vue";
import { useFetch } from "@vueuse/core";

interface Pokemon {
  name: string;
  url: string;
}

interface PokeData {
  results: Pokemon[];
}

const { isFetching, error, data } = useFetch<PokeData>(
  "https://pokeapi.co/api/v2/pokemon?limit=24",
  {
    afterFetch(response) {
      response.data = JSON.parse(response.data);
      return response;
    },
  }
);

const pokemonById = ref<Pokemon[]>([]); // sorted by ID
const pokemonByName = ref<Pokemon[]>([]); // sorted by name
const pokemonVisible = ref<Pokemon[][]>([]); // showing 12 at a time

function convertTo2DArray(array: Pokemon[], columns: number) {
  const result = [];
  for (let i = 0; i < array.length; i += columns) {
    result.push(array.slice(i, i + columns));
  }
  return result;
}

watchEffect(() => {
  if (!isFetching.value) {
    pokemonById.value = data.value?.results || [];
    let pokemonSlice = pokemonById.value?.slice(0, 12);
    pokemonVisible.value = convertTo2DArray(pokemonSlice, 4);

    pokemonByName.value = pokemonById.value.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }
});

const spriteUrl: string =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

function getSpriteLink(url?: string) {
  let segments = url ? url.split("/") : [];
  segments = segments.filter((segment) => segment !== "");
  let id = parseInt(segments.pop() || "1");
  return `${spriteUrl}${id}.png`;
}

function updatePokemonVisible() {}
</script>

<style scoped>
ion-avatar {
  float: left;
  margin: 12px 0 12px 12px;
  background-color: gainsboro;
}

ion-card {
  align-items: center;
  display: flex;
}

ion-card-content {
  color: black;
}

@media (prefers-color-scheme: dark) {
  ion-card-content {
    color: white;
  }
}
</style>
