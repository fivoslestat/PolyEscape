/**
 * Created by Julien on 14/01/2018.
 */
"use strict";

const GameState = {
    WAITING: Symbol("En attente de joueurs"),
    RUNNING: Symbol("En cours"),
    FINISHED: Symbol("Terminée")
};

module.exports = class Game {

    constructor(id, name) {
        this.id = id;
        this.name = name.toLowerCase();
        this.chief;
        this.state = GameState.WAITING;
        this.players = [];
        this.scenario;
    }
    getName() {
        return this.name;
    }

    addPlayer(play){
        this.players.push(play);
    }

    hasPlayerNamed(name){
        return (this.players.findIndex(i => i.toLowerCase() === name.toLowerCase()) != -1);
    }

    setScenario(scenar){
        this.scenario = scenar;
    }

    setChief(ch){
        this.chief = ch;
    }

    getChief() {
        return this.chief;
    }

    getPlayers(){
        return this.players;
    }

    run(){
        this.state = GameState.RUNNING;
    }

    finish(){
        this.state = GameState.FINISHED;
    }
};