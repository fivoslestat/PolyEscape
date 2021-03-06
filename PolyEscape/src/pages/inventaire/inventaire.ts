import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {Observable} from "rxjs/Observable";
import {Socket} from 'ng-socket-io';
import {Http} from "@angular/http";
import {InventoryProvider} from "../../providers/inventory/inventory";
import {IndicationsProvider} from "../../providers/indications/indications";
import {PlatformHelper} from "../../models/platform-model";

/**
 * Generated class for the InventairePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-inventaire',
  templateUrl: 'inventaire.html',
})
export class InventairePage {

  platformHelper;

  qrData = null;
  createdCode = null;
  scannedCode = null;

  numero = null;
  user;
  game;
  questions;
  item;

  listItems: Array<{ name: string, pathImg: string, quantity: number }>;

  constructor(public plt: Platform,private indicationService: IndicationsProvider,public toastCtrl: ToastController, private inventoryService: InventoryProvider, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private socket: Socket, private barcodeScanner: BarcodeScanner) {

    this.platformHelper = new PlatformHelper(this.plt);

    this.user = navParams.get('user');
    this.game = navParams.get('game');

    this.inventoryService.getInventory(this.game.name).subscribe(res => {
      this.listItems = [];
      for (var i = 0; i < res['inventory'].length; i++) {
        this.listItems.push({name: res['inventory'][i].name, pathImg: res['inventory'][i].pathImg, quantity: res['inventory'][i].quantity});
      }
    });

    this.getNewItems().subscribe(item => {
      this.listItems = [];
      for (var i = 0; i < item['game']['inventory'].length; i++) {
        this.listItems.push({name: item['game']['inventory'][i].name, pathImg: item['game']['inventory'][i].pathImg, quantity: item['game']['inventory'][i].quantity});
      }
    });
  }

  recupererItem() {

    let bonItem = false;

    for (var i = 0; i < this.game.missions.length; i++) {

      // le numéro scanné correspond bien à l'item que le user doit rechercher : pas lisible
      //TODO : Ecrire une méthode
      if (this.game.missions[i].mission.item == this.numero && this.game.missions[i].player == this.user) {
        bonItem = true;
        this.bonItemToast();
        this.navCtrl.push('EnigmePage', {'questions': this.game.missions[i].mission.questions, 'numero': this.numero, 'game': this.game, 'user': this.user, 'item': {name: this.numero}});
        break;
      }
    }
    if(!bonItem){
      this.mauvaisItemAlert();
    }
  }


  bonItemToast() {
    let toast = this.toastCtrl.create({
      message: "Item trouvé ! Répondez à l'énigme pour le récupérer.",
      position: 'top',
      duration: 4000
    });
    toast.present();
  }

  mauvaisItemAlert() {
    let alert = this.alertCtrl.create({
      title: "Cherchez encore, ce n'est pas le bon item !",
      subTitle: "Vous pouvez partager cette localisation avec vos coéquipiers dans l'onglet 'Carte'",
      buttons: [
        {
          text: 'Ok',
          handler: data => {
            console.log('Cancel clicked');
          }
        }]
    });
    alert.present();
  }


  createCode() {
    this.createdCode = this.qrData;
  }

  scanCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.numero = barcodeData.text;
      this.recupererItem();
    }, (err) => {
      console.log('Error: ', err);
    });
  }

  getNewItems() {
    let observable = new Observable(observer => {
      this.socket.on('item_added', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  addItem() {

  }


}
