import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { NavController, Form } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements AfterViewInit {
  constructor(public navCtrl: NavController) {}

  ngAfterViewInit() {
    // Grab elements, create settings, etc.
    const video: HTMLVideoElement   = document.getElementById("myVideo")  as HTMLVideoElement;
    const canvas: HTMLCanvasElement = document.getElementById("myCanvas") as HTMLCanvasElement;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

    this.startVideoFeed(video);

    const self = this;
    let i = 0;
    const snap = function() {
      // draw image to canvas
      ctx.drawImage(video, 0, 0, 640, 480);
      canvas.toBlob(function(blob) {
        self.upload(blob);
      }, "image/jpeg", 0.95)

    };
    const interval = setInterval(snap, 1000);

  }

  startVideoFeed(video) {
    // Get access to the camera!
    if (!navigator.mediaDevices) {
      console.log("navigator.mediaDevices: " + navigator.mediaDevices);
    } else if (!navigator.mediaDevices.getUserMedia) {
      console.log("navigator.mediaDevices.getUserMedia: " + navigator.mediaDevices.getUserMedia);
    } else {
      // Not adding `{ audio: true }` since we only want video now
      navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        const url = window.URL.createObjectURL(stream);
        console.log(url);
        video.src = url;
        video.play();
      });
    }
  }

  upload(blob) {
    const formData = new FormData();
    formData.append("image", blob);

    const xhr = new XMLHttpRequest();
    const async = true;
    xhr.open("POST", "/api/solve", async);
    xhr.send(formData);
  }
}
