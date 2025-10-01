import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-api',
  templateUrl: './api.page.html',
  styleUrls: ['./api.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ApiPage implements OnInit {
  
  pokemon: any = null;
  evolution: any = null;
  carregando: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.buscarPokemon();
  }

  async buscarPokemon() {
    this.carregando = true;
    this.pokemon = null;
    this.evolution = null;
    const randomPokemonId = Math.floor(Math.random() * 1025) + 1;

    try {
      const pokemonData: any = await firstValueFrom(this.http.get(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`));
      this.pokemon = pokemonData;

      const speciesData: any = await firstValueFrom(this.http.get(pokemonData.species.url));

      const evolutionChainData: any = await firstValueFrom(this.http.get(speciesData.evolution_chain.url));
      
      const nextEvolutionName = this.findNextEvolution(evolutionChainData.chain, pokemonData.name);

      if (nextEvolutionName) {
        const evolutionData = await firstValueFrom(this.http.get(`https://pokeapi.co/api/v2/pokemon/${nextEvolutionName}`));
        this.evolution = evolutionData;
      }

    } catch (erro) {
      console.error('ERRO ao buscar o Pokémon ou sua evolução:', erro);
      this.pokemon = {
        name: 'Falha ao carregar.',
        sprites: { front_default: 'https://ionicframework.com/docs/img/demos/card-media.png' }
      };
    } finally {
      this.carregando = false;
    }
  }

  private findNextEvolution(chain: any, currentPokemonName: string): string | null {
    if (chain.species.name === currentPokemonName) {
      if (chain.evolves_to.length > 0) {
        return chain.evolves_to[0].species.name;
      }
      return null;
    }

    for (const evolution of chain.evolves_to) {
      const nextEvolution = this.findNextEvolution(evolution, currentPokemonName);
      if (nextEvolution) {
        return nextEvolution;
      }
    }

    return null;
  }
}