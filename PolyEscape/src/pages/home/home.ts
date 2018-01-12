import { Component } from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';
import { OptionsPage } from '../options/options';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  optionsPage = OptionsPage;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController,private http: Http) {

  }
  askNameNewGame() {
    let prompt = this.alertCtrl.create({
      title: 'Créer une partie',
      message: "Entrez le nom de la nouvelle partie",
      inputs: [
        {
          name: 'nom',
          placeholder: 'Nom'
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Créer',
          handler: data => {
            this.http.get('http://localhost:8080/addGame/'+ data).pipe(
              map(res => res.json())
            ).subscribe(response => {
              console.log('GET Response:', response);
            });
          }
        }
      ]
    });
    prompt.present();
  }

  askNameExistingGame() {
    let prompt = this.alertCtrl.create({
      title: 'Rejoindre une partie',
      message: "Entrez le nom de la partie existante",
      inputs: [
        {
          name: 'nom',
          placeholder: 'Nom'
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Rejoindre',
          handler: data => {
            this.http.get('http://localhost:8080/getGame/'+ data).pipe(
              map(res => res.json())
            ).subscribe(response => {
              console.log('GET Response:', response);
            });
          }
        }
      ]
    });
    prompt.present();
  }

}
