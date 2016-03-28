import React, { Component } from 'react';
import 'phaser-shim';

class Game extends Phaser.Game {
  constructor (height, width, type, element, funcs) {
    super(height, width, type, element, funcs);
  }
}

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.game = new Game(800, 600, Phaser.AUTO, 'game-div', {create: this.phaserCreate, render: this.phaserRender, update: this.phaserUpdate});
    console.log("done initializing game instance");
  }
  render() {
    console.log("calling component render");
    return (
      <div>
        <div>
          Super Cool PhaserIO Game Engine
          <div id="game-div"></div>
        </div>
      </div>
    );
  }
  phaserCreate() {
    if(this.game) {
      console.log("Creating game object: ", this.game);
      var text = "- phaser -\n with a sprinkle of \n pixi dust.";
      var style = {font: "65px Arial", fill: "#ff0044", align: "center"};
      var t = this.game.add.text(this.game.world.centerX - 300, 0, text, style);
    } else {
      console.log("Error: phaser game object not defined (this.game is null)");
    }
  }
  phaserUpdate() {
  }
  phaserRender() {
    if(this.game) {
      this.game.debug.inputInfo(32, 32);
    }
  }
}
