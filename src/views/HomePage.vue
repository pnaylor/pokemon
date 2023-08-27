<template>
  <ion-page>
    <ion-toolbar>
      <ion-title slot="start">All The Pokemon!</ion-title>
      <ion-radio-group v-model="orderBy" @ionChange="resetOffset" slot="end">
        <ion-radio value="name" labelPlacement="end">Sort Name</ion-radio>
        <ion-radio value="id" labelPlacement="end">Sort ID</ion-radio>
      </ion-radio-group>
    </ion-toolbar>

    <ion-content :fullscreen="true">
      <ion-grid v-if="pokemonVisible.length">
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
      <div v-else class="spinner-container">
        <ion-spinner name="crescent"></ion-spinner>
      </div>
    </ion-content>

    <ion-toolbar>
      <ion-button
        :onclick="loadPrevious"
        :disabled="offset < 1"
        slot="start"
        fill="outline"
      >
        Previous 12
      </ion-button>
      <ion-button
        :onclick="loadNext"
        :disabled="offset >= total"
        slot="end"
        fill="outline"
      >
        Next 12
      </ion-button>
    </ion-toolbar>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonContent,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { usePokemonList } from "../composables/use-pokemon-list";

const { pokemonVisible, offset, orderBy, total, loadPrevious, loadNext } =
  usePokemonList();

const spriteUrl: string =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

function getSpriteLink(url?: string) {
  // parse ID from pokemon's url then append to sprite path
  let segments = url ? url.split("/") : [];
  segments = segments.filter((segment) => segment !== "");
  let id = parseInt(segments.pop() || "1");

  return `${spriteUrl}${id}.png`;
}

function resetOffset() {
  offset.value = 0;
}
</script>

<style scoped>
ion-avatar {
  float: left;
  margin: 12px 0 12px 12px;
  background-color: gainsboro;
}

ion-button {
  text-transform: none;
  margin: 20px;
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

ion-radio {
  margin-right: 30px;
}

ion-spinner {
  vertical-align: center;
}

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 45vh;
}
</style>
